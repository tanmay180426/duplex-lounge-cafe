/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0B0B',
          darker: '#070707',
          card: '#141414',
          cardHover: '#1B1B1B',
          elevated: '#202020',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F9F6F0',
          200: '#F5F1E8',
          300: '#E6DEC9',
          400: '#D5C7A3',
        },
        coffee: {
          50: '#FDF8F5',
          100: '#F7EDE2',
          200: '#EBD4C1',
          300: '#DDB892',
          400: '#D4A373',
          500: '#C68B59',
          600: '#A97142',
          700: '#7F4F24',
          800: '#58310E',
          900: '#3D2005',
        },
        muted: {
          light: '#CCCCCC',
          DEFAULT: '#A7A7A7',
          dark: '#6E6E6E',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(212, 163, 115, 0.35)',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
