// seedCpuBenchmarks.ts

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import csv from "csvtojson";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const supabase = createClient(
    process.env.SUPA_URL!,
    process.env.SUPA_SERVICE_KEY!
);

// ——— Types ————————————————————————————————————————————————————————
type GeekRow = { name: string; score: number; multicore_score: number };
type CineModernRow = {
    id: string;
    cinebench_r23_single: number;
    cinebench_r23_multi:  number;
    cinebench_r24_single: number;
    cinebench_r24_multi:  number;
};

// ——— Helpers ————————————————————————————————————————————————————————

// Parse raw Geekbench JSON (array, {.devices}, comma‑separated, or NDJSON)
function parseGeekbench(raw: string): GeekRow[] {
    const t = raw.trim();
    try {
        const j = JSON.parse(t);
        if (Array.isArray(j)) return j;
        if (j && typeof j === "object" && Array.isArray((j as any).devices))
            return (j as any).devices;
        return Object.values(j).flatMap(v => (Array.isArray(v) ? v : []));
    } catch {}
    try { return JSON.parse(`[${t.replace(/,\s*$/, "")}]`); } catch {}
    return t
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => JSON.parse(l));
}

// Turn "Intel Core i5‑13600K" → "cpu_i5_13600k"
function toPartId(model: string): string {
    return (
        model
            .toLowerCase()
            .replace(/\b(intel|amd|core|ryzen|processor|cpu)\b/gi, "")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
    ).replace(/^/, "cpu_");
}

// ——— Main ————————————————————————————————————————————————————————

async function seed() {
    try {
        // 1) Load your 12 CPU parts
        const { data: partsData, error: partsError } = await supabase
            .from("parts")
            .select("id,brand,model")
            .eq("category", "cpu");
        if (partsError) throw partsError;

        // Build lookup for exact matches
        const lookup = new Map<string,string>();
        partsData!.forEach(p => {
            lookup.set(p.model, p.id);
            lookup.set(`${p.brand} ${p.model}`, p.id);
        });

        // 2) Seed Geekbench (same as before)
        const geekRaw  = await fs.readFile(
            path.resolve(__dirname, "../data/geekbench-benchmarks.json"),
            "utf8"
        );
        const geekRows = parseGeekbench(geekRaw);

        console.log(`Seeding Geekbench (${geekRows.length} rows)…`);
        for (const row of geekRows) {
            // try exact lookup then fallback to slug
            const partId =
                lookup.get(row.name) ??
                lookup.get(row.name.replace(/^Intel |^AMD /, "")) ??
                toPartId(row.name);
            if (!lookup.has(row.name) && !lookup.has(row.name.replace(/^Intel |^AMD /, ""))) {
                continue; // skip anything not in your parts
            }
            await supabase.from("cpu_benchmarks").upsert(
                {
                    part_id:           partId,
                    geekbench6_single: row.score,
                    geekbench6_multi:  row.multicore_score,
                },
                { onConflict: "part_id" }
            );
        }

        // 3) Seed Cinebench R23+R24 from our new JSON
        const cineRaw = await fs.readFile(
            path.resolve(__dirname, "../data/cinebench-modern.json"),
            "utf8"
        );
        const cineRows = JSON.parse(cineRaw) as CineModernRow[];

        console.log(`Seeding Cinebench (R23+R24) for ${cineRows.length} CPUs…`);
        for (const row of cineRows) {
            // skip any id not in your parts
            if (!partsData!.some(p => p.id === row.id)) {
                console.warn(`⚠️  Skipping unknown part_id ${row.id}`);
                continue;
            }
            await supabase.from("cpu_benchmarks").upsert(
                {
                    part_id:              row.id,
                    cinebench_r23_single: row.cinebench_r23_single,
                    cinebench_r23_multi:  row.cinebench_r23_multi,
                    cinebench_r24_single: row.cinebench_r24_single,
                    cinebench_r24_multi:  row.cinebench_r24_multi,
                },
                { onConflict: "part_id" }
            );
        }

        console.log("✅ Seeding complete.");
    } catch (err) {
        console.error("💥 Seeding failed:", err);
        process.exit(1);
    }
}

seed();
