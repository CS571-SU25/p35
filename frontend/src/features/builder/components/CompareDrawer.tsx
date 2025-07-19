/*  src/features/builder/components/CompareDrawer.tsx  */
import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useBuildStore } from "@/stores/buildStore"
import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

interface CompareDrawerProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const rows: Array<keyof Part | string> = [
  "price_usd",
  "spec.boost_clock",
  "spec.base_clock",
  "spec.vram_gb",
  "spec.cores",
  "spec.threads",
  "spec.capacity_gb",
  "spec.speed",
  "spec.read",
  "spec.tdp_w",
]

function getValue(part: Part, key: string) {
  if (key.startsWith("spec.")) {
    return part.spec[key.slice(5)]
  }
  return (part as any)[key]
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function CompareDrawer({
                                        open,
                                        onOpenChange,
                                      }: CompareDrawerProps) {
  /* items to compare pulled from the build-store tray */
  const parts = useBuildStore((s) => s.compare)

  /* Don’t render the drawer at all unless we have ≥ 2 parts */
  if (parts.length < 2) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(440px,100%)] p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Compare&nbsp;({parts.length})</SheetTitle>
        </SheetHeader>

        {/* ─── Scrollable diff table ───────────────────────────── */}
        <ScrollArea className="h-full">
          <div
            className="grid gap-px bg-gray-700/60 text-sm"
            style={{
              gridTemplateColumns: `160px repeat(${parts.length}, minmax(0,1fr))`,
            }}
          >
            {/* ─── header row ─── */}
            <div className="bg-background" />
            {parts.map((p) => (
              <div
                key={p.id}
                className="sticky top-0 z-10 bg-background/90 px-2 py-1 text-center text-xs font-semibold backdrop-blur"
              >
                {p.brand}
                <br />
                {p.model}
              </div>
            ))}

            {/* ─── spec rows ─── */}
            {rows.map((rawKey) => {
              const label = rawKey
                .replace(/^spec\./, "")
                .replace("_usd", "")
                .replace(/_/g, " ")

              return (
                <React.Fragment key={rawKey}>
                  {/* label cell */}
                  <div className="bg-gray-800/40 px-3 py-1 text-right font-medium capitalize">
                    {label}
                  </div>

                  {/* value cells */}
                  {parts.map((p) => {
                    const v = getValue(p, rawKey)
                    return (
                      <div
                        key={p.id + rawKey}
                        className={cn(
                          "bg-background px-2 py-1 text-center",
                          rawKey === "price_usd" && "font-semibold",
                        )}
                      >
                        {v ?? "—"}
                        {rawKey === "price_usd" && typeof v === "number" ? " $" : ""}
                      </div>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
