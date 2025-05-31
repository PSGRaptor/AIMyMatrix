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
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [command, setCommand] = useState('');
    const [cwd, setCwd] = useState('');
    const [description, setDescription] = useState('');
    const [updateMethod, setUpdateMethod] = useState('');
    const loadDescriptors = usePlatformStore((state) => state.loadDescriptors);

    if (!isOpen) return null;

    // Browse for icon file
    const browseIcon = async (): Promise<void> => {
        const filePath = await api.invoke('dialog:openFile', { type: 'image' });
        if (filePath) setIcon(filePath);
    };

    // Browse for working directory
    const browseDirectory = async (): Promise<void> => {
        const dirPath = await api.invoke('dialog:openFile', { type: 'dir' });
        if (dirPath) setCwd(dirPath);
    };

    // Browse for command (.bat, .cmd, .exe, .sh, etc.)
    const browseCommand = async (): Promise<void> => {
        const filePath = await api.invoke('dialog:openFile', { type: 'bat' });
        if (filePath) {
            setCommand(filePath);
            // Set working directory as directory containing the file
            setCwd(filePath.replace(/[/\\][^/\\]+$/, ''));
        }
    };

    // Browse for update script
    const browseUpdateMethod = async (): Promise<void> => {
        const filePath = await api.invoke('dialog:openFile', { type: 'bat' });
        if (filePath) setUpdateMethod(filePath);
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            await api.invoke('descriptor:add', desc);
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
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Add New Tool
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Name
                        <input
                            required
                            className="mt-1 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Icon (emoji or file URL)
                        <div className="flex">
                            <input
                                className="flex-1 mt-1 p-2 border rounded-l text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                placeholder="Emoji or file path"
                            />
                            <button
                                type="button"
                                className="px-3 bg-gray-200 dark:bg-gray-700 border rounded-r text-gray-700 dark:text-gray-200"
                                onClick={browseIcon}
                            >
                                Browse
                            </button>
                        </div>
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Working Directory
                        <div className="flex">
                            <input
                                required
                                className="flex-1 mt-1 p-2 border rounded-l text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                value={cwd}
                                onChange={(e) => setCwd(e.target.value)}
                                placeholder="Working directory"
                            />
                            <button
                                type="button"
                                className="px-3 bg-gray-200 dark:bg-gray-700 border rounded-r text-gray-700 dark:text-gray-200"
                                onClick={browseDirectory}
                            >
                                Browse
                            </button>
                        </div>
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Command (bat/cmd/exe/sh)
                        <div className="flex">
                            <input
                                required
                                className="flex-1 mt-1 p-2 border rounded-l text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                placeholder="Launch script or file"
                            />
                            <button
                                type="button"
                                className="px-3 bg-gray-200 dark:bg-gray-700 border rounded-r text-gray-700 dark:text-gray-200"
                                onClick={browseCommand}
                            >
                                Browse
                            </button>
                        </div>
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Description
                        <textarea
                            className="mt-1 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                        Update method (URL or script)
                        <div className="flex">
                            <input
                                className="flex-1 mt-1 p-2 border rounded-l text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                value={updateMethod}
                                onChange={(e) => setUpdateMethod(e.target.value)}
                                placeholder="Script or URL"
                            />
                            <button
                                type="button"
                                className="px-3 bg-gray-200 dark:bg-gray-700 border rounded-r text-gray-700 dark:text-gray-200"
                                onClick={browseUpdateMethod}
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
