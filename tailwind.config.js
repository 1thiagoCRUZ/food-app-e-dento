/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F59E0B',     
          orangeLight: '#FFF7ED',
          green: '#22C55E',
        },
        background: '#F9FAFB',
      }
    },
  },
  plugins: [],
}