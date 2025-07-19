export const accent: Record<
  string,
  { border: string; ring: string; text: string }
> = {
  NVIDIA:   { border: "border-emerald-400", ring: "ring-emerald-400", text: "text-emerald-400" },
  AMD:      { border: "border-orange-500",  ring: "ring-orange-500",  text: "text-orange-500"  },
  Intel:    { border: "border-sky-400",     ring: "ring-sky-400",     text: "text-sky-400"     },
  ASUS:     { border: "border-purple-400",  ring: "ring-purple-400",  text: "text-purple-400"  },
  MSI:      { border: "border-pink-400",    ring: "ring-pink-400",    text: "text-pink-400"    },
  Gigabyte: { border: "border-amber-400",   ring: "ring-amber-400",   text: "text-amber-400"   },
  Corsair:  { border: "border-yellow-400",  ring: "ring-yellow-400",  text: "text-yellow-400"  },
  default:  { border: "border-gray-600",    ring: "ring-gray-400",    text: "text-gray-200"    },
};