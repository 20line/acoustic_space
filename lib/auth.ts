import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { verifyPassword } from './password'
import type { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // ── Email + Password ──────────────────────────────────────────────────
    CredentialsProvider({
      id: 'email',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user?.passwordHash) return null

        const ok = await verifyPassword(credentials.password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name,
          role: user.role,
        }
      },
    }),

    // ── Phone + OTP ───────────────────────────────────────────────────────
    CredentialsProvider({
      id: 'phone',
      name: 'Phone',
      credentials: {
        phone: { label: 'Телефон', type: 'tel' },
        code: { label: 'Код из SMS', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null

        const smsCode = await prisma.smsCode.findFirst({
          where: {
            phone: credentials.phone,
            used: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        })

        if (!smsCode) return null

        // Increment attempts before checking — prevents timing attacks
        await prisma.smsCode.update({
          where: { id: smsCode.id },
          data: { attempts: { increment: 1 } },
        })

        if (smsCode.attempts + 1 > 5) return null
        if (smsCode.code !== credentials.code) return null

        await prisma.smsCode.update({
          where: { id: smsCode.id },
          data: { used: true },
        })

        // Upsert — phone login is also registration
        const user = await prisma.user.upsert({
          where: { phone: credentials.phone },
          create: { phone: credentials.phone },
          update: {},
        })

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: UserRole }).role
        token.phone = (user as { phone?: string }).phone
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as UserRole
      return session
    },
  },
}
