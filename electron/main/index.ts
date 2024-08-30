import { app, BrowserWindow, shell, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import { ScanFiles, bigImage } from "../../src/logic.js"; // Убедитесь, что путь правильный и существует

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Should be disabled in production
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  ipcMain.handle("startScriptEvent", async (event, data) => {
    console.log('BACK::script running!') 
    try {
      console.error("sdfdsfd!!", data);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  ipcMain.handle("fetchBackgroundData", async () => {
    console.log("***********************8888888");
    return {
      platform: os.platform(),
      release: os.release(),
      additionalData: "Some background data",
    };
  });

  ipcMain.handle("setNumberStore", async (event, data) => {
    console.log("BACK:: number cached", data);
    const array = [1, 2, 3, 4, 5, 6];
    const rNumber = array[4];
    return rNumber;
  });

  ipcMain.handle("scan-files", async (event, modelPath) => {
    try {
      const files = await ScanFiles(modelPath);
      return files;
    } catch (error) {
      console.error("Error scanning files:", error);
      throw error;
    }
  });

  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.handle("getSystemInfo", async () => {
  return {
    platform: os.platform(),
    release: os.release(),
    cpu: os.cpus()[0].model,
  };
});

ipcMain.handle("getUserData", async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });
    }, 1000);
  });
});

ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
