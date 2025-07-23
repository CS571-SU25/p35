/* ──────────────────────────────────────────────────────────────
   PartDetailsModal — quick‑add / set‑active / remove aware
   ────────────────────────────────────────────────────────────── */
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { accent } from "@/lib/accentMap";
import { cn } from "@/lib/utils";
import type { Part } from "@/lib/types";
import SpecsGrid from "./SpecsGrid";

import {
  useBuildStore,
  type Category,
} from "@/stores/buildStore";

/* accent colours for charts */
const ACCENT1 = "#00F0FF";
const ACCENT2 = "#FF0090";

/* ---------- benchmark dot with highlight ---------- */
interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload: { part_id: string };
  partId: string;
}
const CustomDot = ({ cx = 0, cy = 0, payload, partId }: CustomDotProps) => (
  <circle
    cx={cx}
    cy={cy}
    r={payload.part_id === partId ? 6 : 4}
    fill={payload.part_id === partId ? ACCENT2 : ACCENT1}
  />
);

/* ---------- typed supabase row ---------- */
interface Benchmark {
  part_id: string;
  model: string;
  price_usd: number;
  geekbench6_single: number;
  geekbench6_multi: number;
  cinebench_r23_multi: number;
}

/* ---------- props ---------- */
interface Props {
  part: Part;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** optional callback so callers can react */
  onAdd?: (p: Part) => void;
}

/* =================================================================== */
export default function PartDetailsModal({
                                           part,
                                           open,
                                           onOpenChange,
                                           onAdd,
                                         }: Props) {
  /* store wiring ----------------------------------------------------- */
  const pool   = useBuildStore(
    (s) => s.candidates[part.category as Category] ?? []
  );
  const activeId = useBuildStore(
    (s) => s.active[part.category as Category]
  );
  const isCandidate = pool.some((p) => p.id === part.id);
  const isActive    = activeId === part.id;

  const add    = useBuildStore((s) => s.addCandidate);
  const remove = useBuildStore((s) => s.removeCandidate);
  const setAct = useBuildStore((s) => s.setActive);

  /* supabase benchmarks --------------------------------------------- */
  const [benchData, setBenchData] = useState<Benchmark[]>([]);
  useEffect(() => {
    const supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string
    );

    supabaseClient
      .from("cpu_benchmarks")
      .select(
        "part_id,geekbench6_single,geekbench6_multi,cinebench_r23_multi,parts(model,price_usd)"
      )
      .eq("parts.category", "cpu")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error loading benchmarks:", error.message);
          return;
        }
        const rows =
          data?.map((r: any) => ({
            part_id: r.part_id,
            model: r.parts.model,
            price_usd: r.parts.price_usd,
            geekbench6_single: r.geekbench6_single,
            geekbench6_multi: r.geekbench6_multi,
            cinebench_r23_multi: r.cinebench_r23_multi,
          })) ?? [];
        setBenchData(rows);
      });
  }, []);

  const pricePerf = benchData.map((b) => ({
    ...b,
    perfRatio: b.cinebench_r23_multi / b.price_usd,
  }));
  const sortedPerf = [...pricePerf].sort((a, b) => a.perfRatio - b.perfRatio);

  const { text } = accent[part.brand] ?? accent.default;

  /* ------------------------------------------------------------------ */
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-48%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.92, x: "-50%", y: "-48%" }}
                transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
                className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
              >
                {/* ---------- header ---------- */}
                <header className="flex items-start justify-between border-b border-gray-700 p-6">
                  <div>
                    <h2 className={cn("text-2xl font-semibold", text)}>
                      {part.brand} {part.model}
                    </h2>
                    <p className="mt-1 text-lg font-bold tracking-tight text-gray-100">
                      ${part.price_usd.toFixed(2)}
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="icon-btn text-gray-400 hover:text-gray-200"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </Dialog.Close>
                </header>

                {/* ---------- tabs ---------- */}
                <Tabs defaultValue="specs" className="flex-1 overflow-y-auto">
                  <TabsList className="sticky top-0 z-20 flex-wrap border-b border-gray-700 bg-gray-900 px-6 py-4">
                    <TabsTrigger value="specs">Specs</TabsTrigger>
                    <TabsTrigger value="bench">Benchmarks</TabsTrigger>
                  </TabsList>

                  {/* specs tab */}
                  <TabsContent value="specs" className="px-6 py-6">
                    <SpecsGrid part={part} />
                  </TabsContent>

                  {/* benchmark tab */}
                  <TabsContent value="bench" className="px-6 py-6">
                    {benchData.length === 0 ? (
                      <Skeleton className="h-80 w-full rounded-md" />
                    ) : (
                      <div className="space-y-8">
                        {/* scatter */}
                        <Card className="h-80">
                          <CardHeader>
                            <h3 className="text-lg font-semibold">
                              Performance Overview
                            </h3>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                              <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  type="number"
                                  dataKey="geekbench6_single"
                                  name="Single‑Core"
                                  padding={{ left: 20, right: 20 }}
                                />
                                <YAxis
                                  type="number"
                                  dataKey="geekbench6_multi"
                                  name="Multi‑Core"
                                  padding={{ top: 20, bottom: 20 }}
                                />
                                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                <Legend />
                                <Scatter
                                  name="CPUs"
                                  data={benchData}
                                  shape={(props: any) => (
                                    <CustomDot {...props} partId={part.id} />
                                  )}
                                />
                              </ScatterChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* bar chart */}
                        <Card className="h-80">
                          <CardHeader>
                            <h3 className="text-lg font-semibold">
                              Price vs. Performance
                            </h3>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                              <BarChart
                                data={sortedPerf}
                                margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="model"
                                  angle={-45}
                                  textAnchor="end"
                                  height={60}
                                  tick={{ fontSize: 12 }}
                                  interval={0}
                                />
                                <YAxis />
                                <Tooltip
                                  formatter={(v: any) =>
                                    typeof v === "number" ? v.toFixed(2) : ""
                                  }
                                />
                                <Bar
                                  dataKey="perfRatio"
                                  name="Score per $"
                                  radius={[4, 4, 0, 0]}
                                  isAnimationActive={false}
                                >
                                  {sortedPerf.map((e) => (
                                    <Cell
                                      key={e.part_id}
                                      fill={e.part_id === part.id ? ACCENT2 : ACCENT1}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* ---------- footer ---------- */}
                <footer className="flex justify-end gap-3 border-t border-gray-700 p-6">
                  {!isCandidate ? (
                    <Button
                      onClick={() => {
                        add(part.category as Category, part);
                        setAct(part.category as Category, part.id);
                        onAdd?.(part);
                        onOpenChange(false);
                      }}
                    >
                      Add to build
                    </Button>
                  ) : (
                    <>
                      {!isActive && (
                        <Button
                          onClick={() => {
                            setAct(part.category as Category, part.id);
                            onOpenChange(false);
                          }}
                        >
                          Set Active
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => {
                          remove(part.category as Category, part.id);
                          onOpenChange(false);
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </footer>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
