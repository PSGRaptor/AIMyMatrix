// --------------------------------------------------------------------
// Sidebar.tsx — navigates platforms + opens Settings
// Path: app/src/renderer/Sidebar.tsx
// --------------------------------------------------------------------
import React, { useEffect } from 'react';
import { api } from '@/bridge';
import PlatformCard from '@/PlatformCard';
import { usePlatformStore } from './store';
import type { PlatformItem } from '@common/ipcTypes';

interface SidebarProps {
    onOpenSettings: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
    const platforms = usePlatformStore((state) => state.platforms);
    const loadDescriptors = usePlatformStore((state) => state.loadDescriptors);
    const toggleRunning = usePlatformStore((state) => state.toggleRunning);

    useEffect(() => {
        loadDescriptors();
    }, [loadDescriptors]);

    return (
        <aside className="flex flex-col w-56 border-r h-full p-2 gap-2 bg-white dark:bg-gray-800">
            {platforms.map((platform: PlatformItem) => (
                <PlatformCard
                    key={platform.name}
                    {...platform}
                    onClick={() => {
                        api.invoke(
                            platform.running ? 'platform:stop' : 'platform:start',
                            platform.name
                        );
                        toggleRunning(platform.name);
                    }}
                />
            ))}

            <button
                className="mt-auto px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={onOpenSettings}
            >
                Settings
            </button>
        </aside>
    );
}