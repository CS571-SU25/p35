import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import BuilderLayout from './BuilderLayout';

/* ───── lazy step components ───── */
const CpuStep = lazy(() => import('./steps/CpuStep').then((m) => ({ default: m.default })));
const GpuStep = lazy(() => import('./steps/GpuStep').then((m) => ({ default: m.default })));
const MoboStep = lazy(() => import('./steps/MoboStep').then((m) => ({ default: m.default })));
const MemoryStep = lazy(() => import('./steps/MemoryStep').then((m) => ({ default: m.default })));
const StorageStep = lazy(() => import('./steps/StorageStep').then((m) => ({ default: m.default }))); // NEW
const CoolerStep = lazy(() => import('./steps/CoolerStep').then((m) => ({ default: m.default }))); // NEW
const CaseStep = lazy(() => import('./steps/CaseStep').then((m) => ({ default: m.default })));
const PsuStep = lazy(() => import('./steps/PsuStep').then((m) => ({ default: m.default }))); // NEW
const AccessoriesStep = lazy(() =>
  import('./steps/AccessoriesStep').then((m) => ({ default: m.default })),
);
const SummaryStep = lazy(() => import('./steps/SummaryStep').then((m) => ({ default: m.default })));

/* ───── eager loaders ───── */
import { cpuLoader } from './loader/cpuLoader';
import { gpuLoader } from './loader/gpuLoader';
import { moboLoader } from './loader/moboLoader';
import { memoryLoader } from './loader/memoryLoader';
import { storageLoader } from './loader/storageLoader'; // NEW
import { coolerLoader } from './loader/coolerLoader'; // NEW
import { caseLoader } from './loader/caseLoader';
import { psuLoader } from './loader/psuLoader'; // NEW
import { accessoriesLoader } from './loader/accessoriesLoader';

/* ───── route tree ───── */
export const builderRoutes: RouteObject = {
  path: '/builder/*',
  element: <BuilderLayout />,
  children: [
    { index: true, element: <Navigate to="cpu" replace /> },

    { path: 'cpu', loader: cpuLoader, element: <CpuStep /> },
    { path: 'gpu', loader: gpuLoader, element: <GpuStep /> },
    { path: 'mobo', loader: moboLoader, element: <MoboStep /> },
    { path: 'memory', loader: memoryLoader, element: <MemoryStep /> },
    { path: 'storage', loader: storageLoader, element: <StorageStep /> }, // NEW
    { path: 'cooler', loader: coolerLoader, element: <CoolerStep /> }, // NEW
    { path: 'case', loader: caseLoader, element: <CaseStep /> },
    { path: 'psu', loader: psuLoader, element: <PsuStep /> }, // NEW
    { path: 'accessories', loader: accessoriesLoader, element: <AccessoriesStep /> },

    { path: 'summary', element: <SummaryStep /> },
  ],
};
