import { useEffect } from "react";

/**
 * Quick helper for binding global hot-keys.
 * ─────────────────────────────────────────
 * useHotkeys([ ["ctrl+s","meta+s"], cb ])
 */
type Combo = string | string[];
type Handler = () => void;

export default function useHotkeys(combos: [Combo, Handler][]) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const pressed = `${e.ctrlKey ? "ctrl+" : ""}${e.metaKey ? "meta+" : ""}${e.key.toLowerCase()}`;
      for (const [combo, fn] of combos) {
        const list = Array.isArray(combo) ? combo : [combo];
        if (list.includes(pressed)) {
          e.preventDefault();
          fn();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combos]);
}
