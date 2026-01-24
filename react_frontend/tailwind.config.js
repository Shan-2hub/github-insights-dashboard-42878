/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bg: "#020617", // slate-950
        surface: "#0f172a", // slate-900
        border: "#1e293b", // slate-800
        primary: "#1e3a8a", // corporate navy
        accent: "#f59e0b", // gold
        success: "#059669",
        error: "#dc2626",
      },
      boxShadow: {
        "xl-midnight": "0 18px 45px rgba(0, 0, 0, 0.55)",
        "2xl-midnight": "0 25px 70px rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};
