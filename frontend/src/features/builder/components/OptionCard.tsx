import { useState, type MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { imageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import { summary } from "./PartRow";          // reuse helper
import type { Part } from "@/lib/types";
import { useCompat } from "@/hooks/useCompat";

interface Props {
  part: Part;
  isActive: boolean;
  onSelect: (e: MouseEvent) => void;
  onRemove: (e: MouseEvent) => void;
}

export default function OptionCard({
                                     part,
                                     isActive,
                                     onSelect,
                                     onRemove,
                                   }: Props) {
  const [loaded, setLoaded] = useState(false);
  const { ok } = useCompat(part);


  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative w-40 shrink-0 cursor-pointer rounded-lg border p-2 transition-all",
        isActive
          ? "border-emerald-500/60 bg-emerald-500/10 ring-2 ring-emerald-500"
          : "border-muted bg-muted/20 hover:bg-muted/30", !ok && "opacity-50 grayscale"
      )}
    >
      {/* remove button (top‑right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(e);
        }}
        title="Remove from candidates"
        className="absolute right-1 top-1 rounded bg-white p-1 text-destructive shadow hover:bg-red-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* image */}
      <div className="h-20 flex items-center justify-center overflow-hidden rounded bg-muted/40">
        {!loaded && <div className="h-full w-full animate-pulse bg-muted" />}
        <img
          src={imageUrl(part.image_path)}
          alt={part.model}
          className={cn(
            "h-full w-full object-contain transition-opacity",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* text */}
      <div className="mt-2 space-y-0.5">
        <p className="truncate text-xs font-medium">
          {part.brand} {part.model}
        </p>
        <p className="text-xs text-muted-foreground">{summary(part)}</p>
        <p className="text-right text-sm font-semibold">
          ${part.price_usd.toFixed(2)}
        </p>
      </div>
    </Card>
  );
}
