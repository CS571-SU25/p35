/* ──────────────────────────────────────────────────────────────
   PartCard – grid card + quick actions + live compatibility
   ────────────────────────────────────────────────────────────── */
import { useState, useRef, type MouseEvent, type CSSProperties } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Circle,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";

import { accent } from "@/lib/accentMap";
import { imageUrl } from "@/lib/images";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBuildStore } from "@/stores/buildStore";
import { useCompat } from "@/hooks/useCompat";   // 👈 NEW shared hook
import PartQuickStats from "./PartQuickStats";
import type { Part } from "@/lib/types";

/* ---------- props ----------------------------------------------------- */
interface Props {
  part: Part;
  isCandidate: boolean;
  isActive: boolean;
  onAdd: (e: MouseEvent, p: Part) => void;
  onRemove: (e: MouseEvent, id: string) => void;
  onOpenDetails: (p: Part) => void;
}

/* ===================================================================== */
export function PartCard({
                           part,
                           isCandidate,
                           isActive,
                           onAdd,
                           onRemove,
                           onOpenDetails,
                         }: Props) {
  const [loaded, setLoaded] = useState(false);
  const { ring, text }      = accent[part.brand] ?? accent.default;

  /* live compatibility status */
  const { ok, reason } = useCompat(part);
  const [tilt,   setTilt] = useState<CSSProperties>({});
  const cardRef= useRef<HTMLDivElement>(null);

  /* compare‑tray wiring */
  const toggleCompare = useBuildStore((s) => s.toggleCompare);
  const isCompared    = useBuildStore((s) =>
    s.compare.some((p) => p.id === part.id)
  );

  /* main click behaviour */
  function handleClick(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey) {
      toggleCompare(part);
      return;
    }
    onOpenDetails(part);
  }

  /* ------------------------------------------------------------------- */
  return (
    <Tooltip content={<PartQuickStats p={part} />}>
      <Card data-card
        ref={cardRef}
        onClick={handleClick}

        // Houses the 3D tilt functionality
        onMouseMove={(e) => {
          const el =cardRef.current;
          if (!el) return;
          const { left, top, width, height} = el.getBoundingClientRect();
          /* distance from the center, in -0.5 → 0.5 range */
          const dx = (e.clientX - left) / width - 0.5;
          const dy = (e.clientY - top) / height - 0.5;
          const rotX = (+dy * 10).toFixed(2);
          const rotY = (-dx * 10).toFixed(2);

          setTilt({ transform: `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)` });
        }}
        onMouseLeave={() => setTilt({ transform: "none" })}

        className={cn(
          "group relative flex h-64 flex-col overflow-hidden rounded-xl border border-gray-700 p-2",
          "transform-gpu transition-transform duration-150 ease-out hover:scale-[1.03]",
          isActive ? `ring-2 ${ring}` : `hover:ring-2 ${ring}`,
          !ok && "opacity-60"
        )}
        style={tilt}
      >
        {/* image */}
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-800 ">
          {!loaded && <Skeleton className="h-full w-full" />}
          <img
            src={imageUrl(part.image_path)}
            alt={part.model}
            onLoad={() => setLoaded(true)}
            className={cn(
              "h-full w-full object-contain transition-opacity",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* title */}
        <CardHeader className="flex-1 px-0 pb-0 pt-2">
          <h3
            className={cn(
              "line-clamp-2 text-sm font-medium leading-tight text-gray-300",
              isActive && text,
              !isActive && `group-hover:${text}`
            )}
          >
            {part.brand} {part.model}
          </h3>
        </CardHeader>

        {/* price */}
        <CardContent className="px-0">
          <p className="text-base font-semibold text-gray-300 transition-colors group-hover:text-gray-100">
            ${part.price_usd.toFixed(2)}
          </p>
        </CardContent>

        {/* compatibility / selected badge */}
        <span className="absolute right-2 top-2">
          {ok ? (
            isActive && <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Tooltip content={reason ?? ""}>
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </Tooltip>
          )}
        </span>

        {/* quick add / remove */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isCandidate ? onRemove(e, part.id) : onAdd(e, part);
          }}
          title={isCandidate ? "Remove from build" : "Add to build"}
          className={cn(
            "absolute bottom-2 left-2 rounded-full p-1 shadow",
            isCandidate
              ? "bg-red-600/90 text-white hover:bg-red-600"
              : "bg-emerald-600/90 text-white hover:bg-emerald-600",
            "opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          )}
        >
          {isCandidate ? (
            <Trash2 className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>

        {/* compare toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(part);
          }}
          title={
            isCompared ? "Remove from compare" : "Add to compare (⌘‑click)"
          }
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

export default PartCard;
