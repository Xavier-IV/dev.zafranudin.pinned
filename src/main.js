const {
  app,
  BrowserWindow,
  nativeImage,
  screen,
  ipcMain,
  dialog,
  Tray,
  Menu,
} = require("electron");
const path = require("path");

let tray = null;
let mainWindow = null;

app.on("ready", () => {
  // Hide the app icon from the Dock
  if (process.platform === "darwin") {
    app.dock.hide();
  }

  createTray();
});

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 300,
    height: 230,
    transparent: true,
    alwaysOnTop: true,
    // resizable: false, // Disable resizing

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Secure context isolation
      enableRemoteModule: false, // Disable remote module
      nodeIntegration: false, // Disable node integration
    },
    x: width - 320, // Position at the top-right corner
    y: 50, // Align to the top of the screen
  });

  // Handle the iframe URL update event from preload.js
  ipcMain.on("set-iframe-url", (event, url) => {
    win.webContents.send("update-iframe-url", url);
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

// Create the tray icon
function createTray() {
  const iconPath = path.join(__dirname, "assets/iconTemplate.png");
  const icon = nativeImage.createFromPath(iconPath);

  // Scale the icon to an appropriate size for the Menu Bar
  const trayIcon = icon.resize({ width: 16 });
  tray = new Tray(trayIcon);

  // Set up the tray menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        BrowserWindow.getAllWindows()[0].show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Pinned.dev"); // Tooltip on hover
  tray.setContextMenu(contextMenu);

  // Optional: toggle the window on click
  tray.on("click", () => {
    const window = BrowserWindow.getAllWindows()[0];
    window.isVisible() ? window.hide() : window.show();
  });
}

// Set up the app when ready
app.whenReady().then(() => {
  createTray(); // Create the tray first to ensure visibility
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle close event from renderer
ipcMain.on("app-close", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
