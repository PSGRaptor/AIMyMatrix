// app/src/main/preload.cjs
console.log('[preload] loaded – API exposed');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) =>
        ipcRenderer.on(channel, (_e, ...data) => listener(...data)),
});
