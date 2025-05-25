// --------------------------------------------------------------
// Centralised process-lifecycle manager for every AI platform
// File: app/src/main/platformManager.ts
// --------------------------------------------------------------

import {
  ipcMain,
  IpcMainInvokeEvent,
  BrowserWindow,
  app
} from 'electron';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface PlatformDescriptor {
  name: string;
  entry: string;
  cwd: string;
  args: string[];
  env: Record<string, string>;
  icon: string;
  gpu: boolean;
}

export class PlatformManager {
  /** Map <platform-name, spawned process> */
  private static processes = new Map<string, ChildProcessWithoutNullStreams>();

  /** reference to the single BrowserWindow so we can stream logs */
  private static mainWindow: BrowserWindow | null = null;

  /** wire IPC handlers – called from main.ts once the window is created */
  static init(ipc: typeof ipcMain, window: BrowserWindow) {
    this.mainWindow = window;

    ipc.handle('platform:start', (_e: IpcMainInvokeEvent, name: string) =>
        this.start(name)
    );
    ipc.handle('platform:stop', (_e, name: string) =>
        this.stop(name)
    );
    ipc.handle('platform:list', () => this.list());
  }

  /** read & parse descriptor JSON for the given platform */
  private static resolveDescriptor(name: string): PlatformDescriptor {
    const descriptorPath = path.resolve(
        app.getAppPath(),          // packaged: …/resources/app.asar
        'platforms',
        `${name}.json`
    );
    return JSON.parse(
        fs.readFileSync(descriptorPath, 'utf-8')
    ) as PlatformDescriptor;
  }

  /** spawn platform if not already running */
  static start(name: string) {
    if (this.processes.has(name))
      throw new Error(`${name} is already running`);

    const desc = this.resolveDescriptor(name);

    const proc = spawn(desc.entry, desc.args, {
      cwd: desc.cwd,
      env: { ...process.env, ...desc.env },
      shell: true
    });

    // forward stdout/stderr to renderer in real time
    proc.stdout.on('data', data =>
        this.mainWindow?.webContents.send('log', name, data.toString())
    );
    proc.stderr.on('data', data =>
        this.mainWindow?.webContents.send('log', name, data.toString())
    );
    proc.on('close', code =>
        this.mainWindow?.webContents.send('platform:exit', name, code)
    );

    this.processes.set(name, proc);
  }

  /** terminate process and clean map */
  static stop(name: string) {
    this.processes.get(name)?.kill('SIGINT');
    this.processes.delete(name);
  }

  /** list currently running platforms */
  static list() {
    return Array.from(this.processes.keys());
  }
}
