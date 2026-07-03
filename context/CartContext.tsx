'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import type { CartState, CartItem, CartItemConfig } from '@/types/cart'

// ─── State ────────────────────────────────────────────────────────────────────

interface State {
  cart: CartState | null
  loading: boolean
  error: string | null
  drawerOpen: boolean
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_OK'; payload: CartState }
  | { type: 'FETCH_ERR'; payload: string }
  | { type: 'DRAWER_OPEN' }
  | { type: 'DRAWER_CLOSE' }
  | { type: 'CLEAR' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_OK':
      return { ...state, loading: false, cart: action.payload }
    case 'FETCH_ERR':
      return { ...state, loading: false, error: action.payload }
    case 'DRAWER_OPEN':
      return { ...state, drawerOpen: true }
    case 'DRAWER_CLOSE':
      return { ...state, drawerOpen: false }
    case 'CLEAR':
      return { ...state, cart: state.cart ? { ...state.cart, items: [], total: 0, count: 0 } : null }
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: CartState | null
  loading: boolean
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addItem: (item: {
    productId: string
    productName: string
    unitPrice: number
    quantity?: number
    config?: CartItemConfig
  }) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  clearError: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    cart: null,
    loading: false,
    error: null,
    drawerOpen: false,
  })
  const { status } = useSession()
  const prevStatusRef = useRef(status)

  const headers = useCallback((): HeadersInit => {
    return { 'Content-Type': 'application/json' }
  }, [])

  const syncCart = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const res = await fetch('/api/cart', { headers: headers() })
      if (!res.ok) throw new Error('Failed to load cart')
      const data = await res.json()
      dispatch({ type: 'FETCH_OK', payload: data })
    } catch (e) {
      dispatch({ type: 'FETCH_ERR', payload: (e as Error).message })
    }
  }, [headers])

  // Load cart on mount
  useEffect(() => {
    syncCart()
  }, [syncCart])

  // Merge guest cart when user logs in
  useEffect(() => {
    if (prevStatusRef.current === 'authenticated' || status !== 'authenticated') {
      prevStatusRef.current = status
      return
    }
    prevStatusRef.current = status

    const cookie = document.cookie.split(';').find((c) => c.trim().startsWith('_akusto_gc='))
    const guestCartId = cookie?.split('=')[1]?.trim()
    if (!guestCartId) return

    fetch('/api/cart/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestCartId }),
    })
      .then(() => syncCart())
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const addItem = useCallback(
    async (item: {
      productId: string
      productName: string
      unitPrice: number
      quantity?: number
      config?: CartItemConfig
    }) => {
      dispatch({ type: 'FETCH_START' })
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(item),
        })
        if (!res.ok) throw new Error('Failed to add item')
        const data = await res.json()
        dispatch({ type: 'FETCH_OK', payload: data })
        dispatch({ type: 'DRAWER_OPEN' })
      } catch (e) {
        dispatch({ type: 'FETCH_ERR', payload: (e as Error).message })
      }
    },
    [headers],
  )

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      dispatch({ type: 'FETCH_START' })
      try {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: 'PATCH',
          headers: headers(),
          body: JSON.stringify({ quantity }),
        })
        if (!res.ok) throw new Error('Failed to update item')
        const data = await res.json()
        dispatch({ type: 'FETCH_OK', payload: data })
      } catch (e) {
        dispatch({ type: 'FETCH_ERR', payload: (e as Error).message })
      }
    },
    [headers],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      dispatch({ type: 'FETCH_START' })
      try {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: 'DELETE',
          headers: headers(),
        })
        if (!res.ok) throw new Error('Failed to remove item')
        const data = await res.json()
        dispatch({ type: 'FETCH_OK', payload: data })
      } catch (e) {
        dispatch({ type: 'FETCH_ERR', payload: (e as Error).message })
      }
    },
    [headers],
  )

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        loading: state.loading,
        drawerOpen: state.drawerOpen,
        openDrawer: () => dispatch({ type: 'DRAWER_OPEN' }),
        closeDrawer: () => dispatch({ type: 'DRAWER_CLOSE' }),
        addItem,
        updateItem,
        removeItem,
        clearCart: () => dispatch({ type: 'CLEAR' }),
        clearError: () => dispatch({ type: 'FETCH_ERR', payload: '' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}

// Convenience: format price from kopecks
export function formatPrice(kopecks: number): string {
  return (kopecks / 100).toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  })
}
