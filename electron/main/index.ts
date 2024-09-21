import { app, BrowserWindow, shell, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import fs from "fs";
import { fetchData } from "../../src/getData.js";
import { ScanFiles } from "../../src/scanFiles.js";

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
    icon: "PM_logo.png",
    // icon: path.join(process.env.VITE_PUBLIC,  "./vite.svg" ),
    width: 600,
    height: 750,
    minWidth: 450,
    minHeight: 340,
    webPreferences: {
      preload,
      contextIsolation: true, // Рекомендуется для безопасности
      nodeIntegration: false, // Должно быть отключено в продакшене
    },
  });
  win.setMenu(null);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);

    //@This! comment for build
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
  // Обработка вызова из рендер-процесса
  ipcMain.handle("startScriptEvent", async (event, data) => {
    console.log("BACK::start");
    try {
      await startScript(data);
    } catch (err) {
      console.error("Error in startScript:", err);
    }

    // Основная логика обработки скрипта
    async function startScript(data) {
      console.log("BACK::startScript", data);
      try {
        event.sender.send("scriptRunningEvent", true);
        const {
          modelPath,
          imagePath,
          titleText,
          softScan = false,
          hardScan = true,
        } = data;

        let cache = [];
        const cachePath = path.join(imagePath, "scan.json");

        if (fs.existsSync(cachePath)) {
          try {
            if (softScan === false && hardScan === true) {
              cache = [];
            } else if (hardScan === false) {
              cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
            }
          } catch (err) {
            console.error("SERVER reading cache error!", cachePath, err);
            cache = null;
          }
        }

        console.log("BACK::cache", cache);

        const recached = [];
        if (cache) {
          try {
            console.log("BACK::Current Cache:", cache);
            // Checking for existence of model files; Skipping missing files: ; Reading and converting an image: ; Adding to the recached array:

            for (let i = 0; i < cache.length; i++) {
              const filePathsToCheck = [
                `${modelPath}/${cache[i].model}`,
                `${modelPath}/${cache[i].model}.zip`,
                `${modelPath}/${cache[i].model}.rar`,
                `${modelPath}/${cache[i].model}.7z`,
              ];
              const modelExists = filePathsToCheck.some((path) =>
                fs.existsSync(path)
              );
              const imgExists = fs.existsSync(cache[i].path);

              console.log(
                "проверяем существование файлов модели modelExists:",
                modelExists
              );
              console.log(
                "проверяем существование файлов модели imgExists:",
                imgExists
              );
              console.log(
                "проверяем существование файлов модели filePathsToCheck:",
                filePathsToCheck
              );
              //if models doesn't exist, skip
              if (!modelExists) continue;
              if (!imgExists) continue;

              //if models exist, read it from jimp
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
          console.log("BACK::STEP 1", cache);
          console.log("BACK::STEP 2", recached);

          if (!softScan && !hardScan) {
            event.sender.send("modelsListEvent", recached);
            console.log("?????BACK::recached", recached);

            event.sender.send("scriptRunningEvent", false);

            console.log("?????BACK:scriptRunningEvent");
            return;
          }

          const excluded = [
            ...(softScan && recached.length
              ? recached.map((el) => el.model)
              : []),
            "scan.json",
            ".DS_Store",
          ];
          console.log("BACK::excluded files are:", excluded);

          const modelsList = await ScanFiles(modelPath, excluded);
          console.log(modelsList, "BACK:: modelsList from ScanFiles function");

          event.sender.send("modelsListEvent", [...recached, ...modelsList]);

          const completeList = await fetchData(
            modelsList,
            imagePath,
            titleText,
            event.sender
          );
          console.log("!!!!The completeList", completeList);
          const nextCache = [
            ...recached.map((el) => ({
              model: el.model,
              path: el.path,
              title: el.title,
            })),
            ...completeList,
          ];

          console.log("!!!!The next cahs is nextCache", nextCache);

          fs.writeFileSync(cachePath, JSON.stringify(nextCache));
          console.log("BACK:: wait writing to json..",nextCache);

          event.sender.send("scriptRunningEvent", false);
        }
      } catch (err) {
        console.error("Error in startScript:", err);
      }
    }
    console.log("THE END");
    return data;
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
