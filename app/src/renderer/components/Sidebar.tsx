// ----------------------------------------------
// Sidebar lists all platform cards & start/stop
// File: app/src/renderer/components/Sidebar.tsx
// ----------------------------------------------
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlatformItem {
  name: string;
  icon: string;
  running: boolean;
}

export default function Sidebar() {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);

  useEffect(() => {
    // Fetch list of descriptors from main‑process via preload bridge
    window.api.invoke('descriptor:list').then((list: PlatformItem[]) => {
      setPlatforms(list);
    });
  }, []);

  const handleToggle = (p: PlatformItem) => {
    window.api.invoke(p.running ? 'platform:stop' : 'platform:start', p.name);
    setPlatforms(ps =>
        ps.map(x => (x.name === p.name ? { ...x, running: !x.running } : x))
    );
  };

  return (
      <aside className="flex flex-col w-56 border-r h-full p-2 gap-2 bg-background/80 backdrop-blur">
        {platforms.map(p => (
            <Button
                key={p.name}
                variant={p.running ? 'default' : 'ghost'}
                className={cn('justify-start gap-2', p.running && 'font-bold')}
                onClick={() => handleToggle(p)}
            >
              <img src={`./icons/${p.icon}`} alt="" className="w-5 h-5" />
              {p.name}
            </Button>
        ))}
      </aside>
  );
}