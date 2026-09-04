'use client'

// Cookie / analytics consent stored client-side. Technical cookies (cart, auth)
// always work; analytics (Yandex.Metrika) load only after an explicit "accepted".

export type ConsentValue = 'accepted' | 'declined'

export const CONSENT_KEY = 'cookie_consent'
export const CONSENT_EVENT = 'cookie-consent-change'

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'accepted' || v === 'declined' ? v : null
  } catch {
    return null
  }
}

export function setConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* private mode / storage disabled — analytics simply stay off */
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }))
}

/** Subscribe to consent changes. Returns an unsubscribe fn. */
export function onConsentChange(cb: (value: ConsentValue) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentValue>).detail
    if (detail) cb(detail)
  }
  window.addEventListener(CONSENT_EVENT, handler)
  return () => window.removeEventListener(CONSENT_EVENT, handler)
}
