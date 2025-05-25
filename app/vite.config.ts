import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';

export default defineConfig({
    root: path.resolve(__dirname, 'app'),   // 👈 key line
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'app/src/renderer')
        }
    }
});
