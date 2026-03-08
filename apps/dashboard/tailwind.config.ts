import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "zs-bg-primary": "var(--color-zs-bg-primary)",
        "zs-bg-secondary": "var(--color-zs-bg-secondary)",
        "zs-bg-surface": "var(--color-zs-bg-surface)",
        "zs-bg-surface-hover": "var(--color-zs-bg-surface-hover)",
        "zs-bg-overlay": "var(--color-zs-bg-overlay)",
        "zs-border": "var(--color-zs-border)",
        "zs-border-hover": "var(--color-zs-border-hover)",
        "zs-blue": "var(--color-zs-blue)",
        "zs-blue-lt": "var(--color-zs-blue-lt)",
        "zs-cyan": "var(--color-zs-cyan)",
        "zs-violet": "var(--color-zs-violet)",
        "zs-emerald": "var(--color-zs-emerald)",
        "zs-amber": "var(--color-zs-amber)",
        "zs-rose": "var(--color-zs-rose)",
        "zs-text-primary": "var(--color-zs-text-primary)",
        "zs-text-secondary": "var(--color-zs-text-secondary)",
        "zs-text-muted": "var(--color-zs-text-muted)",
        // vision aliases
        "vision-main": "var(--color-zs-bg-secondary)",
        "vision-card": "var(--color-vision-card)",
        "vision-blue": "var(--color-zs-blue)",
        "vision-purple": "var(--color-zs-violet)",
        "vision-teal": "var(--color-zs-emerald)",
        "vision-red": "var(--color-zs-rose)",
      },
      boxShadow: {
        "zs-glow-blue": "var(--shadow-zs-glow-blue)",
        "zs-glow-cyan": "var(--shadow-zs-glow-cyan)",
        "zs-glow-violet": "var(--shadow-zs-glow-violet)",
        "zs-glow-emerald": "var(--shadow-zs-glow-emerald)",
        "zs-glow-rose": "var(--shadow-zs-glow-rose)",
        "zs-glass": "var(--shadow-zs-glass)",
        "zs-card": "var(--shadow-zs-card)",
        "vision-glass": "var(--shadow-zs-glass)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        bounce: "var(--ease-bounce)",
        sharp: "var(--ease-sharp)",
      },
    },
  },
  plugins: [],
};
export default config;
