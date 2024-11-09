import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  toggleSize: () => ipcRenderer.send("toggle-size"),
});
