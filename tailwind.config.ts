import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        bone: {
          50: "#faf9f6",
          100: "#f5f4f0",
          200: "#ece9e0",
          300: "#dedacd",
        },
        ink: {
          400: "#9a9a9f",
          500: "#6e6e73",
          600: "#4a4a4f",
          700: "#2a2a2e",
          900: "#0e0e10",
        },
        slate2: {
          400: "#7a8a9c",
          500: "#5a6c7e",
          600: "#3a4a5c",
          700: "#2a3744",
        },
        copper: {
          400: "#d48b63",
          500: "#b96a43",
          600: "#894a2f",
        },
        sea: {
          400: "#61a7a0",
          500: "#327a75",
          600: "#1f5c58",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight2: "-0.022em",
      },
      fontSize: {
        mega: ["clamp(3.5rem, 12vw, 12rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        huge: ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        big: ["clamp(1.75rem, 3vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.022em" }],
      },
      animation: {
        "marquee": "marquee 60s linear infinite",
        "marquee-slow": "marquee 100s linear infinite",
        "fade-in": "fade-in 1s ease-out forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
