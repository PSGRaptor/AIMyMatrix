import React from 'react';
import { usePlatformStore } from './store';
import { Cog } from 'lucide-react';

interface SidebarProps {
    onOpenSettings: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
    const platforms = usePlatformStore((s) => s.platforms);

    return (
        <aside className="flex flex-col w-16 bg-white dark:bg-gray-800 border-r p-2 gap-2">
            {platforms.map((p) => (
                <button
                    key={p.name}
                    title={p.name}
                    className="w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <img src={p.icon} alt={p.name} className="w-8 h-8 object-cover" />
                </button>
            ))}
            <button
                className="mt-auto w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={onOpenSettings}
                title="Settings"
            >
                <Cog size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
        </aside>
    );
}
