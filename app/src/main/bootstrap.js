// app/src/main/bootstrap.js
// ──────────────────────────────────────
// Compile every .ts file on-the-fly with
// explicit CJS options, then run main.ts
// ──────────────────────────────────────
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
        module: 'CommonJS',
        moduleResolution: 'node',
        target: 'ES2020',
    },
});
require('./main.ts');