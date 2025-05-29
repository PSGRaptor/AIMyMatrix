// --------------------------------------------------------------------
// SettingsDrawer.tsx  –  slide-out panel for tool configuration
// Path: app/src/renderer/SettingsDrawer.tsx
// --------------------------------------------------------------------
import React from 'react';
import { X } from 'lucide-react';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsDrawer({
                                           isOpen,
                                           onClose,
                                       }: SettingsDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* drawer */}
            <div className="relative ml-auto w-80 h-full bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col">
                <button
                    className="self-end text-gray-600 hover:text-gray-900 dark:hover:text-white"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Settings
                </h2>

                {/* TODO: settings UI */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure your AI tools here.
                </p>
            </div>
        </div>
    );
}