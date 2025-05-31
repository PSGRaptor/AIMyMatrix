// --------------------------------------------------------------------
// platformManager.ts  –  manage start/stop of tool processes
// Path: app/src/main/platformManager.ts
// --------------------------------------------------------------------
import { IpcMain, BrowserWindow } from 'electron';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { listDescriptors } from './descriptorService';
import * as path from 'node:path';
import * as fs from 'node:fs';

export class PlatformManager {
  // Map from platform name → its spawned ChildProcess
  private static processes = new Map<string, ChildProcessWithoutNullStreams>();

  static init(ipcMain: IpcMain, window: BrowserWindow) {
    ipcMain.handle('platform:start', async (_e, name: string) => {
      const descriptor = listDescriptors().find((d) => d.name === name);
      if (!descriptor) {
        throw new Error(`Descriptor not found for platform "${name}"`);
      }
      if (!descriptor.command) {
        throw new Error(`No "command" defined in descriptor for "${name}"`);
      }

      const cwd = descriptor.cwd ?? process.cwd();
      const cmd = descriptor.command;

      // Always spawn with stdio: 'pipe' to get ChildProcessWithoutNullStreams
      const child: ChildProcessWithoutNullStreams =
          cmd.endsWith('.bat') || cmd.endsWith('.cmd')
              ? spawn('cmd.exe', ['/c', cmd], {
                cwd,
                stdio: ['pipe', 'pipe', 'pipe'],
              })
              : spawn(cmd, [], {
                cwd,
                stdio: ['pipe', 'pipe', 'pipe'],
              });

      this.processes.set(name, child);

      child.stdout.on('data', (chunk: Buffer) => {
        window.webContents.send('log', name, chunk.toString());
      });
      child.stderr.on('data', (chunk: Buffer) => {
        window.webContents.send('log', name, chunk.toString());
      });

      child.on('exit', () => {
        this.processes.delete(name);
        window.webContents.send('platform:stopped', name);
      });

      return true;
    });

    ipcMain.handle('platform:stop', async (_e, name: string) => {
      const child = this.processes.get(name);
      if (!child) {
        return false;
      }
      child.kill();
      return true;
    });

    ipcMain.handle('descriptor:delete', async (_event, name: string) => {
      // Remove the platform config file
      try {
        const descriptorPath = path.join(__dirname, 'platforms', `${name}.json`);
        fs.unlinkSync(descriptorPath);
        return { success: true };
      } catch (e) {
        console.error('Failed to delete platform descriptor:', e);
        return { success: false, error: e };
      }
    });
  }
}
