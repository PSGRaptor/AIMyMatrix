declare global {
    interface Window {
        api?: {
            invoke: (...args: any[]) => Promise<any>;
            on: (...args: any[]) => void;
        };
    }
}

export const api =
    window.api || {
        invoke: async () => {},
        on: () => {},
    };
