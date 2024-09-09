import { app, BrowserWindow, shell, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import fs from "fs";
import { ScanFiles, fetchData } from "../../src/logic.js";
import jimp from "jimp";

// Определение текущей директории
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Установка корневой директории приложения
process.env.APP_ROOT = path.join(__dirname, "../..");

// Пути к дистрибутивам приложения
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

// Установка публичного пути в зависимости от наличия VITE_DEV_SERVER_URL
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Отключение аппаратного ускорения на определенных версиях Windows
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Настройка идентификатора модели пользователя для Windows
if (process.platform === "win32") app.setAppUserModelId(app.getName());

// Проверка на наличие второго экземпляра приложения
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

// Асинхронная функция для создания окна приложения
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: " exit.png",
    // icon: path.join(process.env.VITE_PUBLIC,  "./vite.svg" ), 
    width: 600,
    height: 750,
    minWidth: 450,
    minHeight: 340,
    webPreferences: {
      preload,
      contextIsolation: true, // Рекомендуется для безопасности
      nodeIntegration: false,  // Должно быть отключено в продакшене
    },
  });

  // Загрузка URL или файла в зависимости от режима разработки
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();  
  } else {
    win.loadFile(indexHtml);
  }

  // Обработка завершения загрузки страницы
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Обработка открытия внешних ссылок в браузере
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

// Инициализация приложения после его готовности
app.whenReady().then(() => {
  // Обработка вызова из рендер-процесса
  ipcMain.handle("startScriptEvent", async (event, data) => {
    console.log('BACK::start');
    try {
      await startScript(data);
    } catch (err) {
      console.error("Error in startScript:", err);
    }

    // Основная логика обработки скрипта
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
        console.log("BACK::cache",cache);

        const recached = [];
        if (cache) { 
          try {
            // Проверка существования файлов модели; Пропуск отсутствующих файлов:  ; Чтение и конвертация изображения:  ; Добавление в массив recached:  

            for (let i = 0; i < cache.length; i++) {
              const filePathsToCheck = [
                `${modelPath}/${cache[i].model}`,
                `${modelPath}/${cache[i].model}.zip`,
                `${modelPath}/${cache[i].model}.rar`,
              ];
              const modelExists = filePathsToCheck.some((path) => fs.existsSync(path));
              const imgExists = fs.existsSync(cache[i].path);

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

          if (!softScan && !hardScan) {
            event.sender.send("modelsListEvent", recached);
          
            event.sender.send("scriptRunningEvent", false);
            return;
          }

          const excluded = [
            ...(softScan && recached.length
              ? recached.map((el) => el.model)
              : []),
            "scan.json", ".DS_Store"
          ];
          console.log( "BACK::excluded files are:", excluded);

          const modelsList = await ScanFiles(modelPath, excluded);
          console.log(modelsList, "BACK:: modelsList from ScanFiles function"); 

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

          // const nextCache = [
          //   ...recached,
          //   ...completeList,
          // ];
          console.log(nextCache);

          fs.writeFileSync(cachePath, JSON.stringify(nextCache));
          console.log("BACK:: wait writing to json..");

          event.sender.send("scriptRunningEvent", false);
        }
      } catch (err) {
        console.error("Error in startScript:", err);
      }
    }
    console.log("THE END");
    return data;
  });

  // Обработка вызова для сканирования файлов
  // ipcMain.handle("scan-files", async (event, modelPath) => {
  //   try {
  //     const files = await ScanFiles(modelPath);
  //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!erase?')
  //     return files;
  //   } catch (error) {
  //     console.error("Error scanning files:", error);
  //     throw error;
  //   }
  // });

  // Вызов создания окна теперь происходит только после app.whenReady()
  createWindow();
});

// Обработка закрытия всех окон
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

// Обработка повторного запуска приложения
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

// Обработка активации приложения (для macOS)
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// Обработка запроса системной информации
ipcMain.handle("getSystemInfo", async () => {
  return {
    platform: os.platform(),
    release: os.release(),
    cpu: os.cpus()[0].model,
  };
});

// Пример обработчика получения данных пользователя
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

// Обработка открытия нового окна
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
