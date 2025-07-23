import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],          // you’re toggling `.dark` on <html>
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* semantic HSL vars – match your index.css custom props */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* chart palette if you want utilities (optional) */
        "chart-1": "hsl(var(--chart-1))",
        "chart-2": "hsl(var(--chart-2))",
        "chart-3": "hsl(var(--chart-3))",
        "chart-4": "hsl(var(--chart-4))",
        "chart-5": "hsl(var(--chart-5))",
      },

      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },

      // /* 8-pt scale: keep multiples of 8 only */
      // spacing: {
      //   0: "0px",
      //   1: "8px",
      //   2: "16px",
      //   3: "24px",
      //   4: "32px",
      //   5: "40px",
      //   6: "48px",
      //   7: "56px",
      //   8: "64px",
      //   9: "72px",
      //   10: "80px",
      // },

      fontFamily: {
        sans: ["system-ui", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

