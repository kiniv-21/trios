/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          900: '#1A103E',
          800: '#2D1B69',
          700: '#3D2A8A',
          600: '#4C37AB',
          500: '#5B44CC',
          400: '#7D69D6',
          300: '#9F8EE1',
          200: '#C0B3EB',
          100: '#E0D9F5',
          50: '#F0ECF9',
        },
        amber: {
          500: '#D4AF37',
          400: '#E0C158',
          300: '#ECD379',
          200: '#F5E5A1',
          100: '#FAF1C8',
        },
        gray: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2D2D2D',
          600: '#3D3D3D',
          500: '#4F4F4F',
          400: '#6E6E6E',
          300: '#9E9E9E',
          200: '#CFCFCF',
          100: '#E5E5E5',
          50: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'inner-white': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};