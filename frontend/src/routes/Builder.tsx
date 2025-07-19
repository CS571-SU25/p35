/* ──────────────────────────────────────────────────────────
   src/features/builder/Builder.tsx
   ────────────────────────────────────────────────────────── */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Cpu,
  Gpu,
  CircuitBoard,
  MemoryStick,
  PcCase,
  Keyboard,
  CheckCircle,
} from "lucide-react";

import { useBuildStore, type Category } from "@/stores/buildStore";
import { PartGrid } from "@/features/builder/components/PartGrid";
import { LivePanel } from "@/features/builder/components/LivePanel";
import { CompareTray } from "@/features/builder/components/CompareTray";
import DetailsDrawer from "@/features/builder/components/DetailsDrawer";
import BuilderToolbar from "@/features/builder/BuilderToolbar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*  Step meta                                                                 */
/* -------------------------------------------------------------------------- */

export const steps = [
  { id: "cpu",         label: "CPU",                     icon: Cpu },
  { id: "gpu",         label: "GPU",                     icon: Gpu },
  { id: "mobo",        label: "Motherboard",             icon: CircuitBoard },
  { id: "memory",      label: "Memory",                  icon: MemoryStick },
  { id: "case",        label: "Case / Cooling / PSU",    icon: PcCase },
  { id: "accessories", label: "Accessories",             icon: Keyboard },
  { id: "summary",     label: "Summary",                 icon: CheckCircle },
] as const;

export type StepId = (typeof steps)[number]["id"];

const nextStep = (cur: StepId) =>
  steps[Math.min(steps.findIndex((s) => s.id === cur) + 1, steps.length - 1)].id;
const prevStep = (cur: StepId) =>
  steps[Math.max(steps.findIndex((s) => s.id === cur) - 1, 0)].id;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Builder() {
  /* 1 ▸ active-step logic -------------------------------------------------- */
  const { stepId } = useParams<{ stepId?: string }>();
  const active: StepId = (stepId as StepId) ?? "cpu";

  /* 2 ▸ navigation helpers ------------------------------------------------- */
  const navigate    = useNavigate();
  const saveCurrent = useBuildStore((s) => s.saveCurrent);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.altKey) && e.key === "ArrowRight")
        navigate(`/builder/${nextStep(active)}`);
      if ((e.metaKey || e.altKey) && e.key === "ArrowLeft")
        navigate(`/builder/${prevStep(active)}`);

      // quick-save  ⌘/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrent();
        toast.success("Build saved");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, saveCurrent]);

  /* 3 ▸ id of the currently-selected part (for ring highlight) ------------- */
  const selectedId = useBuildStore((s) =>
    ["cpu", "gpu", "mobo", "memory", "storage", "cooler", "case", "psu"].includes(
      active,
    )
      ? s.selected[active as Category]?.id
      : undefined,
  );

  /* 4 ▸ render ------------------------------------------------------------- */
  return (
    <div className="flex h-screen bg-off-black text-white">
      {/* ───── sidebar (steps) ───── */}
      <aside className="group flex w-14 flex-col items-center bg-off-black transition-all hover:w-60">
        {steps.map(({ id, label, icon: Icon }, i) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => navigate(`/builder/${id}`)}
              className={cn(
                "relative flex w-full items-center overflow-hidden px-2 py-3 transition-colors",
                isActive ? "bg-gray-800 text-white" : "hover:bg-gray-900",
              )}
              title={`Step ${i + 1}: ${label}`}
            >
              <span
                className={cn(
                  "mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  isActive ? "border-primary bg-primary" : "border-gray-700 bg-gray-800",
                )}
              >
                <Icon className={isActive ? "text-white" : "text-gray-500"} />
              </span>
              <span className="whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                {i + 1}. {label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* ───── main column + right rail ───── */}
      <main className="flex flex-1 overflow-hidden">
        {/* centre column */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="px-4 pb-2 pt-4">
            <h2 className="text-2xl font-semibold capitalize">{active}</h2>
          </header>

          <PartGrid category={active} selectedId={selectedId} />
        </div>

        {/* right rail: toolbar + live-panel */}
        <aside className="w-80 shrink-0 border-l border-gray-700 flex flex-col">
             {/* toolbar – fixed height */}
             <div className="h-12 flex items-center justify-end gap-2 px-4">
               <BuilderToolbar />
             </div>

             {/* LivePanel takes the remaining space  */}
             <div className="flex-1 overflow-y-auto">
               <LivePanel />
             </div>
           </aside>
      </main>

      {/* compare tray + details drawer */}
      <CompareTray />
      <DetailsDrawer />
    </div>
  );
}
