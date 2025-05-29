// --------------------------------------------------------------------
// Sidebar.tsx  –  lists tools + Settings button
// Path: app/src/renderer/Sidebar.tsx
// --------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import PlatformCard from '@/PlatformCard';
import { api } from '@/bridge';

interface PlatformItem {
  name: string;
  icon: string;
  running: boolean;
}

interface SidebarProps {
  onOpenSettings: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);

  // Fetch the list of descriptors
  useEffect(() => {
    api
        .invoke('descriptor:list')
        .then((list: PlatformItem[] | undefined) => {
          if (Array.isArray(list)) {
            setPlatforms(list.map((p) => ({ ...p, running: false })));
          }
        })
        .catch((err) => console.error('descriptor:list failed', err));
  }, []);

  const toggle = (p: PlatformItem) => {
    api.invoke(p.running ? 'platform:stop' : 'platform:start', p.name);
    setPlatforms((prev) =>
        prev.map((x) =>
            x.name === p.name ? { ...x, running: !x.running } : x
        )
    );
  };

  return (
      <aside className="flex flex-col w-56 border-r h-full p-2 gap-2 bg-white dark:bg-gray-800">
        {platforms.map((p) => (
            <PlatformCard
                key={p.name}
                {...p}
                onClick={() => toggle(p)}
            />
        ))}

        {/* Settings button at bottom */}
        <button
            className="mt-auto px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={onOpenSettings}
        >
          Settings
        </button>
      </aside>
  );
}