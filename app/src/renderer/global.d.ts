// Augments `window` with the IPC bridge exposed in preload.cjs
interface Window {
    api: {
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
        on: (channel: string, listener: (...args: unknown[]) => void) => void;
    };
}
export {};