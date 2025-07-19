/* --- props -------------------------------------------------------------- */
interface BenchChartProps {
  /** Slug of the benchmark metric to show (e.g. "cinebench") */
  metric: string;
  /** Part ID whose score to fetch */
  partId: string;
}

/* --- placeholder implementation ---------------------------------------- */
/* Replace the <div> with your real chart later. The important bit is that
   the component now *accepts* metric and partId props. */
export default function BenchChart({ metric, partId }: BenchChartProps) {
  return (
    <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-800 text-xs text-gray-400">
      loading&nbsp;{metric}&nbsp;for&nbsp;{partId}…
    </div>
  );
}
