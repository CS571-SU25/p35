import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Part } from "@/features/builder/components/PartCard";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type Category =
  | "cpu" | "gpu" | "mobo" | "memory" | "storage"
  | "cooler" | "case" | "psu" | "accessories";

type SelectedMap = Partial<Record<Category, Part>>;

interface BuildSnapshot {
  id   : string;        // uuid
  name : string;
  date : string;        // ISO string
  data : {
    selected         : SelectedMap;
    budgetTarget     : number | null;
    performanceTarget: number | null;
  };
}

interface BuildState {
  /* live build */
  selected         : SelectedMap;
  budgetTarget     : number | null;
  performanceTarget: number | null;

  /* compare tray */
  compare          : Part[];

  /* saved builds */
  builds           : BuildSnapshot[];

  /* ---------- actions ---------- */
  setPart            : (c: Category, p: Part) => void;
  resetCurrent       : () => void;
  saveCurrent        : (name?: string) => void;
  loadBuild          : (id: string) => void;
  deleteBuild        : (id: string) => void;

  setBudgetTarget    : (v: number) => void;
  setPerformanceTarget:(v: number) => void;
  toggleCompare      : (p: Part) => void;
}

/* -------------------------------------------------------------------------- */
/*  Implementation                                                            */
/* -------------------------------------------------------------------------- */

export const useBuildStore = create<BuildState>()(
  devtools(
    persist(
      (set) => ({
        /* --------------- state --------------- */
        selected         : {},
        budgetTarget     : null,
        performanceTarget: null,
        compare          : [],
        builds           : [],

        /* --------------- live actions -------- */
        setPart: (cat, part) =>
          set(
            s => ({ selected: { ...s.selected, [cat]: part } }),
            false,
            { type: "setPart", cat, id: part.id }
          ),

        resetCurrent: () =>
          set(
            { selected: {}, budgetTarget: null, performanceTarget: null, compare: [] },
            false,
            { type: "resetCurrent" }
          ),

        /* --------------- build manager ------- */
        saveCurrent: (name = "Untitled build") =>
          set(s => {
            const snap: BuildSnapshot = {
              id  : crypto.randomUUID(),
              name: name.trim() || "Untitled build",
              date: new Date().toISOString(),
              data: {
                selected         : s.selected,
                budgetTarget     : s.budgetTarget,
                performanceTarget: s.performanceTarget,
              },
            };
            return { builds: [...s.builds, snap] };
          }, false, { type: "saveCurrent" }),

        loadBuild: id =>
          set(s => {
            const b = s.builds.find(x => x.id === id);
            return b ? { ...b.data, compare: [] } : {};
          }, false, { type: "loadBuild", id }),

        deleteBuild: id =>
          set(
            s => ({ builds: s.builds.filter(b => b.id !== id) }),
            false,
            { type: "deleteBuild", id }
          ),

        /* --------------- misc ---------------- */
        setBudgetTarget    : v => set({ budgetTarget: v }, false, { type: "setBudgetTarget" }),
        setPerformanceTarget: v => set({ performanceTarget: v }, false, { type: "setPerformanceTarget" }),

        toggleCompare: p =>
          set(
            s => {
              const exists = s.compare.some(x => x.id === p.id);
              return {
                compare: exists ? s.compare.filter(x => x.id !== p.id) : [...s.compare, p],
              };
            },
            false,
            { type: "toggleCompare", id: p.id }
          ),
      }),
      { name: "pc-builder-store" }
    )
  )
);
