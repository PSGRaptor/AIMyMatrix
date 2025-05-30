// --------------------------------------------------------------------
// LogConsole.tsx — streams logs from main-process
// Path: app/src/renderer/LogConsole.tsx
// --------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { api } from '@/bridge';

export default function LogConsole() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        api.on('log', (...args: any[]) => {
            // args[0] = platform name, args[1] = chunk (Buffer|string)
            const name = String(args[0] ?? '');
            const raw = args[1];
            const chunk = raw != null ? raw.toString() : '';
            const line = `[${name}] ${chunk.trim()}`;
            setLogs((prev) => [...prev, line]);
        });
    }, []);

    return (
        <div className="p-2 h-full overflow-auto bg-gray-100 dark:bg-gray-800 text-xs font-mono">
            {logs.map((line, idx) => (
                <div key={idx}>{line}</div>
            ))}
        </div>
    );
}