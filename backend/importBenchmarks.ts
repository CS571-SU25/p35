#!/usr/bin/env -S ts-node --esm
/*  backend/tools/genBenchSkeleton.ts
    Generates ../data/gpu-benchmarks-skeleton.json
    ───────────────────────────────────────────── */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve }            from "node:path";
import { fileURLToPath }               from "node:url";

/* --- where is /data ? (root-level) -------------------------------------- */
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = resolve(__dirname, "..", "..", "data");   // ../../data

/* --- benchmark matrix --------------------------------------------------- */
const TIERS = [
    {
        tier : "RT GPU crushers",
        games: [
            { game: "Cyberpunk 2077", graphics: "RT Overdrive" },
            { game: "Alan Wake 2",    graphics: "RT Ultra"     },
        ],
    },
    {
        tier : "AAA raster",
        games: [
            { game: "Starfield",       graphics: "Ultra" },
            { game: "Baldur's Gate 3", graphics: "Ultra" },
            { game: "Hogwarts Legacy", graphics: "Ultra" },
        ],
    },
    {
        tier : "e-sports",
        games: [
            { game: "Fortnite",         graphics: "Epic + TSR" },
            { game: "Valorant",         graphics: "Max"        },
            { game: "Counter-Strike 2", graphics: "Max"        },
        ],
    },
    {
        tier : "Simulation / racer",
        games: [{ game: "Forza Horizon 5", graphics: "Extreme" }],
    },
    {
        tier : "Legacy control",
        games: [{ game: "Shadow of the Tomb Raider", graphics: "Highest" }],
    },
] as const;

const RESOS   = ["1080", "1440", "4k"] as const;
const REF_CPU = "cpu_ryzen_7800x3d";        // reference when benchmarking GPUs
const REF_GPU = "gpu_rtx_4090_asus_strix";  // reference when benchmarking CPUs

/* --- helpers ------------------------------------------------------------ */
type PartMeta = { id: string; category: string };
type Row = {
    tier        : string;
    game        : string;
    graphics    : string;
    resolution  : string;
    cpu_id      : string;
    gpu_id      : string;
    upscaler    : "native" | "fsr" | null;
    quality     : "quality" | "balanced" | "performance" | null;
    frame_gen   : boolean;
    avg_fps     : number | null;
    low1_fps    : number | null;
    cpu_ratio   : number | null;   // 0–1   (optional hint)
    source      : string;
};

/** baseline (Native, no FG) + extras for Cyberpunk */
function variantsFor(game: string): Array<Pick<Row,"upscaler"|"quality"|"frame_gen">> {
    if (game === "Cyberpunk 2077") {
        return [
            { upscaler: "native", quality: null,        frame_gen: false }, // baseline
            { upscaler: "fsr",    quality: "quality",   frame_gen: false }, // FSR-Quality
            { upscaler: "native", quality: null,        frame_gen: true  }, // FG on (no DLSS upscaling)
        ];
    }
    /* default: one baseline row */
    return [{ upscaler: "native", quality: null, frame_gen: false }];
}

/** build rows for a single part (GPU or CPU) */
function rowsFor(part: PartMeta): Row[] {
    return TIERS.flatMap(tier =>
        tier.games.flatMap(g =>
            variantsFor(g.game).flatMap(v =>
                RESOS.map<Row>(res => ({
                    tier       : tier.tier,
                    game       : g.game,
                    graphics   : g.graphics,
                    resolution : res,
                    cpu_id     : part.category === "gpu" ? REF_CPU : part.id,
                    gpu_id     : part.category === "gpu" ? part.id : REF_GPU,
                    upscaler   : v.upscaler,
                    quality    : v.quality,
                    frame_gen  : v.frame_gen,
                    avg_fps    : null,
                    low1_fps   : null,
                    cpu_ratio  : null,
                    source     : "",
                })),
            ),
        ),
    );
}

/* --- read modern_parts.json & generate ---------------------------------- */
const parts: PartMeta[] = JSON.parse(
    readFileSync(resolve(DATA_DIR, "modern_parts.json"), "utf8"),
);

const skeleton = parts
    .filter(p => p.category === "gpu" || p.category === "cpu")
    .flatMap(rowsFor);

writeFileSync(
    resolve(DATA_DIR, "gpu-benchmarks-skeleton.json"),
    JSON.stringify(skeleton, null, 2),
);

console.log(`✅  ${skeleton.length} rows written → data/benchmarks-skeleton.json`);
