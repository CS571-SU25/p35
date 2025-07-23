import { Suspense } from "react";
import { PartGrid } from "../components/PartGrid";
import { useBuildStore } from "@/stores/buildStore";

export default function CoolerStep() {
  const activeId = useBuildStore((s) => s.active.cooler);

  return (
    <Suspense fallback={<p className="p-6">Loading coolers…</p>}>
      <div className="flex flex-1 flex-col overflow-hidden bg-off-black">
        <h2 className="mb-4 text-2xl font-semibold">Cooler</h2>
        <div className="flex-1 overflow-y-auto">
          <PartGrid category="cooler" selectedId={activeId ?? undefined} />
        </div>
      </div>
    </Suspense>
  );
}
