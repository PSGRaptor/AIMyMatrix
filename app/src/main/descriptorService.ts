// app/src/main/descriptorService.ts
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import * as path from 'node:path';

export function listDescriptors() {
    const dir = path.resolve(__dirname, 'platforms');

    /* NEW: if folder missing, return empty list instead of throwing */
    if (!existsSync(dir)) {
        console.warn('[descriptorService] platforms folder not found:', dir);
        return [];
    }

    return readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((file) => {
            const raw = readFileSync(path.join(dir, file), 'utf8');
            return JSON.parse(raw);
        });
}
