import { Fragment, useState, type MouseEvent } from "react";
import { flyTo } from "@/lib/flyTo";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

import {
  useBuildStore,
  type Category,
} from "@/stores/buildStore";

import { PartCard } from "./PartCard";
import PartDetailsModal from "@/features/builder/components/PartDetailsModal";
import { showPartAddedToast } from "@/lib/showPartAddedToast";
import { toast } from "sonner";
import { nextStep } from "../builderSteps";
import type { Part } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  helper to bucket parts by brand / type                                    */
/* -------------------------------------------------------------------------- */
function bucketKey(p: Part): string {
  switch (p.category) {
    case "gpu":
    case "cpu":
      return p.brand;
    case "memory":
    case "storage": {
      const t = p.spec["type"];
      return typeof t === "string" ? t : p.category;
    }
    default:
      return "all";
  }
}

/* -------------------------------------------------------------------------- */
interface Props {
  category: Category;
  selectedId?: string;
}
/* -------------------------------------------------------------------------- */

export function PartGrid({ category }: Props) {
  /* store actions & state -------------------------------------------------- */
  const addCandidate    = useBuildStore((s) => s.addCandidate);
  const removeCandidate = useBuildStore((s) => s.removeCandidate);
  const setActive       = useBuildStore((s) => s.setActive);
  const candidates      = useBuildStore((s) => s.candidates);
  const active          = useBuildStore((s) => s.active);

  const navigate = useNavigate();

  /* modal state ------------------------------------------------------------ */
  const [modalOpen, setModalOpen]   = useState(false);
  const [modalPart, setModalPart]   = useState<Part | null>(null);

  /* fetch parts ------------------------------------------------------------ */
  const { data, isLoading, error } = useQuery<Part[], Error>({
    queryKey: ["parts", category],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("parts")
        .select("*")
        .eq("category", category);
      if (error) throw error;
      return rows as Part[];
    },
  });

  if (isLoading)     return <p className="p-4">Loading…</p>;
  if (error)         return <p className="p-4 text-destructive">Error loading parts</p>;
  if (!data?.length) return <p className="p-4">No parts found</p>;

  /* bucket parts ----------------------------------------------------------- */
  const buckets: Record<string, Part[]> = {};
  for (const p of data) (buckets[bucketKey(p)] ??= []).push(p);

  /* ----------------------------------------------------------------------- */
  /*  micro‑interactions                                                    */
  /* ----------------------------------------------------------------------- */

  /** confetti burst for successful add */
  function fireConfetti(e: MouseEvent, colors: string[]) {
    const { clientX, clientY } = e;
    confetti({
      particleCount: 40,
      spread: 60,
      scalar: 0.8,
      colors,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight,
      },
    });
  }

  /** flame emoji that rises & fades when removing */
  function fireFlame(e: MouseEvent) {
    const { clientX, clientY } = e;
    const flame = document.createElement("span");
    flame.textContent = "🔥";
    flame.style.position = "fixed";
    flame.style.pointerEvents = "none";
    flame.style.left = `${clientX - 12}px`;
    flame.style.top = `${clientY - 12}px`;
    flame.style.fontSize = "24px";
    flame.style.opacity = "1";
    flame.style.transform = "translateY(0px) scale(1)";
    flame.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
    document.body.appendChild(flame);
    requestAnimationFrame(() => {
      flame.style.transform = "translateY(-40px) scale(1.4)";
      flame.style.opacity = "0";
    });
    setTimeout(() => flame.remove(), 600);
  }

  /* ----------------------------------------------------------------------- */
  return (
    <div className="h-full overflow-y-auto pb-28 pr-6 p-4 space-y-4">
      {Object.entries(buckets).map(([label, parts]) => (
        <Fragment key={label}>
          {label !== "all" && (
            <h3 className="sticky top-0 z-10 mb-3 bg-off-black/90 py-1 text-lg font-semibold backdrop-blur">
              {label}
            </h3>
          )}

          <div className="
            grid gap-x-4 gap-y-6
            auto-rows-[minmax(0,256px)]
            grid-cols-[repeat(auto-fill,minmax(208px,1fr))]
          ">
            {parts.map((p, idx) => {
              const isCand = candidates[category].some((x) => x.id === p.id);
              const isAct  = active[category] === p.id;

              return (
                <PartCard
                  key={`${p.id}-${idx}`}
                  part={p}
                  isCandidate={isCand}
                  isActive={isAct}
                  onAdd={(e, part) => {

                    // Fly in feature
                    const cardEl   = (e.currentTarget as HTMLElement).closest("[data-card]");
                    const padEl    = document.querySelector(
                      `[data-budget-pad='${category}']`
                      ) as HTMLElement | null;
                    if (cardEl && padEl) flyTo(cardEl as HTMLElement, padEl);

                    addCandidate(category, part);
                    setActive(category, part.id);

                    fireConfetti(e, ["#22c55e", "#bef264"]);
                    showPartAddedToast(
                      `${part.brand} ${part.model}`,
                      nextStep(category as any).toUpperCase(),
                      () => navigate(`/builder/${nextStep(category as any)}`)
                    );
                  }}
                  onRemove={(e, id) => {
                    removeCandidate(category, id);
                    fireFlame(e);
                    toast.success("Removed from build");
                  }}
                  onOpenDetails={(choice) => {
                    setModalPart(choice);
                    setModalOpen(true);
                  }}
                />
              );
            })}
          </div>
        </Fragment>
      ))}

      {/* modal ------------------------------------------------------------ */}
      {modalPart && (
        <PartDetailsModal
          part={modalPart}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
}
