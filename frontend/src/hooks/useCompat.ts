import { useBuildStore, type Category } from "@/stores/buildStore";
import type { Part } from "@/lib/types";

export interface CompatResult {
  ok: boolean;
  reason?: string;
}

/**
 * Live compatibility checker.
 * Subscribes to the MINIMUM slice of the store it needs,
 * so only the affected cards re‑render.
 */
export function useCompat(part: Part): CompatResult {
  /* ---------------------------------------------------------------
     Helper to grab the *active* part in a given category           */
  const activePart = <T extends Category>(cat: T) =>
    useBuildStore((s) => {
      const id = s.active[cat];
      return id ? s.candidates[cat].find((p) => p.id === id) : undefined;
    });

  const cpu     = activePart("cpu");
  const mobo    = activePart("mobo");

  /* ---------- mobo vs CPU socket -------------------------------- */
  if (part.category === "mobo" && cpu) {
    const cpuSocket  = cpu.spec?.socket as string | undefined;
    const moboSocket = part.spec?.socket as string | undefined;
    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      return { ok: false, reason: `Needs ${cpuSocket}` };
    }
  }

  /* ---------- memory vs mobo memory type ------------------------ */
  if (part.category === "memory" && mobo) {
    const moboType = mobo.spec?.memory_type as string | undefined;
    const memType  = part.spec?.type as string | undefined;
    if (moboType && memType && moboType !== memType) {
      return { ok: false, reason: `Mobo is ${moboType}` };
    }
  }

  /* ---------- cooler vs CPU socket ------------------------------ */
  if (part.category === "cooler" && cpu) {
    const cpuSocket = cpu.spec?.socket as string | undefined;
    const sockets   = part.spec?.socket as string[] | undefined;
    if (cpuSocket && sockets && !sockets.includes(cpuSocket)) {
      return { ok: false, reason: `Lacks ${cpuSocket}` };
    }
  }

  return { ok: true };
}
