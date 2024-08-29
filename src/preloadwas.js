const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('API', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,

    /*test: (data) => {
        ipcRenderer.invoke('ping', data)
        console.log("invoke test")
    },*/
    startScript: (data) => {
        console.log('Handle scriptRunning invoked_1')
        ipcRenderer.invoke('startScriptEvent', data)
        //console.log("Image and Model user paths from preload.js", data)
    },
    modelsList: (data) => {
        console.log('Handle scriptRunning invoked_2 modelList')
        ipcRenderer.invoke('modelsListEvent', data)
    },
    /*scriptRunning: (data) => {
        console.log('Handle scriptRunning invoked_3')
        ipcRenderer.invoke('scriptRunningEvent', data)
        console.log('Handle scriptRunning invoked_4 scriptRunningEvent')
    },*/

    onScriptRunning: (callback) => ipcRenderer.on('scriptRunningEvent', (_event, value) => callback(value)),
    onModelList: (callback) => ipcRenderer.on('modelsListEvent', (_event, value) => callback(value)),
    onModelImage: (callback) =>  ipcRenderer.on('modelImageEvent', (_event, value) => callback(value)),
    onSetlList: (callback) =>  ipcRenderer.on('onSetlListEvent', (_event, value) => callback(value)),
    onModelSaved: (callback) =>  ipcRenderer.on('modelSavedEvent', (_event, value) => callback(value)),

    
})