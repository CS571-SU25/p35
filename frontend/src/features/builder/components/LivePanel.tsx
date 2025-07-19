import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

import { PerfGauge } from "./PerfGauge";
import { useBuildStore } from "@/stores/buildStore";

/* --------------- component --------------- */
export function LivePanel() {
  /* selections and targets from zustand */
  const selected       = useBuildStore((s) => s.selected);
  const budgetTarget   = useBuildStore((s) => s.budgetTarget);

  /* ----------- derived totals ------------ */
  const total = useMemo(
    () => Object.values(selected).reduce((sum, p) => sum + (p?.price_usd ?? 0), 0),
    [selected]
  );

  /* ----------- budget warning ------------ */
  useEffect(() => {
    if (budgetTarget && total > budgetTarget) {
      toast.warning(`Budget exceeded by $${(total - budgetTarget).toFixed(2)}`);
    }
  }, [total, budgetTarget]);

  /* -------- placeholder fps & warnings --- */
  const fps = 250;
  const warnings: string[] = [];   // fill this later with real compat checks

  /* --------------- render ---------------- */
  return (
    <div className="space-y-4 p-6">
      {/* -------- Budget card -------- */}
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xl font-semibold">
            ${total.toFixed(2)} {budgetTarget && <>/ ${budgetTarget}</>}
          </p>
          {budgetTarget && (
            <Progress value={(total / budgetTarget) * 100} />
          )}
        </CardContent>
      </Card>

      {/* ----- Performance card ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <PerfGauge score={fps / 400} />
        </CardContent>
      </Card>

      {/* ---- Compatibility warnings --- */}
      {warnings.length > 0 && (
        <Card className="border-destructive text-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" /> Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}