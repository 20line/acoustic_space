'use client'

import { useLenis } from '@/hooks/useLenis'
import { useRevealGroup } from '@/hooks/useReveal'

export default function LenisProvider() {
  useLenis()
  useRevealGroup()
  return null
}
