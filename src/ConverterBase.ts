import Content from "./content/Content";
import FileType, { fileTypeToString } from "./content/FileType";
import ContentError from "./ContentError";
import * as fs from "fs";
import VideoConverter from "./converters/VideoConverter";

export interface ConverterOptions {
    acceptsFileTypes: FileType[] | null
    canConvertToFileTypes: FileType[] | null
    name: string
    description: string
}

export interface ConverterConvertOptions {
    toFileType: FileType,
    onProgress?: (o: ProgressReport) => void,
}

export interface ProgressReport {
    percentComplete: number,
}

export default class Converter {
    private static converterInstances: Converter[] | null = null;
    public options: ConverterOptions
    
    constructor(options: ConverterOptions) {
        this.options = options
    }

    public validateOptions(oldContent: Content, options: ConverterConvertOptions) {
        // Check if it accepts it
        if (this.options.acceptsFileTypes != null && !this.options.acceptsFileTypes.includes(oldContent.fileType)) {
            throw new ContentError(oldContent, `The converter only accepts: ${
                this.options.acceptsFileTypes.map(fileTypeToString).join(", ")
            } file types, but got ${fileTypeToString(oldContent.fileType)}`)
        }

        // Check if it can convert to it
        if (this.options.canConvertToFileTypes != null && !this.options.canConvertToFileTypes.includes(options.toFileType)) {
            throw new ContentError(oldContent, `The converter only can convert to: ${
                this.options.acceptsFileTypes.map(fileTypeToString).join(", ")
            } file types, but got ${fileTypeToString(options.toFileType)}`)
        }
    }

    public convert(oldContent: Content, options: ConverterConvertOptions, passThrough: unknown): Promise<Content> {
        return new Promise((_, reject) => reject(""));
    }
    
    public static getConverters(): Converter[] {
        // Check if loaded already
        if (Converter.converterInstances != null)
            return Converter.converterInstances;

        // Load converters
        let list = fs.readdirSync(__dirname + "/converters")
            .filter(c => c.endsWith(".js"))
            .map(c => require(`./converters/${c}`).default) as typeof Converter[];
        
        let converters: Converter[] = [];

        for (let converter in list) {
            // @ts-ignore
            let instance = new list[converter]();
            converters.push(instance);
        }

        Converter.converterInstances = converters;

        return converters;
    }

    public static getConvertersForFileType(fileType: FileType): Converter[] {
        return Converter.getConverters()
            .filter(converter => converter.options.acceptsFileTypes.includes(fileType));        
    }
}