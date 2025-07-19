import { useBuildStore } from "@/stores/buildStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryStep() {
  const selected = useBuildStore((s) => s.selected);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 text-white bg-off-black">
      <h2 className="text-3xl font-semibold mb-4">Build Summary</h2>

      {Object.entries(selected).map(([step, part]) => (
        part && (
          <Card key={step}>
            <CardHeader>
              <CardTitle className="capitalize">{step}</CardTitle>
            </CardHeader>
            <CardContent>
              {part.brand} {part.model} — ${part.price_usd?.toFixed(2) ?? "—"}
            </CardContent>
          </Card>
        )
      ))}

      {!Object.values(selected).some(Boolean) && (
        <p className="text-muted-foreground">No parts selected yet.</p>
      )}
    </div>
  );
}

/* No loader needed for summary */
