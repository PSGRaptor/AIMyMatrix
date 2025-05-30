// --------------------------------------------------------------------
// bridge.ts — renderer → preload bridge
// Path: app/src/renderer/bridge.ts
// --------------------------------------------------------------------
declare global {
    interface Window {
        api: {
            invoke: <T = unknown>(channel: string, ...args: any[]) => Promise<T>;
            on: (channel: string, callback: (...args: any[]) => void) => void;
        };
    }
}

export const api = window.api;