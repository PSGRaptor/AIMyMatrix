// ----------------------------------------------
// Electron main-process entry point
// File: app/src/main/main.ts
// ----------------------------------------------

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { PlatformManager } from './platformManager';
import { listDescriptors } from './descriptorService';
ipcMain.handle('descriptor:list', () => listDescriptors());

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'AIMyMatrix',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load renderer
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();            // ⬅ optional: remove in prod
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();
  // ⚠️  Pass BOTH arguments: the ipcMain object and the BrowserWindow
  PlatformManager.init(ipcMain, mainWindow!);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
