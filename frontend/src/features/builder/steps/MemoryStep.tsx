import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PartGrid } from "../components/PartGrid";
import { useBuildStore } from "@/stores/buildStore";
import { nextStep } from "../builderSteps";

/* UI */
export default function MemoryStep() {
  const navigate = useNavigate();
  const setPart  = useBuildStore((s) => s.setPart);

  return (
    <Suspense fallback={<p className="p-6">Loading Memory &amp; Storage…</p>}>
      <div className="flex-1 flex flex-col overflow-hidden bg-off-black">
        <h2 className="text-2xl font-semibold mb-4">Memory &amp; Storage</h2>
        <div className="flex-1 overflow-y-auto">
        <PartGrid
          category="memory"
          onSelect={(part) => {
            setPart("memory", part);
            toast.success(`Selected Part: ${part.brand} ${part.model}`);
            navigate(`/builder/${nextStep("memory")}`);
          }}
        />
      </div>
      </div>
    </Suspense>
  );
}
