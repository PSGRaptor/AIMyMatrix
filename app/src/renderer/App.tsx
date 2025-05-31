import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/Header';
import Sidebar from '@/Sidebar';
import LogConsole from '@/LogConsole';
import SettingsDrawer from '@/SettingsDrawer';
import PlatformCard from '@/PlatformCard';
import EditPlatformModal from '@/EditPlatformModal';
import { usePlatformStore } from './store';
import { api } from '@/bridge';
import type { PlatformItem } from '@common/ipcTypes';

export default function App() {
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [editing, setEditing] = useState<PlatformItem | null>(null);
    const platforms = usePlatformStore((s) => s.platforms);
    const toggleRunning = usePlatformStore((s) => s.toggleRunning);
    const loadDescriptors = usePlatformStore((s) => s.loadDescriptors);
    const deletePlatform = usePlatformStore((s) => s.deletePlatform);
    const updatePlatform = usePlatformStore((s) => s.updatePlatform);

    // Load platform cards on app start
    useEffect(() => {
        loadDescriptors();
    }, [loadDescriptors]);

    const handleSettingsClose = useCallback(() => {
        setSettingsOpen(false);
        loadDescriptors();
    }, [loadDescriptors]);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
                {/* Main content: grid of cards */}
                <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                        {platforms.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-20 text-lg">
                                No platforms configured yet. Click the <span className="font-semibold">Settings</span> icon to add a tool.
                            </div>
                        ) : (
                            platforms.map((p: PlatformItem) => (
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
                                    onEdit={() => setEditing(p)}
                                    onDelete={() => deletePlatform(p.name)}
                                />
                            ))
                        )}
                    </div>
                </main>
                <aside className="w-96 border-l h-full bg-white dark:bg-gray-900">
                    <LogConsole />
                </aside>
            </div>
            <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={handleSettingsClose}
            />
            {/* Edit Platform Modal */}
            {editing && (
                <EditPlatformModal
                    platform={editing}
                    onClose={() => setEditing(null)}
                    onSave={async (updated) => {
                        await updatePlatform(updated);
                        setEditing(null);
                        loadDescriptors();
                    }}
                    onDelete={() => {
                        deletePlatform(editing.name);
                        setEditing(null);
                    }}
                />
            )}
        </div>
    );
}
