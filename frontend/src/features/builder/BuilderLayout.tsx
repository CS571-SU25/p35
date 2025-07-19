/* ──────────────────────────────────────────────────────────
   src/features/builder/BuilderLayout.tsx
   ────────────────────────────────────────────────────────── */

import { Outlet, useNavigate, useParams } from "react-router-dom";
import { steps, type StepId } from "./builderSteps";
import { useWizardArrows } from "./useWizardArrows";

import { LivePanel }   from "./components/LivePanel";
import { CompareTray } from "./components/CompareTray";
import BuilderToolbar  from "./BuilderToolbar";

/* ─── icons for the sidebar ─── */
import {
  Cpu,
  Gpu,
  CircuitBoard,
  MemoryStick,
  PcCase,
  Keyboard,
  CheckCircle,
} from "lucide-react";

const iconMap: Record<StepId, React.FC<React.SVGProps<SVGSVGElement>>> = {
  cpu: Cpu,
  gpu: Gpu,
  mobo: CircuitBoard,
  memory: MemoryStick,
  case: PcCase,
  accessories: Keyboard,
  summary: CheckCircle,
};

export default function BuilderLayout() {
  /* active step ---------------------------------------------------------- */
  const { stepId = "cpu" } = useParams<{ stepId?: StepId }>();
  const active = stepId as StepId;

  /* helpers -------------------------------------------------------------- */
  const navigate = useNavigate();
  useWizardArrows(active);

  /* --------------------------------------------------------------------- */
  return (
    <div className="flex h-screen gap-8 bg-off-black p-4 text-white lg:p-8">
      {/* ───── sidebar (wizard steps) ───── */}
      <aside className="group flex w-14 flex-col items-center bg-off-black transition-[width] duration-300 hover:w-60">
        {steps.map(({ id, label }, i) => {
          const Icon = iconMap[id];
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => navigate(`/builder/${id}`)}
              className={`relative flex w-full items-center overflow-hidden px-2 py-3
                ${isActive ? "bg-gray-800 text-white font-semibold" : "hover:bg-gray-900"}
                transition-colors duration-200`}
              title={`Step ${i + 1}: ${label}`}
            >
              <span
                className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2
                  ${isActive ? "border-primary bg-primary" : "border-gray-700 bg-gray-800"}`}
              >
                <Icon className={isActive ? "text-white" : "text-gray-500"} />
              </span>
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {i + 1}. {label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* ───── main column (route outlet) ───── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>

      {/* ───── right rail (toolbar + live panel) ───── */}
      <aside className="flex w-80 shrink-0 flex-col border-l border-gray-700">
        {/* toolbar – fixed height */}
        <div className="flex h-12 items-center justify-end gap-2 px-4">
          <BuilderToolbar />
        </div>

        {/* live panel fills the rest */}
        <div className="flex-1 overflow-y-auto">
          <LivePanel />
        </div>
      </aside>

      {/* compare tray sits fixed at bottom of viewport */}
      <CompareTray />
    </div>
  );
}
