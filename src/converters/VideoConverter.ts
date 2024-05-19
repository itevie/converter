import Content from "../content/Content";
import FileType from "../content/FileType";
import Converter, { ConverterConvertOptions } from "../ConverterBase";
import hbjs from "handbrake-js";

export default class VideoConverter extends Converter {
    constructor() {
        super({
            acceptsFileTypes: [FileType.MP4, FileType.MOV, FileType.AVI, FileType.MKV, FileType.MP3, FileType.WAV, FileType.OGG],
            canConvertToFileTypes: [FileType.MP4, FileType.MOV, FileType.AVI, FileType.MKV, FileType.MP3, FileType.WAV, FileType.OGG],
            name: "Video / Audio Converter",
            description: "Converts video & audio from one format to another"
        })
    }

    public override convert(oldContent: Content, options: ConverterConvertOptions, passThrough: null): Promise<Content> {
        return new Promise<Content>((resolve, reject) => {
            this.validateOptions(oldContent, options);

            let temp = new Content(Buffer.from(""), options.toFileType, oldContent.id + "-output");
            let path = temp.getPath();
    
            hbjs.spawn({
                input: oldContent.getPath(),
                output: path
            }).on('error', err => {
                reject(err);
            })
            .on('progress', progress => {
                options?.onProgress({ percentComplete: progress.percentComplete });
            }).on("complete", () => {
                resolve(temp);
            })
        });
    }
}