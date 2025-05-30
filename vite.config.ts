import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
    // ① Serve from app/ instead of project root
    root: path.resolve(__dirname, 'app'),
    // ② Output dist to the project-root/dist (so Electron can load it)
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
    },
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'app/src/renderer'),
            '@common': path.resolve(__dirname, 'app/src/common'),
        },
    },
    server: {
        // set this if you want a custom port; default 5173 is fine
        port: 5173,
    },
});
