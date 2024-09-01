import { app, BrowserWindow, shell, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import fs from "fs";
import { ScanFiles, fetchData } from "../../src/logic.js";  
import jimp from "jimp";

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
    console.log('BACK::start');
    try {
      await startScript(data);
    } catch (err) {
      console.error("Error in startScript:", err);
    }

    async function startScript(data) {
      console.log('BACK::startScript', data);
      try {
        event.sender.send("scriptRunningEvent", true);
        const {
          modelPath,
          imagePath,
          titleText,
          softScan = false,
          hardScan = true,
        } = data;

        console.log('event.sender.send-scriptRunningEvent!!!!!', data);

        let cache = [];  

        const cachePath = `${imagePath}/scan.json`;

        if (fs.existsSync(cachePath)) {
          try {
            if (!softScan && hardScan) {
              cache = [];
            } else if (!hardScan) {
              cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            }
          } catch (err) {
            console.log("SERVER reading cache error!", cachePath, err);
            cache = null;
          }
        }

        const recached = [];
        if (cache) { 
          try {
            for (let i = 0; i < cache.length; i++) {
              const tests = [
                `${modelPath}/${cache[i].model}`,
                `${modelPath}/${cache[i].model}.zip`,
                `${modelPath}/${cache[i].model}.rar`,
              ];
              const modelExists = tests.some((path) => fs.existsSync(path));
              const imgExists = fs.existsSync(cache[i].path);
              if (!modelExists) continue;
              if (!imgExists) continue;

              const img = await jimp.read(cache[i].path);
              const img64 = await img.getBase64Async(jimp.MIME_PNG);

              recached.push({
                ...cache[i],
                ready: true,
                image: img64,
              });
            }
          } catch (err) {
            console.log("problem", err);
          }
          console.log(cache);

          if (!softScan && !hardScan) {
            event.sender.send("modelsListEvent", recached);
            console.log('BACK::recached',recached);
            event.sender.send("scriptRunningEvent", false);
            return;
          }

          const excluded = [
            ...(softScan && recached.length
              ? recached.map((el) => el.model)
              : []),
            "scan.json",
          ];
          console.log(excluded, "-----------------------");

          const modelsList = await ScanFiles(modelPath, excluded);
          console.log(modelsList, "this is modelsList ????");

          event.sender.send("modelsListEvent", [...recached, ...modelsList]);

          const completeList = await fetchData(
            modelsList,
            imagePath,
            titleText,
            event.sender
          );

          const nextCache = [
            ...recached.map((el) => ({
              model: el.model,
              path: el.path,
              title: el.title,
            })),
            ...completeList,
          ];
          console.log(nextCache);
          fs.writeFileSync(cachePath, JSON.stringify(nextCache));
          console.log("SERVER ..wwait writing to json..");

          event.sender.send("scriptRunningEvent", false);
        }
      } catch (err) {
        console.error("Error in startScript:", err);
      }
    }
  });
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
