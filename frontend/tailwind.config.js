/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#A4D4B4',
        'brand-peach': '#FFCF9C',
        'brand-brown': '#B96D40',
        'brand-dark': '#3B1C32',
      },
    },
  },
  plugins: [],
}