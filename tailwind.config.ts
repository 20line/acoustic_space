import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F2EA',
          '2': '#FCF9F3',
        },
        sand: '#EBE0CE',
        taupe: '#C9B79C',
        walnut: {
          DEFAULT: '#7A4E2E',
          dark: '#5E3B22',
        },
        espresso: '#241B14',
        ink: '#2C241D',
        muted: '#8C8073',
        accent: {
          DEFAULT: '#9A6A3C',
          hover: '#7A4E2E',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(46px,8vw,98px)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(36px,5.4vw,72px)', { lineHeight: '1.04' }],
        'sec-h': ['clamp(34px,4.8vw,58px)', { lineHeight: '1.04', letterSpacing: '0.005em' }],
        'about-h': ['clamp(32px,4.4vw,50px)', { lineHeight: '1.1' }],
        'card-h': ['27px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      spacing: {
        section: 'clamp(70px,8.5vw,128px)',
      },
      boxShadow: {
        premium: '0 24px 60px -28px rgba(44,30,18,.45)',
        'premium-hover': '0 32px 80px -24px rgba(44,30,18,.55)',
        card: '0 8px 32px -12px rgba(44,30,18,.25)',
        'card-hover': '0 16px 48px -12px rgba(44,30,18,.35)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(.16,1,.3,1)',
        'smooth': 'cubic-bezier(.4,0,.2,1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backgroundImage: {
        'walnut-grain': `repeating-linear-gradient(90deg,#7c5232 0 13px,#6a4528 13px 16px,#8a6038 16px 30px,#5d3c22 30px 33px)`,
        'espresso-gradient': 'linear-gradient(160deg,#3a2c20,#241b14)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'progress': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s cubic-bezier(.16,1,.3,1) forwards',
        'reveal-up': 'reveal-up 0.8s cubic-bezier(.16,1,.3,1) forwards',
        'scale-in': 'scale-in 0.6s cubic-bezier(.16,1,.3,1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [typography],
}

export default config
