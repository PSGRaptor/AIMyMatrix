import React, { useEffect, useRef, useState } from 'react';

export default function LogConsole() {
    const [lines, setLines] = useState<string[]>(['AIMyMatrix ‑ ready.']);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const listener = (_name: string, line: string) => {
            setLines(prev => [...prev, line]);
        };
        window.api.on('log', listener);
        return () => {
            // @ts‑ignore electron ipc: removeListener overload typed loosely
            window.api.on('log', listener);
        };
    }, []);

    useEffect(() => {
        ref.current?.scrollTo({ top: ref.current.scrollHeight });
    }, [lines]);

    return (
        <div
            ref={ref}
            className="flex-1 bg-black text-green-400 font-mono text-xs p-2 overflow-y-auto"
        >
            {lines.map((l, i) => (
                <div key={i}>{l}</div>
            ))}
        </div>
    );
}