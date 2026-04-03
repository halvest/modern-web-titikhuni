import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Content Optimization: Pastikan semua path ter-scan dengan benar
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // 2. Integration dengan Variable Font dari Root Layout
      fontFamily: {
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui"],
      },

      // 3. Container Strategy: Standardisasi Padding Global
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },

      // 4. Custom Colors: Definisi Brand Identity
      colors: {
        // Emerald untuk accent/CTA (Growth Oriented)
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        // Stone untuk background & text premium
        stone: {
          50: "#fcfcfb", // Background Utama
          100: "#f5f5f4",
          200: "#e7e5e4",
          400: "#a8a29e",
          900: "#1c1917", // Text Utama
        },
      },

      // 5. Animations & Keyframes (Premium Micro-interactions)
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        gradient: {
          to: { backgroundPosition: "var(--bg-size) 0" },
        },
        // Tambahan untuk efek "Reveal" pada konten
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "subtle-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },

      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        gradient: "gradient 8s linear infinite",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "subtle-zoom": "subtle-zoom 10s ease-in-out infinite alternate",
      },

      // 6. Border Radius & Shadows (Premium Look)
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        premium: "0 20px 50px rgba(0, 0, 0, 0.03)",
        elevated: "0 30px 60px -12px rgba(28, 25, 23, 0.12)",
      },
    },
  },

  // 7. Plugins: Pastikan urutan plugin benar
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // Plugin tambahan untuk aspek rasio yang lebih clean
    // require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
