import React, { useEffect, useState } from 'react';
import PlatformCard from '@/PlatformCard';

interface PlatformItem { name: string; icon: string; running: boolean; }

export default function Sidebar() {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);

  useEffect(() => {
    window.api.invoke('descriptor:list').then((list: PlatformItem[]) => {
      setPlatforms(list.map(p => ({ ...p, running: false })));
    });
  }, []);

  const toggle = (p: PlatformItem) => {
    window.api.invoke(p.running ? 'platform:stop' : 'platform:start', p.name);
    setPlatforms(prev =>
        prev.map(x => (x.name === p.name ? { ...x, running: !x.running } : x))
    );
  };

  return (
      <aside className="flex flex-col w-56 border-r h-full p-2 gap-2 bg-background/80 backdrop-blur">
        {platforms.map(p => (
            <PlatformCard key={p.name} {...p} onClick={() => toggle(p)} />
        ))}
      </aside>
  );
}