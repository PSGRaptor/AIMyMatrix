import React from 'react';
import Sidebar from '@/Sidebar';
import LogConsole from '@/LogConsole';

export default function App() {
    return (
        <div className="flex h-full w-full">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <LogConsole />
            </main>
        </div>
    );
}