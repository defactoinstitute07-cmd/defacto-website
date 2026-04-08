/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "Arial", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#ffc50f",
          light: "#ffe066",
          dark: "#cc9f0c",
        },
        secondary: {
          DEFAULT: "#193466",
          light: "#3551a3",
          dark: "#102046",
        },
      },
    },
  },
  plugins: [],
};
