import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { PlatformItem } from '@common/ipcTypes';

interface PlatformCardProps extends PlatformItem {
    onClick: () => void;
    onUpdate: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function isValidIcon(icon: string) {
    return typeof icon === 'string' && icon.startsWith('data:image/');
}

export default function PlatformCard({
                                         name,
                                         icon,
                                         description,
                                         running,
                                         onClick,
                                         onUpdate,
                                         onEdit,
                                         onDelete,
                                     }: PlatformCardProps) {
    return (
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl transition-shadow duration-200 flex flex-col relative border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
            <div className="absolute top-3 right-3 flex gap-1">
                <button
                    onClick={onEdit}
                    className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-700 transition"
                    title="Edit"
                >
                    <Pencil size={18} className="text-indigo-600 dark:text-indigo-300" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-700 transition"
                    title="Delete"
                >
                    <Trash2 size={18} className="text-red-500 dark:text-red-300" />
                </button>
            </div>
            <div className="flex items-start p-4">
                {isValidIcon(icon) ? (
                    <img
                        src={icon}
                        alt={`${name} logo`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-3xl text-gray-400">
                        <span>🖼️</span>
                    </div>
                )}
                <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {description || 'No description provided.'}
                    </p>
                </div>
            </div>
            <div className="mt-auto px-4 pb-4 flex items-center justify-between">
                <button
                    onClick={onClick}
                    className={`px-4 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                        running
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                    }`}
                >
                    {running ? 'Stop' : 'Start'}
                </button>
                <button
                    onClick={onUpdate}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                    Update
                </button>
            </div>
        </div>
    );
}
