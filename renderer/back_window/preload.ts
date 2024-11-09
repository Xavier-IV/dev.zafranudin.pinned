import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  toggleSize: () => ipcRenderer.send("toggle-size"),
  goBack: () => ipcRenderer.send("navigate-back"),
});
