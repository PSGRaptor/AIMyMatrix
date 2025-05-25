// --------------------------------------------------
// Context‑isolated preload – exposes a tiny IPC API
// File: app/src/main/preload.cjs
// --------------------------------------------------
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => {
        ipcRenderer.on(channel, (_event, ...data) => listener(...data));
    }
});