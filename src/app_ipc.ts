const { contextBridge, ipcRenderer } = require("electron") as typeof Electron;

contextBridge.exposeInMainWorld("_ipc", {
    openFile: () => ipcRenderer.sendSync("open-file", null),
    openFileExternally: (file: string) => ipcRenderer.send("open-file-externally", file),
    getConvertersForExtension: (ext: string) => ipcRenderer.sendSync("get-converters-for-ext", ext),
    getConverters: () => ipcRenderer.sendSync("get-converters", null),
    convert: (data: {}) => ipcRenderer.sendSync("convert", data),
    deleteFile: (data: any) => ipcRenderer.sendSync("delete-file", data),

    taskUpdateEvent: (callback: (data: any) => void) => {
        ipcRenderer.on("task-update", (_, data) => {
            callback(data);
        });
    },

    taskDeleteEvent: (callback: (data: any) => void) => {
        ipcRenderer.on("task-delete", (_, data) => {
            callback(data);
        });
    }
});