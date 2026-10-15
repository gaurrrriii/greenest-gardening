/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f1',
          100: '#dcebe0',
          200: '#bbd7c2',
          300: '#8fbb9c',
          400: '#5e9871',
          500: '#3d7d54',
          600: '#2d6443',
          700: '#245036',
          800: '#1e402d',
          900: '#163322',
          950: '#0c1f14',
        },
        sand: {
          50: '#fbf8f3',
          100: '#f5eee0',
          200: '#e9dcc0',
          300: '#d9c495',
          400: '#c8a868',
          500: '#bb9050',
          600: '#a87a44',
          700: '#8b6039',
          800: '#714e34',
          900: '#5d4030',
        },
        cream: '#faf8f3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
