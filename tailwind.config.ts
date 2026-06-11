import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effcff",
          100: "#d7f8ff",
          200: "#b3f1ff",
          300: "#79e7ff",
          400: "#51e2ff",
          500: "#2f8fff",
          600: "#2467f1",
          700: "#244fd0",
          800: "#263fa8",
          900: "#24377f",
        },
        accent: {
          400: "#67e8f9",
          500: "#22d3ee",
          600: "#0891b2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-22px) rotate(6deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(-4deg)" },
          "50%": { transform: "translateY(-32px) rotate(4deg)" },
        },
        drift: {
          "0%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(40px,-30px)" },
          "100%": { transform: "translate(0,0)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 9s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        spinSlow: "spinSlow 22s linear infinite",
        dash: "dash 4s ease-in-out forwards infinite",
        shimmer: "shimmer 2s infinite",
        fadeUp: "fadeUp 0.5s ease-out forwards",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(53,99,255,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
