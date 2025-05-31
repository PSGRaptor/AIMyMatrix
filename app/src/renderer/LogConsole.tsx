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
        // Optional: return a cleanup function to remove listener if you re-mount
        // return () => { /* remove listener code if needed */ };
    }, []);

    return (
        <div className="p-4 h-full overflow-auto bg-gray-100 dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-gray-100 rounded">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Console</h2>
            <div className="space-y-1">
                {logs.length === 0 ? (
                    <div className="text-gray-400 dark:text-gray-500">No logs yet.</div>
                ) : (
                    logs.map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap break-all">
                            {line}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
