import React, { useState, useCallback } from 'react';
import Header from '@/Header';
import Sidebar from '@/Sidebar';
import LogConsole from '@/LogConsole';
import SettingsDrawer from '@/SettingsDrawer';
import PlatformCard from '@/PlatformCard';
import { api } from '@/bridge';
import { usePlatformStore } from './store';
import type { PlatformItem } from '@common/ipcTypes';

export default function App() {
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const platforms = usePlatformStore((s) => s.platforms);
    const toggleRunning = usePlatformStore((s) => s.toggleRunning);
    const loadDescriptors = usePlatformStore((s) => s.loadDescriptors);

    const handleSettingsClose = useCallback(() => {
        setSettingsOpen(false);
        loadDescriptors();
    }, [loadDescriptors]);

    return (
        <div className="flex flex-col h-full">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar stays narrow and only has nav/settings */}
                <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

                {/* Main content: grid of cards */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {platforms.map((p: PlatformItem) => (
                            <PlatformCard
                                key={p.name}
                                {...p}
                                onClick={() => {
                                    api.invoke(
                                        p.running ? 'platform:stop' : 'platform:start',
                                        p.name
                                    );
                                    toggleRunning(p.name);
                                }}
                                onUpdate={() => api.invoke('descriptor:update', p.name)}
                            />
                        ))}
                    </div>
                </main>

                <aside className="w-96 border-l h-full">
                    <LogConsole />
                </aside>
            </div>

            <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={handleSettingsClose}
            />
        </div>
    );
}