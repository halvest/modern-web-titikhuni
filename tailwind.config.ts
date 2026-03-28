import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        padding: "1rem",
        center: true,
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
      },
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        gradient: "gradient 8s linear infinite",
      },
    },
  },

  // Menambahkan tailwindcss/typography untuk styling konten editor
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
