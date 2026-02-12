/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#de5c1b",
        "background-light": "#f8f6f6",
        "background-dark": "#121212", // Landing page default
        "charcoal": "#211611",
        "silver": "#a1a1aa",
        // Auth specific
        "industrial-gray": "#212121",
        "metallic-silver": "#C0C0C0",
        "deep-charcoal": "#181311",
        "industrial-silver": "#a8a29e",
        "industrial-charcoal": "#181311",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}
