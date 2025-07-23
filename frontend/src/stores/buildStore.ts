import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Part } from "@/lib/types";

export type Category =
  | "cpu" | "gpu" | "mobo" | "memory" | "storage"
  | "cooler" | "case" | "psu" | "accessories";

type SelectedMap = Partial<Record<Category, Part>>;

/** helpers ----------------------------------------------------------------*/
function emptyCandidates(): Record<Category, Part[]> {
  return {
    cpu: [], gpu: [], mobo: [], memory: [], storage: [],
    cooler: [], case: [], psu: [], accessories: [],
  };
}
function emptyActive(): Record<Category, string | null> {
  return {
    cpu: null, gpu: null, mobo: null, memory: null, storage: null,
    cooler: null, case: null, psu: null, accessories: null,
  };
}

/* -------------------------------------------------------------------------*/
interface BuildSnapshot {
  id   : string;
  name : string;
  date : string;
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

  /** pool of short‑listed parts per category */
  candidates       : Record<Category, Part[]>;
  /** id of the currently active pick per category */
  active           : Record<Category, string | null>;

  /* compare tray */
  compare          : Part[];

  /* saved builds */
  builds           : BuildSnapshot[];

  /* actions */
  setPart       : (c: Category, p: Part) => void;
  addCandidate  : (c: Category, p: Part) => void;
  removeCandidate: (c: Category, id: string) => void;
  setActive     : (c: Category, id: string) => void;
  resetCurrent  : () => void;
  saveCurrent   : (name?: string) => void;
  loadBuild     : (id: string) => void;
  deleteBuild   : (id: string) => void;

  setBudgetTarget    : (v: number) => void;
  setPerformanceTarget: (v: number) => void;
  toggleCompare      : (p: Part) => void;
}

/* -------------------------------------------------------------------------*/
export const useBuildStore = create<BuildState>()(
  devtools(
    persist(
      (set) => ({
        /* --------------- state --------------- */
        selected         : {},
        budgetTarget     : null,
        performanceTarget: null,
        candidates       : emptyCandidates(),
        active           : emptyActive(),
        compare          : [],
        builds           : [],

        /* ------------ live actions ----------- */
        setPart: (cat, part) =>
          set(
            s => ({ selected: { ...s.selected, [cat]: part } }),
            false,
            { type: "setPart", cat, id: part.id }
          ),

        addCandidate: (cat, part) =>
          set(
            s => ({
              candidates: {
                ...s.candidates,
                [cat]: [...s.candidates[cat], part],
              },
            }),
            false,
            { type: "addCandidate", cat, id: part.id }
          ),

        removeCandidate: (cat, id) =>
          set((s) => {
              /* filter out the removed part */
              const nextList = s.candidates[cat].filter((p) => p.id !== id);

              /* if the removed part was active, promote the first remaining one (or null) */
              const nextActiveId =
                s.active[cat] === id ? nextList[0]?.id ?? null : s.active[cat];

              return {
                candidates: { ...s.candidates, [cat]: nextList },
                active:     { ...s.active, [cat]: nextActiveId },
              };
            },
            false,
            { type: "removeCandidate", cat, id }),


        setActive: (cat, id) =>
          set(
            s => ({ active: { ...s.active, [cat]: id } }),
            false,
            { type: "setActive", cat, id }
          ),

        /* --------------- reset --------------- */
        resetCurrent: () =>
          set(
            {
              selected         : {},
              budgetTarget     : null,
              performanceTarget: null,
              compare          : [],
              candidates       : emptyCandidates(),
              active           : emptyActive(),
            },
            false,
            { type: "resetCurrent" }
          ),

        /* ---------- build manager ------------ */
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
            return b ? { ...b.data, compare: [], candidates: emptyCandidates(), active: emptyActive() } : {};
          }, false, { type: "loadBuild", id }),

        deleteBuild: id =>
          set(
            s => ({ builds: s.builds.filter(b => b.id !== id) }),
            false,
            { type: "deleteBuild", id }
          ),

        /* --------------- misc ---------------- */
        setBudgetTarget     : v => set({ budgetTarget: v }, false, { type: "setBudgetTarget" }),
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
)