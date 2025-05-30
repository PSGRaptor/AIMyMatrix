import React from 'react';
import type { PlatformItem } from '@common/ipcTypes';

interface PlatformCardProps extends PlatformItem {
    onClick: () => void;
    onUpdate: () => void;
}

export default function PlatformCard({
                                         name,
                                         icon,
                                         description,
                                         running,
                                         onClick,
                                         onUpdate,
                                     }: PlatformCardProps) {
    return (
        <div className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl transition-shadow duration-200 flex flex-col">
            {/* Logo & text */}
            <div className="flex items-start p-4">
                <img
                    src={icon}
                    alt={`${name} logo`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {description || 'No description provided.'}
                    </p>
                </div>
            </div>

            {/* Actions */}
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