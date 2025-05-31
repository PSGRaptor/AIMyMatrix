import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { PlatformManager } from './platformManager';
import { listDescriptors, addDescriptor } from './descriptorService';

// Utility: app-level icon directory
function getIconFolder() {
  const folder = path.join(app.getPath('userData'), 'icons');
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

// Only allow icons from our app icon folder
function iconPathFromUserData(iconPath: string) {
  const iconFolder = getIconFolder();
  return iconPath.replace('file://', '').startsWith(iconFolder);
}

// IPC: Pick icon, copy to app folder, return file:// path
ipcMain.handle('dialog:pickAndCopyIcon', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico'] }],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const source = result.filePaths[0];
  const iconFolder = getIconFolder();
  const dest = path.join(iconFolder, path.basename(source));
  fs.copyFileSync(source, dest);
  return `file://${dest.replace(/\\/g, '/')}`;
});

// IPC: Remove copied icon if it exists and is not used by any other card
ipcMain.handle('icon:deleteIfUnused', async (_event, iconUrl, allIcons) => {
  if (
      iconUrl &&
      typeof iconUrl === 'string' &&
      iconUrl.startsWith('file://') &&
      allIcons &&
      Array.isArray(allIcons)
  ) {
    // Only delete if no other platform uses this icon
    const stillUsed = allIcons.filter((i) => i === iconUrl).length > 0;
    if (!stillUsed) {
      const localPath = iconUrl.replace(/^file:\/\//, '');
      try {
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }
  return true;
});

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

ipcMain.handle('descriptor:list', () => listDescriptors());
ipcMain.handle('descriptor:add', (_e, desc) => addDescriptor(desc));
ipcMain.handle('dialog:openFile', async (_event, opts) => {
  let properties: ('openFile' | 'openDirectory')[] = ['openFile'];
  let filters: Electron.FileFilter[] = [];
  if (opts?.type === 'image') filters = [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico'] }];
  if (opts?.type === 'bat') filters = [{ name: 'Batch Files', extensions: ['bat', 'cmd'] }];
  if (opts?.type === 'exe') filters = [{ name: 'Executables', extensions: ['exe'] }];
  if (opts?.type === 'dir') {
    properties = ['openDirectory'];
    filters = [];
  }
  const result = await dialog.showOpenDialog({
    properties,
    filters,
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('descriptor:update', async (_event, updated) => {
  try {
    const descriptorPath = path.join(__dirname, 'platforms', `${updated.name}.json`);
    fs.writeFileSync(descriptorPath, JSON.stringify(updated, null, 2), 'utf8');
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
});

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'AIMyMatrix',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on(
      'did-fail-load',
      (_event, errorCode, errorDescription) => {
        console.error('🛑 did-fail-load:', errorCode, errorDescription);
      }
  );

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'right' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  if (mainWindow) {
    PlatformManager.init(ipcMain, mainWindow);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
