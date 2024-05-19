import { dialog, ipcMain, shell } from "electron";
import { window } from ".";
import * as fs from "fs";
import path from "path";
import Converter from "./ConverterBase";
import { fileTypeToString, stringToFileType } from "./content/FileType";
import Content from "./content/Content";
import { addTask, removeTask } from "./TaskManager";
import { execFile } from "child_process";

ipcMain.on("convert", (event, data: { file: string, extension: string, converterName: string }) => {
    let originalExtension = path.extname(data.file);
    let converters = Converter.getConvertersForFileType(stringToFileType(originalExtension));
    let converter = converters.find(x => x.options.name === data.converterName);

    // Send task
    let id = addTask(converter, Content.fromFileName(data.file), {
        toFileType: stringToFileType(data.extension)
    });

    event.returnValue = id;
});

ipcMain.on("delete-file", (event, data: { fileName: string, taskID?: string }) => {
    let content = Content.fromFileName(data.fileName, true);
    content.cleanup();

    if (data.taskID) {
        removeTask(data.taskID);
    }

    event.returnValue = null;
});

ipcMain.on("open-file-externally", (_, data: string) => {
    shell.openPath(path.resolve(data));
});

ipcMain.on("open-file", event => {
    let data = dialog.showOpenDialogSync(window);

    // Check if it returned anything
    if (data == undefined || data.length == 0) {
        event.returnValue = null;
        return;
    }

    let fileName = path.resolve(data[0]);

    // Get details about the file
    let {size} = fs.statSync(fileName);


    event.returnValue = {
        fileName: fileName,
        extension: path.extname(fileName).toLowerCase().replace(/^\./, ""),
        size: size / 1e+6
    }
});

ipcMain.on("get-converters-for-ext", (event, data: string) => {
    event.returnValue = Converter.getConvertersForFileType(stringToFileType(data)).map(converter => {
        return {
            acceptsFileTypes: converter.options.acceptsFileTypes?.map(x => fileTypeToString(x)) ?? [],
            canConvertToFileTypes: converter.options.canConvertToFileTypes?.map(x => fileTypeToString(x)) ?? [],
            name: converter.options.name,
            description: converter.options.description
        }
    });
});

ipcMain.on("get-converters", (event) => {
    event.returnValue = Converter.getConverters().map(converter => {
        return {
            acceptsFileTypes: converter.options.acceptsFileTypes?.map(x => fileTypeToString(x)) ?? [],
            canConvertToFileTypes: converter.options.canConvertToFileTypes?.map(x => fileTypeToString(x)) ?? [],
            name: converter.options.name,
            description: converter.options.description
        }
    });
})