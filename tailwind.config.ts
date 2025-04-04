import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
    },
    extend: {
      colors: {
        primary: {
        },
        secondary: {
        },
        destructive: {
        },
        muted: {
        },
        accent: {
        },
        popover: {
        },
        card: {
        },
      },
      borderRadius: {
      },
      keyframes: {
        },
        },
      },
      animation: {
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
