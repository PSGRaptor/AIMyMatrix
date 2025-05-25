// --------------------------------------------------
// Returns all platform descriptor JSON files as JS objects
// File: app/src/main/descriptorService.ts
// --------------------------------------------------
import * as fs from 'node:fs';
import * as path from 'node:path';
import { app } from 'electron';

export interface DescriptorSummary { name: string; icon: string; }

export function listDescriptors(): DescriptorSummary[] {
    const dir = path.resolve(app.getAppPath(), 'platforms');
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.json'))
        .map(f => {
            const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
            return { name: p.name, icon: p.icon } as DescriptorSummary;
        });
}