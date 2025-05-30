// --------------------------------------------------------------------
// main.ts  –  Electron main-process entry point
// Path: app/src/main/main.ts
// --------------------------------------------------------------------
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'node:path';
import { PlatformManager } from './platformManager';
import { listDescriptors, addDescriptor } from './descriptorService';

// ─── 🛑 GPU DISABLED BEFORE READY 🛑 ───────────────────────────────
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
// ────────────────────────────────────────────────────────────────

ipcMain.handle('descriptor:list', () => listDescriptors());
ipcMain.handle('descriptor:add', (_e, desc) => addDescriptor(desc));
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Executable', extensions: ['bat', 'exe', 'cmd', 'sh'] }],
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
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

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  PlatformManager.init(ipcMain, mainWindow!);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});