import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    // ① Serve from the `app/` directory
    root: path.resolve(__dirname, 'app'),

    // ② Static assets like icons
    publicDir: path.resolve(__dirname, 'app/public'),

    // ③ Build output at project root /dist
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
