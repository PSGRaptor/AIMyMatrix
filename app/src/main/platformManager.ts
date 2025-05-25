// ----------------------------------------------
// Centralised process spawn & life‑cycle manager
// File: app/src/main/platformManager.ts
// ----------------------------------------------

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';

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
  private static processes = new Map<string, ChildProcessWithoutNullStreams>();

  static init(ipc: typeof ipcMain) {
    ipc.handle('platform:start', (_e: IpcMainInvokeEvent, platformName: string) =>
      this.start(platformName)
    );
    ipc.handle('platform:stop', (_e, platformName: string) =>
      this.stop(platformName)
    );
    ipc.handle('platform:list', () => this.list());
  }

  private static resolveDescriptor(platformName: string): PlatformDescriptor {
    const descriptorPath = path.resolve(
      app.getAppPath(),
      'platforms',
      `${platformName}.json`
    );
    return JSON.parse(fs.readFileSync(descriptorPath, 'utf-8')) as PlatformDescriptor;
  }

  static start(platformName: string) {
    if (this.processes.has(platformName))
      throw new Error(`${platformName} is already running`);

    const desc = this.resolveDescriptor(platformName);
    const proc = spawn(desc.entry, desc.args, {
      cwd: desc.cwd,
      env: { ...process.env, ...desc.env },
      shell: true
    });

    // forward stdout/stderr to renderer
    proc.stdout.on('data', data =>
      mainWindow?.webContents.send('log', platformName, data.toString())
    );
    proc.stderr.on('data', data =>
      mainWindow?.webContents.send('log', platformName, data.toString())
    );
    proc.on('close', code =>
      mainWindow?.webContents.send('platform:exit', platformName, code)
    );

    this.processes.set(platformName, proc);
  }

  static stop(platformName: string) {
    this.processes.get(platformName)?.kill('SIGINT');
    this.processes.delete(platformName);
  }

  static list() {
    return Array.from(this.processes.keys());
  }
}