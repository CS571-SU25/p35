// src/components/SetupDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useBuildStore } from "@/stores/buildStore.ts";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// define your presets
const USE_CASES = [
    { value: "1080p60",   label: "1080p @ 60 FPS",   gradient: "from-blue-500 to-blue-700",    fps:  60 },
    { value: "1440p144",  label: "1440p @ 144 FPS",  gradient: "from-purple-500 to-indigo-600", fps: 144 },
    { value: "4k60",      label: "4K @ 60 FPS",      gradient: "from-orange-400 to-red-500",    fps:  60 },
    { value: "productivity", label: "Productivity",  gradient: "from-green-400 to-green-600",  fps:  30 },
] as const;
type UseCase = typeof USE_CASES[number]["value"];

export function SetupDialog({ open, onOpenChange }: Props) {
    // store setters
    const setBudgetTarget       = useBuildStore((s) => s.setBudgetTarget);
    const setPerformanceTarget  = useBuildStore((s) => s.setPerformanceTarget);

    // local temp state
    const [budget, setBudget]    = useState(1500);
    const [useCase, setUseCase]  = useState<UseCase>("1080p60");

    // when user clicks Save…
    const onSave = () => {
        setBudgetTarget(budget);
        // look up fps from the chosen preset:
        const chosen = USE_CASES.find((u) => u.value === useCase)!;
        setPerformanceTarget(chosen.fps);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-off-black text-white rounded-2xl p-6 max-w-lg">
                <DialogTitle className="text-2xl font-bold mb-6">
                    Let’s get started
                </DialogTitle>

                <div className="space-y-12">
                    {/* ————— Budget Slider ————— */}
                    <div>
                        <label className="block text-sm text-green-400 font-medium mb-2">
                            Budget (USD)
                        </label>
                        <div className="mb-2 text-center text-green-400 text-3xl font-bold text-primary">
                            ${budget}
                        </div>
                        <input
                            type="range"
                            min={500}
                            max={5000}
                            step={50}
                            value={budget}
                            onChange={(e) => setBudget(+e.target.value)}
                            className="
                w-full h-2 rounded-lg bg-gray-700
                accent-primary cursor-pointer
              "
                        />
                    </div>

                    {/* ————— Use-Case Selector ————— */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Primary Use-Case
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {USE_CASES.map(({ value, label, gradient }) => (
                                <button
                                    key={value}
                                    onClick={() => setUseCase(value)}
                                    className={`
                    p-3 rounded-lg border-2 transition
                    ${useCase === value
                                        ? `bg-gradient-to-br ${gradient} text-white border-transparent`
                                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}
                  `}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ————— Save Button ————— */}
                    <Button
                        onClick={onSave}
                        className="w-full bg-primary hover:bg-primary/80 text-white"
                    >
                        Save &amp; Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
