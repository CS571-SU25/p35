/* ──────────────────────────────────────────────────────────────
   Watches active CPU + motherboard sockets and shows a red toast
   when they mismatch.
   ────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { useBuildStore } from "@/stores/buildStore";
import type { Part } from "@/lib/types";

export default function CompatibilityWatcher() {
  /* subscribe only to the currently‑active CPU and mobo ------------- */
  const cpu = useBuildStore((s) => {
    const id = s.active.cpu;
    return id ? (s.candidates.cpu.find((p) => p.id === id) as Part) : undefined;
  });

  const mobo = useBuildStore((s) => {
    const id = s.active.mobo;
    return id
      ? (s.candidates.mobo.find((p) => p.id === id) as Part)
      : undefined;
  });

  /* store Sonner toast id */
  const toastId = useRef<string | number | null>(null);

  useEffect(() => {
    const cpuSocket  = cpu?.spec?.socket as string | undefined;
    const moboSocket = mobo?.spec?.socket as string | undefined;
    const mismatch =
      !!cpu && !!mobo && cpuSocket && moboSocket && cpuSocket !== moboSocket;

    /* ------------ show toast on mismatch ------------ */
    if (mismatch && toastId.current === null) {
      toastId.current = toast.custom(
        /* component */
        (id) => (
          <div className="flex w-[360px] items-start gap-3 rounded-lg border border-destructive bg-destructive p-4 text-destructive-foreground">
            <AlertTriangle className="mt-0.5 h-6 w-6" />

            <div className="flex-1 text-sm">
              <p className="font-semibold">Motherboard incompatible</p>
              <p className="mt-0.5">
                Selected board ({moboSocket}) does not support&nbsp;
                {cpu!.brand} socket&nbsp;{cpuSocket}.
              </p>
            </div>

            <button
              onClick={() => toast.dismiss(id)}
              className="text-sm underline"
            >
              Dismiss
            </button>
          </div>
        ),

        /* options (Sonner v2) */
        {
          duration: 6000,
          position: "top-center",
          className: "p-0 bg-transparent shadow-none border-none",
          style:   { background: "transparent", boxShadow: "none", padding: 0 },
        }
      );
    }

    /* ------------ dismiss when fixed ------------ */
    if (!mismatch && toastId.current !== null) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }
  }, [cpu, mobo]);

  return null; // renders nothing
}
