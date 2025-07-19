import type { Part } from "@/lib/types";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

export default function DetailsDrawer() {
  const [open, setOpen] = useState(false);
  const [part, _setPart] = useState<Part | null>(null);

  // Hook this from PartCard: onOpenDetails={(p)=>{setPart(p);setOpen(true)}}

  if (!part) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[340px] overflow-y-auto">
        <h2 className="mb-2 text-lg font-bold">
          {part.brand} {part.model}
        </h2>
        <img src={part.image_path} alt={part.model} className="mb-4 w-full rounded" />
        <pre className="whitespace-pre-wrap text-xs text-gray-300">
          {JSON.stringify(part.spec, null, 2)}
        </pre>
      </SheetContent>
    </Sheet>
  );
}
