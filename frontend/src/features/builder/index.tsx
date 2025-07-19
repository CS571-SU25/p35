import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import BuilderLayout from "./BuilderLayout";

/* ───── lazy components (one per step) ───── */
const CpuStep         = lazy(() => import("./steps/CpuStep").then(m => ({ default: m.default })));
const GpuStep         = lazy(() => import("./steps/GpuStep").then(m => ({ default: m.default })));
const MoboStep        = lazy(() => import("./steps/MoboStep").then(m => ({ default: m.default })));
const MemoryStep      = lazy(() => import("./steps/MemoryStep").then(m => ({ default: m.default })));
const CaseStep        = lazy(() => import("./steps/CaseStep").then(m => ({ default: m.default })));
const AccessoriesStep = lazy(() => import("./steps/AccessoriesStep").then(m => ({ default: m.default })));
const SummaryStep     = lazy(() => import("./steps/SummaryStep").then(m => ({ default: m.default })));

/* ───── eager loader imports (no default import!) ───── */
import { cpuLoader }         from "./loader/cpuLoader";
import { gpuLoader }         from "./loader/gpuLoader";
import { moboLoader }        from "./loader/moboLoader";
import { memoryLoader }      from "./loader/memoryLoader";
import { caseLoader }        from "./loader/caseLoader";
import { accessoriesLoader } from "./loader/accessoriesLoader";


/* ───── route tree ───── */
export const builderRoutes: RouteObject = {
  path: "builder",
  element: <BuilderLayout />,
  children: [
    { index: true, element: <Navigate to="cpu" replace /> },

    { path: "cpu",         loader: cpuLoader,         element: <CpuStep /> },
    { path: "gpu",         loader: gpuLoader,         element: <GpuStep /> },
    { path: "mobo",        loader: moboLoader,        element: <MoboStep /> },
    { path: "memory",      loader: memoryLoader,      element: <MemoryStep /> },
    { path: "case",        loader: caseLoader,        element: <CaseStep /> },
    { path: "accessories", loader: accessoriesLoader, element: <AccessoriesStep /> },

    { path: "summary", element: <SummaryStep /> },
  ],
};
