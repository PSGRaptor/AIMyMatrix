import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
    // (you can wire up a real theme toggle later)
    const [dark, setDark] = React.useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    return (
        <header className="w-full bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
            <h1 className="text-2xl font-semibold">AIMyMatrix</h1>
            <button
                aria-label="Toggle theme"
                onClick={() => setDark((d) => !d)}
                className="p-1 rounded hover:bg-indigo-500 transition-colors"
            >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
}