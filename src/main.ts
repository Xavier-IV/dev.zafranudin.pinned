import path from "path";
import {
  app,
  BrowserWindow,
  WebContentsView,
  screen,
  ipcMain,
  globalShortcut,
  nativeImage,
  Tray,
  Menu,
} from "electron";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const CONTROL_WINDOW_VITE_DEV_SERVER_URL: string;
declare const BACK_WINDOW_VITE_DEV_SERVER_URL: string;
declare const TOGGLE_WINDOW_VITE_DEV_SERVER_URL: string;
declare const URL_WINDOW_VITE_DEV_SERVER_URL: string;

declare const MAIN_WINDOW_VITE_NAME: string;
declare const CONTROL_WINDOW_VITE_NAME: string;
declare const TOGGLE_WINDOW_VITE_NAME: string;
declare const BACK_WINDOW_VITE_NAME: string;
declare const URL_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const BORDER_THICKNESS = 8;

const PRIMARY_WINDOW_W = Math.floor(520 + BORDER_THICKNESS * 4);
const PRIMARY_WINDOW_H = Math.floor(420 + BORDER_THICKNESS * 4);

const BACKGROUND_VIEW_W = Math.floor(PRIMARY_WINDOW_W - BORDER_THICKNESS);
const BACKGROUND_VIEW_H = Math.floor(PRIMARY_WINDOW_H - BORDER_THICKNESS - 20);
const BROWSER_VIEW_W = Math.floor(PRIMARY_WINDOW_W - BORDER_THICKNESS * 2);
const BROWSER_VIEW_H = Math.floor(PRIMARY_WINDOW_H - BORDER_THICKNESS * 2 - 20);

const MOBILE_W = Math.floor((412 * 4) / 5);
const MOBILE_H = Math.floor((915 * 4) / 5);
const PRIMARY_WINDOW_POTRAIT_W = Math.floor(MOBILE_W + BORDER_THICKNESS * 2);
const PRIMARY_WINDOW_POTRAIT_H = Math.floor(MOBILE_H + BORDER_THICKNESS * 2);

const BACKGROUND_VIEW_POTRAIT_W = MOBILE_W - BORDER_THICKNESS;
const BACKGROUND_VIEW_POTRAI_H = Math.floor(MOBILE_H - BORDER_THICKNESS - 10);
const BROWSER_VIEW_POTRAIT_W = Math.floor(MOBILE_W - BORDER_THICKNESS * 2);
const BROWSER_VIEW_POTRAIT_H = Math.floor(MOBILE_H - BORDER_THICKNESS * 2 - 10);

let mainWindow: BrowserWindow;
let tray: Tray;

let browserView: WebContentsView;
let backgroundView: WebContentsView;

let controlView: WebContentsView;
let toggleView: WebContentsView;
let backView: WebContentsView;
let urlView: WebContentsView;

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;
  const { width: primaryWidth } = primaryDisplay.workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: PRIMARY_WINDOW_W + 20,
    height: PRIMARY_WINDOW_H + 20,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    frame: false,
    focusable: true,
    // resizable: true, // Disable resizing
    icon: path.join(__dirname, "../../src/assets/logo.png"),
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },

    x: primaryWidth - PRIMARY_WINDOW_W - 36,
    y: 50,
  });

  // mainWindow.webContents.openDevTools({ mode: "detach" });
  mainWindow.loadFile(
    path.join(__dirname, `../../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
  );

  globalShortcut.register("CmdOrCtrl+Shift+H", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.showInactive();
      }
    }
  });

  // CONTROL WINDOW
  backView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  backView.setBorderRadius(4.0);

  backView.setBounds({
    x: 10,
    y: 3,
    width: 20,
    height: 20,
  });

  // backView.webContents.openDevTools();

  // CONTROL WINDOW
  controlView = new WebContentsView({});
  controlView.setBorderRadius(4.0);
  controlView.setBounds({
    x: BACKGROUND_VIEW_W - 20,
    y: 3,
    width: 20,
    height: 20,
  });

  // TOGGLE WINDOW
  toggleView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  toggleView.setBorderRadius(4.0);
  toggleView.setBounds({
    x: BACKGROUND_VIEW_W - 20 * 2 - 10,
    y: 3,
    width: 20,
    height: 20,
  });

  // URL WINDOW
  urlView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  urlView.setBorderRadius(4.0);
  urlView.setBounds({
    x: BACKGROUND_VIEW_W - 20 * 3 - 20,
    y: 3,
    width: 20,
    height: 20,
  });

  // Layer 1: Background with a border-like appearance
  backgroundView = new WebContentsView({});
  backgroundView.webContents.loadURL(
    "data:text/html;charset=utf-8," +
      encodeURIComponent(`
      <style>
        body {
            background: linear-gradient(135deg, #2a2e35, #505a6b); /* Gradient colors */

          margin: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    `),
  );
  backgroundView.setBorderRadius(10.0);

  // Position and size the background view
  backgroundView.setBounds({
    x: 0,
    y: 30,
    width: BACKGROUND_VIEW_W,
    height: BACKGROUND_VIEW_H,
  });

  // Add background view as the first layer (z-index -1)

  // BROWSER WINDOW
  browserView = new WebContentsView({});
  browserView.webContents.loadURL("http://localhost:3000");
  browserView.webContents.setZoomLevel(0.7);
  // Set zoom factor after content is fully loaded
  browserView.webContents.on("did-finish-load", () => {
    browserView.webContents.setZoomFactor(0.7); // or setZoomLevel(-2) for equivalent zoom
  });
  browserView.setBorderRadius(9.0);
  browserView.setBounds({
    x: 0 + BORDER_THICKNESS / 2,
    y: 30 + BORDER_THICKNESS / 2,
    width: BROWSER_VIEW_W,
    height: BROWSER_VIEW_H,
  });

  // backView.webContents.loadURL(BACK_WINDOW_VITE_DEV_SERVER_URL);
  // toggleView.webContents.loadURL(TOGGLE_WINDOW_VITE_DEV_SERVER_URL);
  // controlView.webContents.loadURL(CONTROL_WINDOW_VITE_DEV_SERVER_URL);
  // urlView.webContents.loadURL(URL_WINDOW_VITE_DEV_SERVER_URL);

  backView.webContents.loadFile(
    path.join(__dirname, `../../renderer/${BACK_WINDOW_VITE_NAME}/index.html`),
  );

  toggleView.webContents.loadFile(
    path.join(
      __dirname,
      `../../renderer/${TOGGLE_WINDOW_VITE_NAME}/index.html`,
    ),
  );

  controlView.webContents.loadFile(
    path.join(
      __dirname,
      `../../renderer/${CONTROL_WINDOW_VITE_NAME}/index.html`,
    ),
  );

  urlView.webContents.loadFile(
    path.join(__dirname, `../../renderer/${URL_WINDOW_VITE_NAME}/index.html`),
  );

  // Listen for mouse back/forward button events
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.type === "mouseButton") {
        if (input.button === "back") {
          if (mainWindow.webContents.canGoBack()) {
            mainWindow.webContents.goBack();
          }
          event.preventDefault();
        } else if (input.button === "forward") {
          if (mainWindow.webContents.canGoForward()) {
            mainWindow.webContents.goForward();
          }
          event.preventDefault();
        }
      }
    });
  });

  mainWindow.contentView.addChildView(backgroundView);
  mainWindow.contentView.addChildView(browserView);
  mainWindow.contentView.addChildView(controlView);
  mainWindow.contentView.addChildView(toggleView);
  mainWindow.contentView.addChildView(urlView);
  mainWindow.contentView.addChildView(backView);

  // // and load the index.html of the app.
  // if (process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  //   mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL);
  // } else {
  //   mainWindow.loadFile(
  //     path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
  //   );
  // }

  // Open DevTools in a detached window (optional, for development)
  // if (process.env.NODE_ENV === "development") {
  //   mainWindow.webContents.openDevTools({ mode: "detach" });
  // }
};

// Create the tray icon
function createTray() {
  const iconPath = path.join(__dirname, "../../src/assets/iconTemplate.png");
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

ipcMain.on("toggle-size", () => {
  const { width, height } = mainWindow.getBounds();
  const { width: wBg, height: hBg } = backgroundView.getBounds();
  const { width: wBrowser, height: hBrowser } = browserView.getBounds();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: primaryWidth } = primaryDisplay.workAreaSize;

  if (wBg === BACKGROUND_VIEW_W && hBg === BACKGROUND_VIEW_H) {
    controlView.setBounds({
      x: BACKGROUND_VIEW_POTRAIT_W - 20,
      y: 3,
      width: 20,
      height: 20,
    });

    toggleView.setBounds({
      x: BACKGROUND_VIEW_POTRAIT_W - 20 * 2 - 10,
      y: 3,
      width: 20,
      height: 20,
    });

    urlView.setBounds({
      x: BACKGROUND_VIEW_POTRAIT_W - 20 * 3 - 20,
      y: 3,
      width: 20,
      height: 20,
    });

    mainWindow.setBounds({
      width: PRIMARY_WINDOW_POTRAIT_W,
      height: PRIMARY_WINDOW_POTRAIT_H,
    });

    backgroundView.setBounds({
      x: 0,
      y: 30,
      width: BACKGROUND_VIEW_POTRAIT_W,
      height: BACKGROUND_VIEW_POTRAI_H,
    });

    browserView.setBounds({
      x: 0 + BORDER_THICKNESS / 2,
      y: 30 + BORDER_THICKNESS / 2,
      width: BROWSER_VIEW_POTRAIT_W,
      height: BROWSER_VIEW_POTRAIT_H,
    });

    mainWindow.setBounds({
      x: primaryWidth - PRIMARY_WINDOW_POTRAIT_W - 20,
      y: 50,
    });

    browserView.webContents.setZoomFactor(1); // or setZoomLevel(-2) for equivalent zoom
  } else {
    controlView.setBounds({
      x: BACKGROUND_VIEW_W - 20,
      y: 3,
      width: 20,
      height: 20,
    });

    toggleView.setBounds({
      x: BACKGROUND_VIEW_W - 20 * 2 - 10,
      y: 3,
      width: 20,
      height: 20,
    });

    urlView.setBounds({
      x: BACKGROUND_VIEW_W - 20 * 3 - 20,
      y: 3,
      width: 20,
      height: 20,
    });

    mainWindow.setBounds({
      width: PRIMARY_WINDOW_W + 20,
      height: PRIMARY_WINDOW_H + 20,
    });

    backgroundView.setBounds({
      x: 0,
      y: 30,
      width: BACKGROUND_VIEW_W,
      height: BACKGROUND_VIEW_H,
    });

    browserView.setBounds({
      x: 0 + BORDER_THICKNESS / 2,
      y: 30 + BORDER_THICKNESS / 2,
      width: BROWSER_VIEW_W,
      height: BROWSER_VIEW_H,
    });

    mainWindow.setBounds({
      x: primaryWidth - PRIMARY_WINDOW_W - 36,
      y: 50,
    });
    browserView.webContents.setZoomFactor(0.7); // or setZoomLevel(-2) for equivalent zoom
  }
});

ipcMain.on("navigate-back", () => {
  if (browserView.webContents.canGoBack()) {
    browserView.webContents.goBack();
  }
});

// app.disableHardwareAcceleration();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// Set up the app when ready
app.whenReady().then(() => {
  createTray(); // Create the tray first to ensure visibility
  createWindow();

  // Hide the app icon from the Dock
  if (process.platform === "darwin") {
    app.dock.hide();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
