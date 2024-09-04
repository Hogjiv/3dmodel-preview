"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import fs from "fs";
import { bigImage } from "./logic.js";

const jimp = require("jimp").default;
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const { ScanFiles } = require("./logic.js");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    minWidth: 450,
    icon: "./public/logo.png",
    // titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      preload: path.join(__dirname, "../src/preload.js"),
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  ipcMain.handle("startScriptEvent", async (event, data) => {
    await startScript(data);
    async function startScript(data) {
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

        const cachePath = imagePath + "/scan.json";

        if (fs.existsSync(cachePath)) {
          try {
            if (softScan === false && hardScan === true) {
              cache = [];
            }
            if (hardScan === false) {
              cache = JSON.parse(fs.readFileSync(cachePath).toString());
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
                modelPath + "/" + cache[i].model,
                modelPath + "/" + cache[i].model + ".zip",
                modelPath + "/" + cache[i].model + ".rar",
              ];
              const modelExists = tests.some((path) => fs.existsSync(path));
              const imgExists = fs.existsSync(cache[i].path);
              if (!modelExists) {
                continue;
              }
              console.log("model exists", cache[i].model);
              if (!imgExists) {
                continue;
              }
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
        }
        console.log(cache);
        if (!softScan && !hardScan && cache) {
          event.sender.send("modelsListEvent", recached);
          event.sender.send("scriptRunningEvent", false);
          // event.sender.send('modelsListEvent', true);
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

        const completeList = await bigImage(
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
      } catch (err) {
        console.error(err);
      }
    }
    console.log("THE END");
    return data;
  });
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
