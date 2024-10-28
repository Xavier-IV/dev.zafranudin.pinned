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
    hasShadow: false,
    frame: false,
    // focusable: false,
    // resizable: true, // Disable resizing
    resizable: true,
    icon: path.join(__dirname, "assets/logo.png"),

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
    mainWindow.webContents.send("update-iframe-url", url);
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

  tray.setToolTip("Pinned"); // Tooltip on hover
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

// Toggle between large and small window sizes
ipcMain.on("toggle-size", () => {
  const { width, height } = mainWindow.getBounds();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: primaryWidth } = primaryDisplay.workAreaSize;

  if (width === 300 && height === 230) {
    mainWindow.setBounds({
      width: 300 * 2,
      height: 230 * 2,
    });
    mainWindow.setBounds({
      x: primaryWidth - 610,
      y: 50,
    });
    mainWindow.webContents.send("set-zoom", 0.5); // Set zoom factor to 1.0 for large size
  } else {
    mainWindow.setBounds({
      width: 300,
      height: 230,
    });
    mainWindow.setBounds({
      x: primaryWidth - 320,
      y: 50,
    });
    mainWindow.webContents.send("set-zoom", 0.3);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
