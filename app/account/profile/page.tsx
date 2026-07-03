import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'

export const metadata: Metadata = {
  title: 'Профиль · ACOUSTIC SPACE',
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return <ProfileClient />
}
