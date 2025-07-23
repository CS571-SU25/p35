const FACTS = [
  "NVMe stands for Non‑Volatile Memory Express.",
  'Air coolers were invented before liquid cooling—who knew?',
  'PCIe 5.0 can hit 32 GT/s per lane!',
  "A single ATX 24‑pin spec is from 2003.",
];

export default function RandomFactFallback() {
  const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-80 rounded-lg bg-muted p-6 text-center shadow">
        <p className="mb-2 text-sm text-muted-foreground animate-pulse">
          Loading …
        </p>
        <p className="text-sm italic">“{fact}”</p>
      </div>
    </div>
  );
}
