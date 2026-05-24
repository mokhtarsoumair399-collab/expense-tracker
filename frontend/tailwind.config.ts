import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        surface: "#f6f7fb",
        mint: "#18a77a",
        coral: "#e85d4f",
        amber: "#d9952f",
        steel: "#57708f"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(24, 33, 47, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
