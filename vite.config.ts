import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';

export default defineConfig({
    /** ① Tell Vite where index.html lives */
    root: path.resolve(__dirname, 'app'),

    plugins: [react()],

    /** ② Path alias so '@/...' resolves to the renderer folder */
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'app/src/renderer')
        }
    }
});
