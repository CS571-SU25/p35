import type { StepId } from "./builderSteps";

/**
 * Prefetch the JavaScript chunk for the **next** wizard step.
 * Call right after the user confirms a part so the following
 * screen opens instantly.
 *
 * Vite / Rollup will convert these dynamic imports to separate
 * chunks and attach `rel="prefetch"` hints in production builds.
 */
export function prefetchNextStep(current: StepId): void {
  switch (current) {
    case "cpu":
      import(/* webpackPrefetch: true */ "./steps/GpuStep");
      break;
    case "gpu":
      import(/* webpackPrefetch: true */ "./steps/MoboStep");
      break;
    case "mobo":
      import(/* webpackPrefetch: true */ "./steps/MemoryStep");
      break;
    case "memory":
      import(/* webpackPrefetch: true */ "./steps/StorageStep");
      break;
    case "storage":
      import(/* webpackPrefetch: true */ "./steps/CoolerStep");
      break;
    case "cooler":
      import(/* webpackPrefetch: true */ "./steps/CaseStep");
      break;
    case "case":
      import(/* webpackPrefetch: true */ "./steps/PsuStep");
      break;
    case "psu":
      import(/* webpackPrefetch: true */ "./steps/AccessoriesStep");
      break;
    case "accessories":
      import(/* webpackPrefetch: true */ "./steps/SummaryStep");
      break;
    // "summary" is the final step — no further prefetch needed
  }
}
