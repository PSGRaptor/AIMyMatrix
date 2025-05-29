// --------------------------------------------------------------------
// App.tsx  –  root layout: Sidebar, Main content, LogConsole, SettingsDrawer
// Path: app/src/renderer/App.tsx
// --------------------------------------------------------------------
import React, { useState } from 'react';
import Sidebar from '@/Sidebar';
import LogConsole from '@/LogConsole';
import SettingsDrawer from '@/SettingsDrawer';

export default function App() {
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left: navigation */}
            <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

            {/* Center: main content area */}
            <main className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Select a tool from the sidebar to begin.</p>
                </div>
            </main>

            {/* Right: log console */}
            <div className="w-96 border-l h-full">
                <LogConsole />
            </div>

            {/* Settings drawer overlay */}
            <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    );
}