type IpcBridge = {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
    on: (channel: string, listener: (...a: unknown[]) => void) => void;
};

// Real bridge in Electron, no-op stub in browser
export const api: IpcBridge =
    (window as any).api ?? {
        invoke: async () => {
            console.warn('[ipc-stub] invoke called outside Electron');
            return undefined;
        },
        on: () => {
            console.warn('[ipc-stub] on called outside Electron');
        },
    };