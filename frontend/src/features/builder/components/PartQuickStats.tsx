import type { Part } from "@/lib/types";

/** Runtime-safe spec map */
type SpecVal = string | number | undefined | null;
type SpecMap = Record<string, SpecVal>;

/** Tiny headline-spec block reused by Card hover & Modal. */
export default function PartQuickStats({ p: part }: { p: Part }) {
  /* 1. Cast _once_ into a narrower map we can reason about */
  const s = part.spec as SpecMap;

  /* 2. Helpers --------------------------------------------------------- */
  /** Ensure we always return *number | null* for maths / mm() */
  const num = (v: SpecVal): number | null =>
    typeof v === "number" ? v : Number.isFinite(Number(v)) ? Number(v) : null;

  /** Human-friendly “42 mm” even if the raw is string */
  const mm = (v: SpecVal) => {
    const n = num(v);
    return n !== null ? `${n} mm` : "—";
  };

  const has = (k: string) => s[k] !== undefined && s[k] !== null;

  /* -------------------------------------------------------------------- */
  return (
    <div className="space-y-0.5 text-xs leading-tight text-gray-300">
      {/* ---------- CPU ---------- */}
      {part.category === "cpu" && (
        <>
          {has("p_cores") ? (
            <p>
              {num(s.p_cores)}P
              {has("e_cores") && `+${num(s.e_cores)}E`}C&nbsp;/&nbsp;
              {num(s.threads)}T
            </p>
          ) : (
            <p>
              {num(s.cores)}C&nbsp;/&nbsp;
              {num(has("threads") ? s.threads : (num(s.cores) ?? 0) * 2)}T
            </p>
          )}
          <p>Boost&nbsp;{s.boost_clock}</p>
        </>
      )}

      {/* ---------- GPU ---------- */}
      {part.category === "gpu" && (
        <>
          <p>{num(s.vram_gb)} GB&nbsp;VRAM</p>
          <p>Boost&nbsp;{s.boost_clock}</p>
        </>
      )}

      {/* ---------- Memory ---------- */}
      {part.category === "memory" && (
        <p>
          {num(s.capacity_gb)} GB&nbsp;•&nbsp;{s.speed}
        </p>
      )}

      {/* ---------- Storage ---------- */}
      {part.category === "storage" && (
        <p>
          {num(s.capacity_gb)} GB&nbsp;•&nbsp;{s.read}
        </p>
      )}

      {/* ---------- Physical dims ---------- */}
      {part.category === "gpu" && has("length_mm") && <p>Len&nbsp;{mm(s.length_mm)}</p>}
      {part.category === "cooler" && (
        <p>{has("radiator_mm") ? mm(s.radiator_mm) : mm(s.height_mm)}</p>
      )}

      {/* ---------- Power ---------- */}
      {has("tdp_w") && <p>{num(s.tdp_w)} W&nbsp;TDP</p>}
      {has("wattage") && <p>{num(s.wattage)} W&nbsp;PSU</p>}
    </div>
  );
}
