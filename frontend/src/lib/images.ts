// src/lib/images.ts
import placeholderUrl from "@/assets/placeholder.png";

const raw = import.meta.glob<string>(
  "/src/assets/**/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
);

const IMG_MAP: Record<string, string> = {};
for (const [absPath, url] of Object.entries(raw)) {
  // /src/assets/cpu/i5_13600k.png -> cpu/i5_13600k.png
  const key = absPath.replace(/^\/src\/assets\//, "");
  IMG_MAP[key] = url;
}

function norm(p: string) {
  return p.replace(/^\.?\/?/, "").replace(/^assets\//, "");
}

export function imageUrl(relPath: string, fallback = placeholderUrl): string {
  const hit = IMG_MAP[norm(relPath)];
  if (!hit && import.meta.env.DEV) console.warn("imageUrl miss:", relPath);
  return hit ?? fallback;
}
