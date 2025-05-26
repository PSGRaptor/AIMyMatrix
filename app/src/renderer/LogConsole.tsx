// --------------------------------------------------------------------
// LogConsole.tsx  –  streaming stdout/stderr from running platforms
// Path: app/src/renderer/LogConsole.tsx
// --------------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/bridge';

interface LogEntry {
    platform: string;
    line: string;
}

export default function LogConsole() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Append log lines pushed from main-process
    useEffect(() => {
        const handler = (platform: string, line: string) => {
            setLogs((prev) => [...prev, { platform, line }]);

            // Auto-scroll to bottom
            requestAnimationFrame(() => {
                containerRef.current?.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            });
        };

        api.on('log', handler);

        // No detacher needed: ipcRenderer 'on' returns undefined
        // Stub bridge prints warnings only in browser.
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-auto p-3 font-mono text-xs bg-neutral-900 text-green-400"
        >
            {logs.map((l, i) => (
                <pre key={i} className="whitespace-pre-wrap">
          {`[${l.platform}] ${l.line}`}
        </pre>
            ))}
        </div>
    );
}
