import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/stores/buildStore";
import { Trash2 } from "lucide-react";

export default function MyBuildsDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const builds   = useBuildStore(s => s.builds);
  const load     = useBuildStore(s => s.loadBuild);
  const deleteB  = useBuildStore(s => s.deleteBuild);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="right" className="w-80">
        <h3 className="mb-4 text-lg font-bold">My Builds</h3>

        {builds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No builds saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {builds.map(b => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded border border-gray-700 p-2"
              >
                <button
                  className="flex flex-col text-left"
                  onClick={() => {
                    load(b.id);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{b.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(b.date).toLocaleDateString()}
                  </span>
                </button>

                <Button
                  size="icon"
                  variant="ghost"
                  title="Delete build"
                  onClick={() => deleteB(b.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
