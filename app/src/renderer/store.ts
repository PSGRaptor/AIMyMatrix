import { create } from 'zustand';
import { api } from '@/bridge';
import type { PlatformItem } from '@common/ipcTypes';

interface PlatformStore {
    platforms: PlatformItem[];
    loadDescriptors: () => Promise<void>;
    toggleRunning: (name: string) => void;
    deletePlatform: (name: string) => void;
    // ...add any other actions you need
}

export const usePlatformStore = create<PlatformStore>((set, get) => ({
    platforms: [],

    // Load platforms from backend
    loadDescriptors: async () => {
        const list = await api.invoke('descriptor:list');
        set({ platforms: list ?? [] });
    },

    // Toggle running state in UI only (could be improved to persist)
    toggleRunning: (name) =>
        set((state) => ({
            platforms: state.platforms.map((p) =>
                p.name === name ? { ...p, running: !p.running } : p
            ),
        })),

    // Delete a platform from the UI and (optionally) from backend
    deletePlatform: (name) => {
        // Remove from local state
        set((state) => ({
            platforms: state.platforms.filter((p) => p.name !== name),
        }));

        // Optionally, notify backend to delete the platform's config file:
        api.invoke('descriptor:delete', name);
    },
}));
