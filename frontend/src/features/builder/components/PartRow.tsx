import { motion } from "framer-motion";
import { GripVertical, Star, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { accent } from "@/lib/accentMap";
import type { Part } from "@/lib/types";

/* stand‑out spec helper – unchanged */
export function summary(p: Part) {
  if (!p) return "";
  switch (p.category) {
    case "cpu": {
      const t = p.spec["threads"] ?? p.spec["logical_processors"];
      const intel = p.brand.toLowerCase().includes("intel");
      if (intel) {
        const pC = p.spec["p_cores"] ?? p.spec["performance_cores"];
        const eC = p.spec["e_cores"] ?? p.spec["efficient_cores"];
        return pC && eC && t ? `${pC}P+${eC}E • ${t}T` : "";
      }
      const c = p.spec["cores"] ?? p.spec["physical_cores"];
      return c && t ? `${c}C • ${t}T` : "";
    }
    case "gpu": {
      const v = p.spec["vram"] ?? p.spec["memory"];
      const b = p.spec["boost_clock"] ?? p.spec["boost_clock_mhz"];
      return v && b ? `${v} VRAM • ${b} MHz` : "";
    }
    case "memory":
      return p.spec["capacity"] ? `${p.spec["capacity"]} GB` : "";
    default:
      return "";
  }
}

/* props */
interface Props {
  part: Part;
  isActive: boolean;
  onMakeActive: () => void;
  onRemove: () => void;
}

/* component */
export default function PartRow({
                                  part,
                                  isActive,
                                  onMakeActive,
                                  onRemove,
                                }: Props) {
  const { text } = accent[part.brand] ?? accent.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "group flex items-center gap-3 rounded-lg border p-2",
        isActive
          ? "border-emerald-500/60 bg-emerald-500/10 ring-2 ring-emerald-500"
          : "border-muted bg-muted/30 hover:bg-muted/40"
      )}
    >
      <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />

      <div className="flex-1 space-y-0.5">
        <p className={cn("text-sm font-medium leading-none", text)}>
          {part.brand} {part.model}
        </p>
        {summary(part) && (
          <p className="text-xs text-muted-foreground">{summary(part)}</p>
        )}
      </div>

      <div className="text-right">
        <p className="font-medium tabular-nums">${part.price_usd.toFixed(2)}</p>

        {/* actions – only star when not active */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          {!isActive && (
            <button
              title="Make active"
              onClick={onMakeActive}
              className="rounded bg-white p-1 text-gray-700 shadow hover:bg-gray-200"
            >
              <Star className="h-4 w-4" />
            </button>
          )}
          <button
            title="Remove"
            onClick={onRemove}
            className="rounded bg-white p-1 text-destructive shadow hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
