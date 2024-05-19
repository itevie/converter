import { app, BrowserWindow } from "electron";
import path from "path";
import "./ipc";

// @ts-ignore
let window: BrowserWindow = null;

app.on("ready", () => {
    window = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, '/app_ipc.js'),
        },
    });
    window.loadURL("http://localhost:3000");
});

export { window };

/*
import Config from "./Config";
import Converter from "./ConverterBase";
import * as fs from "fs";
import VideoConverter from "./converters/VideoConverter";
import Content from "./content/Content";
import FileType from "./content/FileType";
let files = fs.readdirSync(Config.get().fileDirectory);
for (let i in files) {
    fs.rmSync(Config.get().fileDirectory + "/" + files[i]);
}

// Create the file as a piece of "content"
let file = Content.fromFileName(path.resolve("./test.mp4"));

// Provides the given file to the VideoConverter converter with the specified options
let n = new VideoConverter().convert(file, { 
    toFileType: FileType.MOV, 
    onProgress: (o) => console.log(o.percentComplete) 
}, null);

// Cause its async and js is whiny cant be having top level async
n.then(console.log);*/