// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, webFrame } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  toggleSize: () => ipcRenderer.send("toggle-size"),
  goBack: () => ipcRenderer.send("navigate-back"),
});
