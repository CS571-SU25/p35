/*  src/features/builder/components/CompareTray.tsx  */
import { useState } from "react";
import { X, Table } from "lucide-react";
import { useBuildStore } from "@/stores/buildStore";
import CompareDrawer from "./CompareDrawer";

export function CompareTray() {
  const compare = useBuildStore((s) => s.compare);
  const remove  = useBuildStore((s) => s.toggleCompare);
  const [open, setOpen] = useState(false);

  if (compare.length === 0) return null;

  return (
    <>
      {/* bottom bar ----------------------------------------------------- */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 flex items-start gap-4 overflow-x-auto border-t border-gray-700 bg-off-black/95 px-4 py-2 backdrop-blur">
        {compare.map((p) => (
          <div
            key={p.id}
            className="relative flex min-w-[200px] items-center gap-2 rounded-md border border-gray-600 p-2"
          >
            <button
              onClick={() => remove(p)}
              className="absolute right-1 top-1 text-gray-400 hover:text-red-400"
              title="Remove from tray"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={p.image_path}
              alt={p.model}
              className="h-10 w-10 object-contain"
            />
            <div className="text-xs leading-tight">
              <p className="font-medium text-gray-200 line-clamp-1">
                {p.brand} {p.model}
              </p>
              <p className="text-gray-400">${p.price_usd.toFixed(0)}</p>
            </div>
          </div>
        ))}

        {/* open-compare button */}
        <button
          disabled={compare.length < 2}
          onClick={() => setOpen(true)}
          className="ml-auto flex items-center gap-1 rounded-md border border-gray-600 px-3 py-1 text-xs text-gray-200 enabled:hover:bg-gray-800 disabled:opacity-40"
        >
          <Table className="h-4 w-4" /> Compare&nbsp;({compare.length})
        </button>
      </aside>

      {/* drawer itself -------------------------------------------------- */}
      <CompareDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
