// ----------------------------------------------
// Electron main‑process entry point
// File: app/src/main/main.ts
// ----------------------------------------------

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { PlatformManager } from './platformManager';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window tied to our React front‑end
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'AIMyMatrix',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // context‑isolated bridge
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173'); // Vite dev server
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();
  PlatformManager.init(ipcMain); // wire IPC handlers
});

// Quit when all windows are closed – except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});