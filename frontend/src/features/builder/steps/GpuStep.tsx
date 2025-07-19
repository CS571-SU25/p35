import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PartGrid } from "../components/PartGrid";
import { useBuildStore } from "@/stores/buildStore";
import { nextStep } from "../builderSteps";

/* UI */
export default function GpuStep() {
  const navigate = useNavigate();
  const setPart  = useBuildStore((s) => s.setPart);

  return (
    <Suspense fallback={<p className="p-6">Loading GPUs…</p>}>
      <div className="flex-1 flex flex-col overflow-hidden bg-off-black">
        <h2 className="text-2xl font-semibold mb-4">GPU</h2>
        <div className="flex-1 overflow-y-auto">
        <PartGrid
          category="gpu"
          onSelect={(part) => {
            setPart("gpu", part);
            toast.success(`Selected GPU: ${part.brand} ${part.model}`);
            navigate(`/builder/${nextStep("gpu")}`);
          }}
        />
      </div>
      </div>
    </Suspense>
  );
}
