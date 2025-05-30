// --------------------------------------------------------------------
// SettingsDrawer.tsx — add new tool via form
// Path: app/src/renderer/SettingsDrawer.tsx
// --------------------------------------------------------------------
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/bridge';
import { usePlatformStore } from './store';
import type { PlatformDescriptor } from '@common/ipcTypes';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsDrawer({
                                           isOpen,
                                           onClose,
                                       }: SettingsDrawerProps) {
    const [name, setName] = useState<string>('');
    const [icon, setIcon] = useState<string>('');
    const [command, setCommand] = useState<string>('');
    const [cwd, setCwd] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [updateMethod, setUpdateMethod] = useState<string>('');
    const loadDescriptors = usePlatformStore((state) => state.loadDescriptors);

    if (!isOpen) return null;

    const browseFile = async (): Promise<void> => {
        const filePath = await api.invoke<string | null>('dialog:openFile');
        if (filePath) {
            setCommand(filePath);
            setCwd(filePath.replace(/[/\\][^/\\]+$/, ''));
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const desc: PlatformDescriptor = {
            name,
            icon,
            command,
            cwd,
            description,
            updateMethod,
        };
        try {
            await api.invoke<PlatformDescriptor[]>('descriptor:add', desc);
            loadDescriptors();
            onClose();
        } catch (err) {
            console.error('Failed to add descriptor', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className="relative ml-auto w-80 h-full bg-white dark:bg-gray-900 shadow-lg p-4 overflow-auto">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Add New Tool
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {[
                        { label: 'Name', value: name, setter: setName, required: true },
                        { label: 'Icon (emoji or URL)', value: icon, setter: setIcon },
                        { label: 'Working Directory', value: cwd, setter: setCwd, required: true },
                        { label: 'Description', value: description, setter: setDescription },
                        { label: 'Update method (URL or script)', value: updateMethod, setter: setUpdateMethod },
                    ].map(({ label, value, setter, required }) => (
                        <label
                            key={label}
                            className="flex flex-col text-sm text-gray-700 dark:text-gray-300"
                        >
                            {label}
                            {label === 'Description' ? (
                                <textarea
                                    className="mt-1 p-2 border rounded"
                                    rows={2}
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                />
                            ) : (
                                <input
                                    required={required}
                                    className="mt-1 p-2 border rounded"
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                />
                            )}
                        </label>
                    ))}
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Command (bat file)
                        <div className="flex">
                            <input
                                required
                                className="flex-1 mt-1 p-2 border rounded-l"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                            />
                            <button
                                type="button"
                                className="px-3 bg-gray-200 dark:bg-gray-700 border rounded-r"
                                onClick={browseFile}
                            >
                                Browse
                            </button>
                        </div>
                    </label>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add Tool
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}