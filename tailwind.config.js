/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#c8fd42",
        },
        secondary: {
          DEFAULT: "#9381FF",
        },
        background: {
          DEFAULT: "#292929",
          light: "#3a3a3a",
          lighter: "#4a4a4a",
          dark: "#1f1f1f",
          darker: "#151515",
        },
        surface: "#374151",
        text: {
          DEFAULT: "#FFFFFF",
          secondary: "#9CA3AF",
        },
        accent: {
          yellow: "#F59E0B",
          red: "#EF4444",
        },
      },
    },
  },
  plugins: [],
};
