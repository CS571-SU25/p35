// src/components/PartGrid.tsx
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useBuildStore } from "@/stores/buildStore";
import { PartCard } from "./PartCard";
import PartDetailsModal from "@/features/builder/components/PartDetailsModal";
import type { Part } from "@/lib/types";

interface Props {
  category: string;
  selectedId?: string;
}

/* helper groups ----------------------------------------------------------- */
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

export function PartGrid({ category, selectedId }: Props) {
  const setPart = useBuildStore((s) => s.setPart);

  /* modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPart, setModalPart] = useState<Part | null>(null);

  /* data fetch ----------------------------------------------------------- */
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

  /* bucket parts */
  const buckets: Record<string, Part[]> = {};
  for (const p of data) (buckets[bucketKey(p)] ??= []).push(p);

  return (
    <div className="h-full overflow-y-auto pb-28 pr-6">
      {Object.entries(buckets).map(([label, parts]) => (
        <Fragment key={label}>
          {label !== "all" && (
            <h3 className="sticky top-0 z-10 mb-2 bg-off-black/90 py-1 text-lg font-semibold backdrop-blur">
              {label}
            </h3>
          )}

          <div className="
          grid auto-rows-[16rem] gap-4

          /* phones */
            grid-cols-[repeat(auto-fit,minmax(150px,1fr))]

          /* sm ≥ 640px */
            sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]

          /* md ≥ 768px  → 3-up after 240-px sidebar */
            md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]

          /* lg ≥ 1024px  → maybe 4-up, still shrink before wrap */
            lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]

          /* xl ≥ 1280px  → cap growth to avoid billboards */
            xl:grid-cols-[repeat(auto-fit,minmax(235px,260px))]
          "
          >
            {parts.map((p) => (
              <PartCard
                key={p.id}
                part={p}
                selected={p.id === selectedId}
                onOpenDetails={(choice) => {
                  setModalPart(choice);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </Fragment>
      ))}

      {/* modal renders once per grid */}
      {modalPart && (
        <PartDetailsModal
          part={modalPart}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onAdd={(chosen) => {
            setPart(category as any, chosen);
            toast.success(`Added ${chosen.brand} ${chosen.model} to build`);
          }}
        />
      )}
    </div>
  );
}
