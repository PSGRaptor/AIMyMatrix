import { create } from 'zustand';
import { api } from '@/bridge';
import type { PlatformItem } from '@common/ipcTypes';

interface PlatformStore {
    platforms: PlatformItem[];
    loadDescriptors: () => Promise<void>;
    toggleRunning: (name: string) => void;
    deletePlatform: (name: string) => void;
    updatePlatform: (updated: PlatformItem) => Promise<void>;
}

export const usePlatformStore = create<PlatformStore>((set, get) => ({
    platforms: [],
    loadDescriptors: async () => {
        const list = await api.invoke('descriptor:list');
        set({ platforms: list || [] });
    },
    toggleRunning: (name) => {
        set((state) => ({
            platforms: state.platforms.map((p) =>
                p.name === name ? { ...p, running: !p.running } : p
            ),
        }));
    },
    deletePlatform: async (name) => {
        const icon = get().platforms.find((p) => p.name === name)?.icon;
        set((state) => ({
            platforms: state.platforms.filter((p) => p.name !== name),
        }));
        if (icon) {
            // After updating state, pass all remaining icons to the backend for cleanup
            const iconsStillUsed = get().platforms.filter((p) => p.name !== name).map((p) => p.icon);
            await api.invoke('icon:deleteIfUnused', icon, iconsStillUsed);
        }
        await api.invoke('descriptor:delete', name);
    },
    updatePlatform: async (updated) => {
        await api.invoke('descriptor:update', updated);
        get().loadDescriptors();
    },
}));
