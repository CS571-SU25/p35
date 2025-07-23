/* ──────────────────────────────────────────────────────────────
   Central definition of the builder wizard steps
   ────────────────────────────────────────────────────────────── */

export type StepId =
  | "cpu"
  | "gpu"
  | "mobo"
  | "memory"
  | "storage"
  | "cooler"
  | "case"
  | "psu"
  | "accessories"
  | "summary";

export const steps: { id: StepId; label: string }[] = [
  { id: "cpu",         label: "CPU"          },
  { id: "gpu",         label: "GPU"          },
  { id: "mobo",        label: "Motherboard"  },
  { id: "memory",      label: "Memory"       },
  { id: "storage",     label: "Storage"      },
  { id: "cooler",      label: "Cooler"       },
  { id: "case",        label: "Case"         },
  { id: "psu",         label: "PSU"          },
  { id: "accessories", label: "Accessories"  },
  { id: "summary",     label: "Summary"      },
];

/** Helper used by each Step component to navigate to the next step */
export function nextStep(current: StepId): StepId {
  const idx = steps.findIndex((s) => s.id === current);
  return steps[Math.min(idx + 1, steps.length - 1)].id;
}

/** Previous step relative to current (restored helper) */
export function prevStep(current: StepId): StepId {
  const idx = steps.findIndex(s => s.id === current);
  return steps[Math.max(idx - 1, 0)].id;
}
