import { toast } from "sonner";
import { CheckCircle, X } from "lucide-react";

/**
 * Shows a polished “Added …” toast with an inline “Next” button.
 * @param partName  e.g. "Intel Core i7-14700K"
 * @param nextLabel e.g. "GPU"
 * @param onNext    callback when user clicks “Next”
 */
export function showPartAddedToast(
  partName: string,
  nextLabel: string,
  onNext: () => void
) {
  toast.custom((id) => (
    <div className="flex flex-col gap-2">
      {/* row 1: icon, label, dismiss */}
      <div className="flex items-start gap-3">
  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />

  <div className="flex-1 text-sm">
  <div className="font-medium">{partName}</div>
    <div className="text-gray-400">added to build</div>
  </div>

  <button
  onClick={() => toast.dismiss(id)}
  className="p-1 text-gray-400 hover:text-gray-200"
  aria-label="Dismiss"
  >
  <X className="h-4 w-4" />
    </button>
    </div>

  {/* row 2: primary CTA */}
  <button
    onClick={() => {
    toast.dismiss(id);
    onNext();
  }}
  className="self-end rounded-md bg-primary px-3 py-1.5 text-sm font-semibold"
    >
    Next: {nextLabel} →
      </button>

  {/* progress bar */}
  <div className="h-1 w-full overflow-hidden rounded bg-gray-700">
  <div className="h-full animate-toast-progress bg-primary" />
    </div>
    </div>
), { duration: 6000 });
}
