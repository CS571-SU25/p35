import type { Part } from "@/lib/types";
import { imageUrl } from "@/lib/images";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------------------------------------------------- */
/*  Per-category sort order                                                   */
/* -------------------------------------------------------------------------- */
const ORDER: Record<string, string[]> = {
  cpu: [
    "socket",
    "p_cores",
    "e_cores",
    "threads",
    "base_clock",
    "boost_clock",
    "tdp_w",
    "cache_mb",
  ],
  // add gpu / memory / storage orders if you like; unknown keys keep original
};

/* helper: pretty-print the key */
const pretty = (k: string) =>
  k
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());

/* helper row component */
const Row = ({ k, v }: { k: string; v: string | number | undefined }) => (
  <>
    <dt className="text-[13px] text-gray-400">{pretty(k)}</dt>
    <dd className="text-right text-[13px] font-medium tabular-nums text-gray-200">
      {v ?? "—"}
    </dd>
  </>
);

export default function SpecsGrid({ part }: { part: Part }) {
  const specs = part.spec as Record<string, string | number | undefined>;
  const order = ORDER[part.category] ?? [];

  /* sort keys by index in ORDER array; unknown keys keep original order */
  const sorted = Object.entries(specs).sort(([a], [b]) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* specs table (left) */}
      <dl className="grid flex-1 grid-cols-[auto_1fr] gap-y-1 md:max-w-sm">
        {sorted.map(([k, v]) => (
          <Row key={k} k={k} v={v} />
        ))}
      </dl>

      {/* product image (right) */}
      <div className="flex flex-1 items-center justify-center">
        {part.image_path ? (
          <img
            src={imageUrl(part.image_path)}
            alt={part.model}
            className="max-h-56 w-auto object-contain"
          />
        ) : (
          <Skeleton className="h-48 w-48" />
        )}
      </div>
    </div>
  );
}
