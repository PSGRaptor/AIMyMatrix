import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
    root: path.resolve(__dirname, 'app'),
    publicDir: path.resolve(__dirname, 'app/public'),
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
        port: 5173,
    },
});