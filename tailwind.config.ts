import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        muted: "#1A1A1A",
        mutedForeground: "#A3A3A3",
        accent: "#FFFFFF",
        accentForeground: "#000000",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        display: ["var(--font-playfair)"],
      }
    },
  },
  plugins: [],
};
export default config;
