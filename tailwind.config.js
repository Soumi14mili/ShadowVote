/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#06080D',
          900: '#0B0F19',
          850: '#101726',
          800: '#161F33',
          700: '#1E2B47',
          600: '#2A3C63',
          500: '#3D558C',
          400: '#5F7FBF',
          300: '#8DA7E0',
          200: '#C2D1F5',
          100: '#E6EDFC',
        },
        crescent: {
          gold: '#F59E0B',
          glow: '#FCD34D',
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          neon: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'crescent': '0 0 25px -5px rgba(245, 158, 11, 0.25), 0 0 10px -3px rgba(6, 182, 212, 0.2)',
        'crescent-glow': '0 0 35px 0px rgba(6, 182, 212, 0.3)',
        'privacy-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
