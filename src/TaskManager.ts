import * as uuid from "uuid";
import Converter, { ConverterConvertOptions } from "./ConverterBase";
import Content from "./content/Content";
import { BrowserWindow, ipcMain } from "electron";
import { window } from ".";
import { fileTypeToString } from "./content/FileType";

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

let tasks: Map<string, Converter> = new Map();

export function addTask(converter: Converter, content: Content, options: ConverterConvertOptions): string {
    let taskID = uuid.v4();
    tasks.set(taskID, converter);

    let taskDetails: TaskDetails = {
        taskID,
        fileName: content.getPath(),
        converter: converter.options.name,
        toFileType: fileTypeToString(options.toFileType)
    };

    // lol
    /*if (content.fileType == options.toFileType) {
        let window = new BrowserWindow({
            titleBarStyle: "hidden",
            fullscreen: true
        });
        window.maximize();
    }*/ 

    converter.convert(content, {
        ...options,
        onProgress: progress => {
            let details: TaskUpdate = {
                percentComplete: progress.percentComplete,
                isComplete: false,
                details: taskDetails
            }

            // Boardcast update
            window.webContents.send("task-update", details);
        }
    }, null)
    .then(c => {
        let details: TaskUpdate = {
            percentComplete: 100,
            isComplete: true,
            details: taskDetails,
            finishedDetails: {
                fileName: c.getPath(),
            }
        };

        // Broadcase update
        window.webContents.send("task-update", details);

        content.cleanup();
        tasks.delete(taskID);
    });

    return taskID;
}

export function removeTask(taskID: string) {
    window.webContents.send("task-delete", taskID);
}