/* ──────────────────────────────────────────────────────────────
   src/features/builder/components/PartCard.tsx
   ────────────────────────────────────────────────────────────── */
import { accent } from "@/lib/accentMap";
import { imageUrl } from "@/lib/images";
import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Circle,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBuildStore } from "@/stores/buildStore";
import PartQuickStats from "./PartQuickStats";
import type { Part } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Compatibility helper                                                      */
/* -------------------------------------------------------------------------- */
function useCompat(part: Part) {
  const sel = useBuildStore((s) => s.selected);
  if (part.category === "mobo" && sel.cpu) {
    if (part.spec?.socket !== sel.cpu.spec?.socket) {
      return { ok: false, reason: `Needs ${sel.cpu.spec.socket}` };
    }
  }
  if (part.category === "memory" && sel.mobo) {
    const need = sel.mobo.spec?.memory_type;
    if (need && need !== part.spec?.type) {
      return { ok: false, reason: `Mobo is ${need}` };
    }
  }
  if (part.category === "cooler" && sel.cpu) {
    const sockets: string[] = (part.spec?.socket as string[]) ?? [];
    if (!sockets.includes(sel.cpu.spec?.socket as string)) {
      return { ok: false, reason: `Cooler lacks ${sel.cpu.spec.socket}` };
    }
  }
  return { ok: true };
}

/* -------------------------------------------------------------------------- */
interface Props {
  part: Part;
  selected?: boolean;
  /** called when the user clicks (normal click, not ⌘/Ctrl) */
  onOpenDetails: (p: Part) => void;
}
/* -------------------------------------------------------------------------- */

export function PartCard({ part, selected, onOpenDetails }: Props) {
  const [loaded, setLoaded] = useState(false);
  const { ring, text }      = accent[part.brand] ?? accent.default;
  const { ok, reason }      = useCompat(part);

  /* compare-tray wiring (⇧ or ⌘ click) */
  const toggleCompare = useBuildStore((s) => s.toggleCompare);
  const isCompared    = useBuildStore((s) =>
    s.compare.some((p) => p.id === part.id)
  );

  function handleClick(e: React.MouseEvent) {
    if (e.metaKey || e.ctrlKey) {
      toggleCompare(part);
      return;
    }
    onOpenDetails(part);
  }

  return (
    <Tooltip content={<PartQuickStats p={part} />}>
      <Card
        onClick={handleClick}
        className={cn(
          "group relative flex h-64 flex-col overflow-hidden rounded-xl border border-gray-700 p-2",
          "transition-transform duration-150 hover:scale-[1.03]",
          selected ? `ring-2 ${ring}` : `hover:ring-2 ${ring}`,
          !ok && "opacity-60"
        )}
      >
        {/* image ----------------------------------------------------------- */}
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-800">
          {!loaded && <Skeleton className="h-full w-full" />}
          <img
            src={imageUrl(part.image_path)}
            alt={part.model}
            onLoad={() => setLoaded(true)}
            className={cn(
              "h-full w-full object-contain object-center transition-opacity",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* title ----------------------------------------------------------- */}
        <CardHeader className="flex-1 px-0 pb-0 pt-2">
          <h3
            className={cn(
              "line-clamp-2 text-sm font-medium leading-tight text-gray-900",
              selected && text,
              !selected && `group-hover:${text}`
            )}
          >
            {part.brand} {part.model}
          </h3>
        </CardHeader>

        {/* price ----------------------------------------------------------- */}
        <CardContent className="px-0">
          <p className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
            ${part.price_usd.toFixed(2)}
          </p>
        </CardContent>

        {/* selected / incompatible badge ----------------------------------- */}
        <span className="absolute right-2 top-2">
          {ok ? (
            selected && <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Tooltip content={reason ?? ""}>
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </Tooltip>
          )}
        </span>

        {/* compare toggle -------------------------------------------------- */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(part);
          }}
          title={isCompared ? "Remove from compare" : "Add to compare"}
          className="absolute bottom-2 right-2 rounded-full bg-gray-900/80 p-1 text-gray-300 hover:bg-gray-800"
        >
          {isCompared ? (
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </button>
      </Card>
    </Tooltip>
  );
}
