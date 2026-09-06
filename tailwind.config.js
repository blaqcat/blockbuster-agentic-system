/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        film: {
          950: '#07090E',
          900: '#0B0D13',
          800: '#141721',
          700: '#1E2333',
          600: '#2C344B',
          gold: '#F59E0B',
          cyan: '#06B6D4',
          accent: '#6366F1'
        }
      }
    },
  },
  plugins: [],
}
