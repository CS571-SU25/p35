#!/usr/bin/env -S ts-node --esm
/*  backend/tools/genCpuBenchSkeleton.ts
    Generates ../data/cpu-gpu-benchmarks-skeleton.json
    ─────────────────────────────────────────────────────────────
    Builds **CPU‑bound** benchmark skeleton rows.  For every CPU
    in modern_parts.json it emits one placeholder row per game,
    using low‑fidelity presets that push the bottleneck onto the
    processor while keeping the RTX 5090 fixed.
*/

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve }            from "node:path";
import { fileURLToPath }               from "node:url";

/* locate the shared /data directory (repo‑root/data) */
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = resolve(__dirname, "..", "..", "data");

/* ─────────────────────────── CPU‑bound presets ──────────────────────────
   graphics  → in‑game fidelity preset (Low, Medium, …)
   quality   → upscaler quality (DLSS/FSR Quality|Balanced|Performance);
               always null here because upscaler = native
*/
const TIERS = [
    {
        tier : "RT GPU crushers",
        games: [
            { game: "Cyberpunk 2077",    graphics: "Low"     },
            { game: "Alan Wake 2",       graphics: "Low"     },
        ],
    },
    {
        tier : "AAA raster",
        games: [
            { game: "Starfield",         graphics: "Low"     },
            { game: "Baldur's Gate 3",   graphics: "Medium"  },
            { game: "Hogwarts Legacy",   graphics: "Low"     },
        ],
    },
    {
        tier : "e-sports",
        games: [
            { game: "Fortnite",          graphics: "Performance" },
            { game: "Valorant",          graphics: "Max"     },
            { game: "Counter-Strike 2",  graphics: "Low"     },
        ],
    },
    {
        tier : "Simulation / racer",
        games: [ { game: "Forza Horizon 5", graphics: "Low" } ],
    },
    {
        tier : "Legacy control",
        games: [ { game: "Shadow of the Tomb Raider", graphics: "Lowest" } ],
    },
] as const;

/* ─────────────────────────── constants ──────────────────────────────── */
const RESOLUTION  = "1080";                // single‑res CPU passes
const TEST_GPU    = "gpu_rtx_5090_fe";     // fixed GPU for all rows
const UPSCALER    = "native";              // no upscaling
const FRAME_GEN   = false;                  // FG off
const SOURCE      = "howmanyfps.com";      // placeholder citation

/* ─────────────────────────── types ─────────────────────────────────── */
type PartMeta = { id: string; category: string };

interface Row {
    tier        : string;
    game        : string;
    graphics    : string | null;                // in‑game preset
    resolution  : string;                       // "1080"
    cpu_id      : string;
    gpu_id      : string;
    upscaler    : "native" | "fsr" | null;    // kind of upscaler
    quality     : "quality" | "balanced" | "performance" | null; // upscaler quality tier
    frame_gen   : boolean;
    avg_fps     : number | null;
    low1_fps    : number | null;
    cpu_ratio   : number | null;
    source      : string;
}

/* build rows for one CPU */
function rowsFor(cpu: PartMeta): Row[] {
    return TIERS.flatMap(tier =>
        tier.games.map<Row>(g => ({
            tier       : tier.tier,
            game       : g.game,
            graphics   : g.graphics,      // ← in‑game preset now stored correctly
            resolution : RESOLUTION,
            cpu_id     : cpu.id,
            gpu_id     : TEST_GPU,
            upscaler   : UPSCALER,        // native → no scaling
            quality    : null,            // no DLSS/FSR quality tier
            frame_gen  : FRAME_GEN,
            avg_fps    : null,
            low1_fps   : null,
            cpu_ratio  : null,
            source     : SOURCE,
        }))
    );
}

/* ───────────────────── read parts & generate rows ────────────────────── */
const parts: PartMeta[] = JSON.parse(
    readFileSync(resolve(DATA_DIR, "modern_parts.json"), "utf8")
);

const skeleton = parts
    .filter(p => p.category === "cpu")
    .flatMap(rowsFor);

writeFileSync(
    resolve(DATA_DIR, "cpu-gpu-benchmarks-skeleton.json"),
    JSON.stringify(skeleton, null, 2)
);

console.log(`✅  ${skeleton.length} rows written → data/cpu-benchmarks-skeleton.json`);
