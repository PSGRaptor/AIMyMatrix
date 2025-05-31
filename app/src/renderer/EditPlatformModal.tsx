import React, { useState } from 'react';
import type { PlatformItem } from '@common/ipcTypes';
import { api } from '@/bridge';
import { usePlatformStore } from './store';

interface Props {
    platform: PlatformItem;
    onClose: () => void;
    onSave: (updated: PlatformItem) => void;
    onDelete: () => void;
}

export default function EditPlatformModal({ platform, onClose, onSave, onDelete }: Props) {
    const [name, setName] = useState(platform.name);
    const [description, setDescription] = useState(platform.description || '');
    const [icon, setIcon] = useState(platform.icon || '');
    const [command, setCommand] = useState(platform.command || '');
    const [cwd, setCwd] = useState(platform.cwd || '');
    const [updateMethod, setUpdateMethod] = useState(platform.updateMethod || '');
    const platforms = usePlatformStore((s) => s.platforms);

    // Browse and copy icon file to app's icons directory
    const browseIcon = async () => {
        const iconPath = await api.invoke('dialog:pickAndCopyIcon');
        if (iconPath) setIcon(iconPath);
    };

    const handleDelete = async () => {
        // Remove icon file if no longer used
        await api.invoke('icon:deleteIfUnused', platform.icon, platforms.map((p) => p.icon));
        onDelete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 shadow-2xl relative">
                <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                        onClick={onClose}>✕</button>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Platform</h2>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const updated: PlatformItem = {
                            ...platform,
                            name,
                            description,
                            icon,
                            command,
                            cwd,
                            updateMethod,
                        };
                        onSave(updated);
                    }}
                    className="flex flex-col gap-4"
                >
                    <div>
                        <label className="block text-sm text-gray-900 dark:text-white">Name</label>
                        <input className="w-full rounded border px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                               value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-900 dark:text-white">Description</label>
                        <input className="w-full rounded border px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                               value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-900 dark:text-white">Icon</label>
                        <div className="flex gap-2">
                            <input className="flex-1 rounded border px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                   value={icon}
                                   onChange={e => setIcon(e.target.value)}
                                   placeholder="Icon file path or URL" />
                            <button
                                type="button"
                                className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs text-gray-700 dark:text-gray-200"
                                onClick={browseIcon}
                            >Browse</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-900 dark:text-white">Command (bat/exe/sh)</label>
                        <input className="w-full rounded border px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                               value={command}
                               onChange={e => setCommand(e.target.value)}
                               placeholder="Command or .bat file" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-900 dark:text-white">Working Directory</label>
                        <input className="w-full rounded border px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                               value={cwd}
                               onChange={e => setCwd(e.target.value)}
                               placeholder="Working directory" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-900 dark:text-white">Update Method (script/file)</label>
                        <input className="w-full rounded border px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                               value={updateMethod}
                               onChange={e => setUpdateMethod(e.target.value)}
                               placeholder="Update method" />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button type="button" className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={handleDelete}>Delete</button>
                        <button type="submit" className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
