/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: { DEFAULT: "#2563eb", dark: "#1e40af" },
        fire: { DEFAULT: "#ea580c", dark: "#c2410c" },
        medical: { DEFAULT: "#16a34a", dark: "#15803d" },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
