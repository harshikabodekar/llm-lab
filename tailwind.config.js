/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        grid: "#E7E9E2",
        ink: "#1A1D21",
        inkblue: "#2B4FD8",
        marker: "#FFD644",
        signal: "#12A150",
        alarm: "#D64545",
        faded: "#6B7280"
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'Instrument Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      }
    }
  },
  plugins: []
};
