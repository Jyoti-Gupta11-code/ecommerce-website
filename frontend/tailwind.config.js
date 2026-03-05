/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // This tells Tailwind to scan all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {}, // You can add custom colors, fonts, spacing here
  },
  plugins: [], // Add Tailwind plugins here if needed
};


