// --------------------------------------------------------------------
// descriptorService.ts  –  load, validate & add tool descriptors
// Path: app/src/main/descriptorService.ts
// --------------------------------------------------------------------
import {
    readdirSync,
    readFileSync,
    existsSync,
    writeFileSync,
    mkdirSync,
} from 'node:fs';
import * as path from 'node:path';
import { z } from 'zod';

// 1️⃣ schema now includes the new fields
const descriptorSchema = z.object({
    name: z.string(),
    icon: z.string(),
    command: z.string().optional(),
    cwd: z.string().optional(),
    description: z.string().optional(),
    updateMethod: z.string().optional(),
});

export type Descriptor = z.infer<typeof descriptorSchema>;

/** Return all valid JSON descriptors under platforms/ */
export function listDescriptors(): Descriptor[] {
    const dir = path.resolve(__dirname, 'platforms');
    if (!existsSync(dir)) {
        console.warn('[descriptorService] platforms folder not found:', dir);
        return [];
    }

    return readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((file) => {
            const raw = readFileSync(path.join(dir, file), 'utf8');
            try {
                const parsed = JSON.parse(raw);
                return descriptorSchema.parse(parsed);
            } catch (err: any) {
                console.warn(`[descriptorService] invalid descriptor ${file}:`, err);
                return null;
            }
        })
        .filter((d): d is Descriptor => d !== null);
}

/** Add a new descriptor JSON file then return the updated list */
export function addDescriptor(desc: Descriptor): Descriptor[] {
    const dir = path.resolve(__dirname, 'platforms');
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${desc.name}.json`);
    writeFileSync(filePath, JSON.stringify(desc, null, 2), 'utf8');
    return listDescriptors();
}