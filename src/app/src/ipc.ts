// This is simply a definition file for ../../app_ipc.ts
let ipc: Ipc;

//@ts-ignore
ipc = _ipc;

export interface IpcFile {
    fileName: string,
    extension: string,
    size: number
}

export interface ConverterOptions {
    acceptsFileTypes: string[]
    canConvertToFileTypes: string[]
    name: string
    description: string
}

export interface TaskUpdate {
    percentComplete: number,
    isComplete: boolean,
    details: TaskDetails,
    finishedDetails?: {
        fileName: string,
    }
}

export interface TaskDetails {
    taskID: string,
    fileName: string,
    converter: string,
    toFileType: string,
}

interface Ipc {
    openFile: () => IpcFile,
    openFileExternally: (fileName: string) => void,
    getConvertersForExtension: (extension: string) => ConverterOptions[],
    getConverters: () => ConverterOptions[],
    convert: (data: { file: string, extension: string, converterName: string }) => string,
    deleteFile: (data: { fileName: string, taskID?: string }) => void,
    
    taskUpdateEvent: (callback: (data: TaskUpdate) => void) => void,
    taskDeleteEvent: (callback: (data: string) => void) => void,
}

export default ipc;