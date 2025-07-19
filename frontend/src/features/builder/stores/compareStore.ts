import { create } from "zustand";
import type { Part } from "@/lib/types";

interface CompareState {
  picks: Part[];
  toggle: (p: Part) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  picks: [],
  toggle: (p) =>
    set((s) => {
      const exists = s.picks.find((x) => x.id === p.id);
      if (exists) return { picks: s.picks.filter((x) => x.id !== p.id) };
      if (s.picks.length === 3) return s; // limit 3
      return { picks: [...s.picks, p] };
    }),
  clear: () => set({ picks: [] }),
}));
