import * as uuid from "uuid";
import FileType, { fileTypeToString, stringToFileType } from "./FileType";
import Config from "../Config";
import * as path from "path";
import fs from "fs";

export interface ContentData {
    fileType: FileType
    id: string
}

export default class Content {
    public fileType: FileType
    public id: string

    constructor(contents: Buffer | null, fileType: FileType, id?: string | null, doNotWrite?: boolean) {
        this.fileType = fileType;
        this.id = id ?? Content.generateContentID();

        // Write file
        if (!doNotWrite && contents) this.generateFile(contents);
    }

    public generateFile(buffer: Buffer): string {
        // Get the path
        let filePath = this.getPath();

        // Create the actual file
        fs.writeFileSync(filePath, buffer);

        // Create the data file
        fs.writeFileSync(filePath + ".data.json", JSON.stringify(this.toJsonData()));

        return filePath;
    }

    public getContents(): Buffer {
        return fs.readFileSync(this.getPath());
    }

    public cleanup(): void {
        let path = this.getPath();
        fs.rmSync(path);
        fs.rmSync(path + ".data.json");
    }

    public toJsonData(): ContentData {
        return {
            fileType: this.fileType,
            id: this.id,
        };
    }

    public getPath(): string {
        return path.resolve(path.join(Config.get().fileDirectory, `${this.id}.${fileTypeToString(this.fileType)}`));
    }

    public static generateContentID() {
        return uuid.v4();
    }

    public static fromFileName(fileName: string, noWrite?: boolean) {
        let data = fs.readFileSync(fileName);
        let content = new Content(
            data, 
            stringToFileType(
                path.extname(fileName)), 
                path.basename(fileName).replace(path.extname(fileName), ""
            ),
            !!noWrite
        );
        return content;
    }
}