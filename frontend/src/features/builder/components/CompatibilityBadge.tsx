import { CheckCircle, XCircle } from "lucide-react";

export default function CompatibilityBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 text-green-400 text-xs">
      <CheckCircle className="h-3 w-3" /> Fits
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-red-500 text-xs">
      <XCircle className="h-3 w-3" /> Mismatch
    </span>
  );
}
