/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'radar-dark': '#0a0e1a',
        'radar-card': '#111827',
        'radar-border': '#1e2a45',
        'radar-blue': '#4f8eff',
        'radar-cyan': '#00e5ff',
        'radar-green': '#00c853',
        'radar-yellow': '#ffd600',
        'radar-red': '#ff3d3d',
      },
    },
  },
  plugins: [],
}
