import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PartRow from "./PartRow";
import OptionCard from "./OptionCard";
import { Collapsible } from "@radix-ui/react-collapsible";
import { AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

import {
  useBuildStore,
  type Category,
} from "@/stores/buildStore";
import type { Part } from "@/lib/types";

/* display order */
const CATS: Category[] = [
  "cpu",
  "gpu",
  "mobo",
  "memory",
  "storage",
  "cooler",
  "case",
  "psu",
  "accessories",
];

export default function LivePanel() {
  const budgetTarget = useBuildStore((s) => s.budgetTarget);
  const { candidates, active } = useBuildStore();

  const setActive = useBuildStore((s) => s.setActive);
  const remove    = useBuildStore((s) => s.removeCandidate);

  /* selected parts + running total */
  const selected: Partial<Record<Category, Part>> = {};
  let total = 0;
  CATS.forEach((c) => {
    const part = candidates[c].find((p) => p.id === active[c]);
    if (part) {
      selected[c] = part;
      total += part.price_usd;
    }
  });

  /* warnings placeholder */
  const warnings: string[] = [];

  /* ────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-4 p-6">
      {/* BUDGET (sticky) */}
      <Card className="sticky top-0 z-10">
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1 text-sm">
            {CATS.map((cat) => (
              <div key={cat} className="flex justify-between">
                <span className="capitalize text-muted-foreground">{cat}</span>
                <span>
                  <span data-budget-pad={cat}>
                    {selected[cat] ? `$${selected[cat]!.price_usd.toFixed(2)}` : "—"}
                  </span>
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-muted pt-2 font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {budgetTarget && <Progress value={(total / budgetTarget) * 100} />}
          </div>
        </CardContent>
      </Card>

      {/* SECTIONS ------------------------------------------------------ */}
      {CATS.map((cat) => {
        const sel = selected[cat];
        const pool = candidates[cat];

        /* group detection */
        const section =
          sel   ? "Selected" :
            pool.length ? "Candidates" :
              "Missing";

        return (
          <Collapsible key={cat} defaultOpen={section !== "Missing"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="capitalize">{cat}</CardTitle>
                {/* toggle collapse */}
              </CardHeader>

              <CardContent className="space-y-3">
                {/* ---- Selected row ---- */}
                <AnimatePresence initial={false}>
                  {sel && (
                    <PartRow
                      key={sel.id}
                      part={sel}
                      isActive
                      onMakeActive={() => {}}
                      onRemove={() => remove(cat, sel.id)}
                    />
                  )}
                </AnimatePresence>

                {/* ---- Candidates (horizontal scroll) ---- */}
                {pool.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto py-1">
                    {pool
                      .filter((p) => p.id !== sel?.id)
                      .map((p) => (
                        <OptionCard
                          key={p.id}
                          part={p}
                          isActive={false}
                          onSelect={() => {
                            setActive(cat, p.id);
                            toast.success(`${p.model} active for ${cat}`);
                          }}
                          onRemove={() => remove(cat, p.id)}
                        />
                      ))}
                  </div>
                )}

                {/* ---- Missing state ---- */}
                {!pool.length && (
                  <button
                    className="w-full rounded-md border border-dashed border-muted py-6 text-sm text-muted-foreground hover:bg-muted/30"
                    onClick={() =>
                      toast(
                        `Open the ${cat.toUpperCase()} step to add compatible parts`,
                        { position: "bottom-right" }
                      )
                    }
                  >
                    ➕ Add your {cat.toUpperCase()} to unlock compatible parts
                  </button>
                )}
              </CardContent>
            </Card>
          </Collapsible>
        );
      })}

      {/* COMPAT WARNINGS ---------------------------------------------- */}
      {warnings.length > 0 && (
        <Card className="border-destructive text-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" /> Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
