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
        goblin: {
          bg: '#070d07',
          surface: '#0d1a0d',
          border: '#1a2e1a',
          green: '#39d353',
          purple: '#a855f7',
          gold: '#f59e0b',
          red: '#ff4444',
          muted: '#4a7a4a',
          dim: '#2a4a2a',
        },
      },
    },
  },
  plugins: [],
}
