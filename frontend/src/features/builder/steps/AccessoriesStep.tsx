/*  src/features/builder/steps/AccessoriesStep.tsx  */
import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PartGrid } from "../components/PartGrid";
import { useBuildStore } from "@/stores/buildStore";
import { nextStep } from "../builderSteps";

/* -------------------------------------------------------------------------- */
/*  UI                                                                        */
/* -------------------------------------------------------------------------- */

export default function AccessoriesStep() {
  const navigate       = useNavigate();
  const selectedId     = useBuildStore((s) => s.selected.accessories?.id);

  /* auto-advance once an accessory is chosen */
  useEffect(() => {
    if (selectedId) navigate(`/builder/${nextStep("accessories")}`);
  }, [selectedId, navigate]);

  return (
    <Suspense fallback={<p className="p-6">Loading accessories…</p>}>
      <div className="flex flex-1 flex-col overflow-hidden bg-off-black">
        <h2 className="mb-4 text-2xl font-semibold">Accessories</h2>

        {/* Pass only the props PartGrid expects */}
        <PartGrid category="accessories" selectedId={selectedId} />
      </div>
    </Suspense>
  );
}
