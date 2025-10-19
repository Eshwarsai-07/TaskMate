/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0a0f1a",
          800: "#0d1117",
          700: "#0b0f15",
        },
        slateInk: "#0f1420",
        tealActive: "#0b3b4a",
        bluePrimary: "#2563eb",
        roseDanger: "#ef4444",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(31,41,55,0.6)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "16px",
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
