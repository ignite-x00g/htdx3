/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'ops-violet': '#7c3aed',
        'deep-purple': '#4c1d95',
        'glow-accent': '#c084fc',
        'contrast-neon': '#38bdf8',
        'text-light': '#f3f4f6',
      }
    },
  },
  plugins: [],
}
