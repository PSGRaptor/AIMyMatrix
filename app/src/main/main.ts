import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { PlatformManager } from './platformManager';
import { listDescriptors, addDescriptor } from './descriptorService';

// Utility for MIME type from file extension
function getMimeType(ext: string) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

// Only ONE handler for 'dialog:pickAndCopyIcon' - returns base64 data URL!
ipcMain.handle('dialog:pickAndCopyIcon', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico'] }],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const source = result.filePaths[0];
  const ext = path.extname(source);
  const mime = getMimeType(ext);
  const fileBuffer = fs.readFileSync(source);
  const base64 = fileBuffer.toString('base64');
  const dataUrl = `data:${mime};base64,${base64}`;
  return dataUrl;
});

// --- Remove all icon folder utility and cleanup logic ---

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
      webSecurity: false, // OK in dev, but remove for production
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
