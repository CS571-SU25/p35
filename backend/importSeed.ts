// backend/importSeed.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

// ─── ESM __dirname shim ─────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ─── 1. paths & helpers ───────────────────────────────────────────────
const DATA_DIR  = resolve(__dirname, "../data");
const JSON_FILE = join(DATA_DIR, "modern_parts.json");

async function loadParts(): Promise<unknown[]> {
    const raw = await readFile(JSON_FILE, "utf8");
    return JSON.parse(raw);
}

// ─── 2. Supabase connection ───────────────────────────────────────────
const supabase = createClient(
    process.env.SUPA_URL!,
    process.env.SUPA_SERVICE_KEY!
);

// ─── 3. upsert logic ─────────────────────────────────────────────────
;(async function main() {
    try {
        const parts = await loadParts();
        console.log(`⏫  Importing ${parts.length} rows…`);

        const { error, count } = await supabase
            .from("parts")
            .upsert(parts, {
                onConflict: "category,brand,model",   // ← 3-column target
                count: "exact",
            });

        if (error) {
            throw new Error(`Upsert error: ${error.message}`);
        }

        console.log(`✅  Upserted ${count ?? 0} rows`);
        process.exit(0);
    } catch (err) {
        console.error("❌ importSeed failed:", err);
        process.exit(1);
    }
})();
