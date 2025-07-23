import { Suspense } from "react";
import { PartGrid } from "../components/PartGrid";
import { useBuildStore } from "@/stores/buildStore";

export default function MoboStep() {
  const activeId = useBuildStore((s) => s.active.mobo);

  return (
    <Suspense fallback={<p className="p-6">Loading Motherboards…</p>}>
      <div className="flex-1 flex flex-col overflow-hidden bg-off-black">
        <h2 className="text-2xl font-semibold mb-4">Motherboard</h2>
        <div className="flex-1 overflow-y-auto">
          <PartGrid category="mobo" selectedId={activeId ?? undefined} />
        </div>
      </div>
    </Suspense>
  );
}
