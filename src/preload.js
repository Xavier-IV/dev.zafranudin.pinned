const { contextBridge, ipcRenderer, webFrame } = require("electron");

// Set the zoom factor to 30%
webFrame.setZoomFactor(0.3);

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("app-close"),
  test: () => {
    console.log("received.");
  },
  openURL: (url) => {
    console.log("Received URL:", url); // Debugging line
    if (url) {
      // Pass URL to renderer to set iframe src
      ipcRenderer.send("set-iframe-url", url);
    }
  },
  setIframeURL: (callback) =>
    ipcRenderer.on("update-iframe-url", (event, url) => callback(url)),

  showError: () => {
    const iframe = document.getElementById("preview");
    const errorDiv = document.getElementById("error");
    if (iframe && errorDiv) {
      iframe.style.display = "none";
      errorDiv.classList.remove("hidden");
    } else {
      console.error("Error element not found"); // Error message if error div is missing
    }
  },
});
