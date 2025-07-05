/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: ["Bricolage Grotesque", "sans-serif"],
        slab: ["Roboto Slab", "serif"],
        extra: ["Sansation"],
      },
      screens: {
        "3xl": "1780px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
};
