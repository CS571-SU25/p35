// tailwind.config.js
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

  /* ─── keep all dynamic brand-accent utilities ─────────────────── */
  safelist: [
    /* selected-state borders */
    "border-emerald-400",
    "border-orange-500",
    "border-sky-400",
    "border-purple-400",
    "border-pink-400",
    "border-amber-400",
    "border-yellow-400",

    /* selected-state text colour in card header */
    "text-emerald-400",
    "text-orange-500",
    "text-sky-400",
    "text-purple-400",
    "text-pink-400",
    "text-amber-400",
    "text-yellow-400",

    /* hover-state borders (so the accent shows on hover **before** selection) */
    "hover:border-emerald-400",
    "hover:border-orange-500",
    "hover:border-sky-400",
    "hover:border-purple-400",
    "hover:border-pink-400",
    "hover:border-amber-400",
    "hover:border-yellow-400",

    { pattern: /ring-(?:2|emerald-400|orange-500|sky-400|purple-400|pink-400|amber-400|gray-400)/ }
  ],

  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* optional brand colour map */
      colors: {
        brand: {
          intel:    "#38bdf8",
          amd:      "#f97316",
          nvidia:   "#22c55e",
          asus:     "#c084fc",
          msi:      "#f472b6",
          gigabyte: "#facc15",
        },

        /* design-token mapping (unchanged) */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        progress_track: "#2e2e2e",
        progress_cpu:   "#3b82f6",
        progress_gpu:   "#10b981",
        progress_mobo:  "#f97316",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        "off-black":  "#111111",
        "gray-start": "#1e1e1e",
        "gray-end":   "#383838",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".card-gradient": {
          "background-image":
            "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        },
      });
    }),
  ],
};
