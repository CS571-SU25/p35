/* src/features/builder/BuilderLayout.tsx */
import React, { useEffect } from "react";
import gsap from "gsap";
import { Outlet, NavLink } from "react-router-dom";
import { steps, type StepId } from "./builderSteps";

import LivePanel from "./components/LivePanel";
import { CompareTray } from "./components/CompareTray";

import {
  Cpu,
  Gpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  ThermometerSnowflake,
  PcCase,
  PlugZap,
  Keyboard,
  CheckCircle,
} from "lucide-react";

const iconMap: Record<StepId, React.FC<React.SVGProps<SVGSVGElement>>> = {
  cpu: Cpu,
  gpu: Gpu,
  mobo: CircuitBoard,
  memory: MemoryStick,
  storage: HardDrive,
  cooler: ThermometerSnowflake,
  case: PcCase,
  psu: PlugZap,
  accessories: Keyboard,
  summary: CheckCircle,
};

export default function BuilderLayout() {
  // Restore navbar if Landing page hid it
  useEffect(() => {
    const nav = document.getElementById("site-nav");
    if (nav) {
      gsap.killTweensOf(nav);
      gsap.set(nav, {
        clearProps: "all", // remove inline gsap styles
        opacity: 1,
        y: 0,
        pointerEvents: "auto",
      });
      nav.classList.remove("nav-hidden");
    }
  }, []);

  return (
    <div className="flex h-screen flex-col bg-off-black text-white">
      <div className="flex flex-1 gap-8 p-4 lg:p-8">
        {/* Sidebar (desktop) */}
        <aside className="group/rail hidden w-12 flex-col items-center bg-off-black transition-[width] duration-300 ease-out hover:w-48 lg:flex">
          {steps.map(({ id, label }, i) => {
            const Icon = iconMap[id];
            return (
              <NavLink
                key={id}
                to={`/builder/${id}`}
                title={`Step ${i + 1}: ${label}`}
                className={({ isActive }) =>
                  `relative flex w-full items-center overflow-hidden rounded-md px-2 py-4 transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-800 text-white font-semibold"
                      : "hover:bg-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-primary bg-primary"
                          : "border-gray-700 bg-gray-800"
                      }`}
                    >
                      <Icon
                        className={isActive ? "text-white" : "text-gray-500"}
                      />
                    </span>
                    <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100">
                      {i + 1}. {label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>

        {/* Right rail */}
        <aside className="flex w-80 shrink-0 flex-col border-l border-gray-700">
          <div className="flex-1 overflow-y-auto">
            <LivePanel />
          </div>
        </aside>
      </div>

      <CompareTray />
    </div>
  );
}
