// --------------------------------------------------------------------
// store.ts — Zustand store for platform descriptors
// Path: app/src/renderer/store.ts
// --------------------------------------------------------------------
import { create } from 'zustand';
import { api } from '@/bridge';
import type { PlatformDescriptor, PlatformItem } from '@common/ipcTypes';

interface State {
    platforms: PlatformItem[];
    loadDescriptors: () => void;
    toggleRunning: (name: string) => void;
}

export const usePlatformStore = create<State>((set) => ({
    platforms: [],

    loadDescriptors: (): void => {
        api
            .invoke<PlatformDescriptor[]>('descriptor:list')
            .then((list) => {
                if (Array.isArray(list)) {
                    const items: PlatformItem[] = list.map((p) => ({
                        ...p,
                        running: false,
                    }));
                    set({ platforms: items });
                }
            })
            .catch((err: unknown) => {
                console.error('Failed to load descriptors', err);
            });
    },

    toggleRunning: (name: string): void => {
        set((state) => ({
            platforms: state.platforms.map((p) =>
                p.name === name ? { ...p, running: !p.running } : p
            ),
        }));
    },
}));