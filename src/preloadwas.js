const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("API", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  startScript: (data) => {
    console.log("Handle scriptRunning invoked_1");
    ipcRenderer.invoke("startScriptEvent", data);
    //console.log("Image and Model user paths from preload.js", data)
  },
  modelsList: (data) => {
    console.log("Handle scriptRunning invoked_2 modelList");
    ipcRenderer.invoke("modelsListEvent", data);
  },

  // modelsListEvent - name in back
  //onModelsListEvent - name in store
 
  onScriptRunning: (callback) =>
    ipcRenderer.on("scriptRunningEvent", (_event, value) => callback(value)),
  onModelList: (callback) =>
    ipcRenderer.on("modelsListEvent", (_event, value) => callback(value)),

  onModelImage: (callback) =>
    ipcRenderer.on("modelImageEvent", (_event, value) => callback(value)),
  onSetlList: (callback) =>
    ipcRenderer.on("onSetlListEvent", (_event, value) => callback(value)),
  onModelSaved: (callback) =>
    ipcRenderer.on("modelSavedEvent", (_event, value) => callback(value)),

  // Using 'invoke'
  // ipcMain.handle("event2", ...).
  //   ipcRenderer.invoke('channel-name', data).then((result) => {
  //     console.log(result);
  //   });

  //Using 'on'
  //event.sender.send("event", "Some data").
  //   ipcRenderer.on('channel-name', (event, data) => {
  //     console.log(data);
  //   });
});
