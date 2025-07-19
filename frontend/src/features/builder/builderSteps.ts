export const steps = [
  { id: "cpu",         label: "CPU" },
  { id: "gpu",         label: "GPU" },
  { id: "mobo",        label: "Motherboard" },
  { id: "memory",      label: "Memory & Storage" },
  { id: "case",        label: "Case / Cooling / PSU" },
  { id: "accessories", label: "Accessories" },
  { id: "summary",     label: "Summary" },
] as const;

export type StepId = (typeof steps)[number]["id"];

export function nextStep(id: StepId): StepId {
  const i = steps.findIndex(s => s.id === id);
  return steps[Math.min(i + 1, steps.length - 1)].id;
}
export function prevStep(id: StepId): StepId {
  const i = steps.findIndex(s => s.id === id);
  return steps[Math.max(i - 1, 0)].id;
}
