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

// Accent colors
const ACCENT1 = '#00F0FF';
const ACCENT2 = '#FF0090';

// Custom dot for ScatterChart
interface CustomDotProps {
  cx?: number
  cy?: number
  payload: { part_id: string }
  partId: string
}

const CustomDot = ({ cx = 0, cy = 0, payload, partId }: CustomDotProps) => {
  const isSelected = payload.part_id === partId

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isSelected ? 6 : 4}
      fill={isSelected ? ACCENT2 : ACCENT1}
    />
  )
}


interface Benchmark { part_id: string; model: string; price_usd: number; geekbench6_single: number; geekbench6_multi: number; cinebench_r23_multi: number }
interface Props { part: Part; open: boolean; onOpenChange: (v: boolean) => void; onAdd: (p: Part) => void }

export default function PartDetailsModal({ part, open, onOpenChange, onAdd }: Props) {
  const { text } = accent[part.brand] ?? accent.default;
  const [benchData, setBenchData] = useState<Benchmark[]>([]);

  useEffect(() => {
    const supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string
    );
    supabaseClient
      .from('cpu_benchmarks')
      .select('part_id,geekbench6_single,geekbench6_multi,cinebench_r23_multi,parts(model,price_usd)')
      .eq('parts.category', 'cpu')
      .then(({ data, error }) => {
        if (error) return console.error('Error loading benchmarks:', error.message);
        const formatted = data?.map((row: any) => ({
          part_id: row.part_id,
          model: row.parts.model,
          price_usd: row.parts.price_usd,
          geekbench6_single: row.geekbench6_single,
          geekbench6_multi: row.geekbench6_multi,
          cinebench_r23_multi: row.cinebench_r23_multi,
        })) ?? [];
        setBenchData(formatted);
      });
  }, []);

  const pricePerf = benchData.map(item => ({ ...item, perfRatio: item.cinebench_r23_multi / item.price_usd }));
  const sortedPricePerf = [...pricePerf].sort((a, b) => a.perfRatio - b.perfRatio);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-48%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} exit={{ opacity: 0, scale: 0.92, x: "-50%", y: "-48%" }} transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }} className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
                <header className="flex items-start justify-between border-b border-gray-700 p-6">
                  <div>
                    <h2 className={cn("text-2xl font-semibold", text)}>{part.brand} {part.model}</h2>
                    <p className="text-lg font-bold text-gray-100 tracking-tight mt-1">${part.price_usd.toFixed(2)}</p>
                  </div>
                  <Dialog.Close asChild>
                    <button className="icon-btn text-gray-400 hover:text-gray-200" aria-label="Close">✕</button>
                  </Dialog.Close>
                </header>

                <Tabs defaultValue="specs" className="flex-1 overflow-y-auto">
                  <TabsList
                    className="sticky top-0 z-20 border-b border-gray-700 bg-gray-900 flex-wrap px-6 py-4"
                  >
                    <TabsTrigger
                      value="specs"
                      className="relative z-0 px-5 py-2 mx-1 rounded-t-xl
      data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400 data-[state=inactive]:z-0
      data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:z-10"
                    >
                      Specs
                    </TabsTrigger>
                    <TabsTrigger
                      value="bench"
                      className="
                      relative z-0 px-5 py-2 mx-1 rounded-t-xl data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-400 data-[state=inactive]:z-0
                    data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:z-10
  "
                    >
                      Benchmarks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="specs" className="px-6 py-6">
                    <SpecsGrid part={part} />
                  </TabsContent>

                  <TabsContent value="bench" className="px-6 py-6">
                    {benchData.length === 0 ? <Skeleton className="h-80 w-full rounded-md" /> : (
                      <div className="space-y-8">
                        <Card className="h-80">
                          <CardHeader><h3 className="text-lg font-semibold">Performance Overview</h3></CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                              <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="geekbench6_single" name="Single-Core" padding={{ left: 20, right: 20 }} />
                                <YAxis type="number" dataKey="geekbench6_multi" name="Multi-Core" padding={{ top: 20, bottom: 20 }} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="CPUs" data={benchData} shape={(props: any) => <CustomDot {...props} partId={part.id} />} />
                              </ScatterChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        <Card className="h-80">
                          <CardHeader><h3 className="text-lg font-semibold">Price vs. Performance</h3></CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                              <BarChart data={sortedPricePerf} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="model" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} interval={0} />
                                <YAxis />
                                <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : ''} />
                                <Bar dataKey="perfRatio" name="Score per $" radius={[4,4,0,0]} isAnimationActive={false}>
                                  {sortedPricePerf.map(entry => (
                                    <Cell key={entry.part_id} fill={entry.part_id === part.id ? ACCENT2 : ACCENT1} />
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

                <footer className="flex justify-end gap-3 border-t border-gray-700 p-6">
                  <Dialog.Close asChild><Button variant="secondary" size="lg">Cancel</Button></Dialog.Close>
                  <Button size="lg" onClick={() => { onAdd(part); onOpenChange(false); }}>Add to build</Button>
                </footer>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
