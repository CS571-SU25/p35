import { Save, Undo2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/stores/buildStore";
import { toast } from "sonner";
import MyBuildsDrawer from "./MyBuildsDrawer";

export default function BuilderToolbar() {
  const reset       = useBuildStore(s => s.resetCurrent);
  const saveCurrent = useBuildStore(s => s.saveCurrent);

  return (
    <div className="flex items-center gap-2">
      {/* save  */}
      <Button
        variant="ghost"
        size="icon"
        title="Save build (⌘ / Ctrl + S)"
        onClick={() => {
          const name = prompt("Name this build:", "My gaming rig");
          if (name !== null) {
            saveCurrent(name);
            toast.success("Build saved");
          }
        }}
      >
        <Save className="h-5 w-5" />
      </Button>

      {/* reset */}
      <Button
        variant="ghost"
        size="icon"
        title="Reset current build"
        onClick={() => {
          if (confirm("Start from scratch? This does not delete saved builds.")) {
            reset();
            toast("Build cleared");
          }
        }}
      >
        <Undo2 className="h-5 w-5" />
      </Button>

      {/* saved-builds drawer */}
      <MyBuildsDrawer>
        <Button variant="ghost" size="icon" title="My builds">
          <Folder className="h-5 w-5" />
        </Button>
      </MyBuildsDrawer>
    </div>
  );
}
