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
          DEFAULT: "#22D3EE",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        background: {
          DEFAULT: "#111827",
          lighter: "#1F2937",
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
