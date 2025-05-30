// --------------------------------------------------------------------
// ipcTypes.ts – shared types between main & renderer
// Path: app/src/common/ipcTypes.ts
// --------------------------------------------------------------------
export interface PlatformDescriptor {
    name: string;
    icon: string;
    command?: string;
    cwd?: string;
    description?: string;
    updateMethod?: string;
}

export interface PlatformItem extends PlatformDescriptor {
    running: boolean;
}
