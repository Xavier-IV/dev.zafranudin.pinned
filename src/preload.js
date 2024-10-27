const { contextBridge, ipcRenderer, webFrame } = require("electron");

// Set the zoom factor to 30%
webFrame.setZoomFactor(0.3);

// Listen for zoom level updates
ipcRenderer.on("set-zoom", (event, zoomFactor) => {
  const toggleButton = document.getElementById("toggle-button");
  const urlButton = document.getElementById("url-button");
  const closeButton = document.getElementById("close-button");
  const dragButton = document.getElementById("drag-button");
  webFrame.setZoomFactor(zoomFactor);

  if (zoomFactor === 0.5) {
    toggleButton.classList.remove("control-normal");
    toggleButton.classList.add("control-small");

    dragButton.classList.remove("control-normal");
    dragButton.classList.add("control-small");

    urlButton.classList.remove("control-normal");
    urlButton.classList.add("control-small");

    closeButton.classList.remove("control-normal");
    closeButton.classList.add("control-small");
  } else {
    toggleButton.classList.add("control-normal");
    toggleButton.classList.remove("control-small");

    dragButton.classList.add("control-normal");
    dragButton.classList.remove("control-small");

    urlButton.classList.add("control-normal");
    urlButton.classList.remove("control-small");

    closeButton.classList.add("control-normal");
    closeButton.classList.remove("control-small");
  }
});

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("app-close"),
  toggleSize: () => ipcRenderer.send("toggle-size"),
  openURL: (url) => {
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
