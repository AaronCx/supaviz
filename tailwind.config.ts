import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        supabase: '#3ECF8E',
      },
    },
  },
  plugins: [],
} satisfies Config
