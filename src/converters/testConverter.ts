import Content from "../content/Content";
import FileType from "../content/FileType";
import Converter, { ConverterConvertOptions } from "../ConverterBase";

export default class TestConverter extends Converter {
    constructor() {
        super({
            acceptsFileTypes: [FileType.TXT],
            canConvertToFileTypes: [FileType.TXT],
            name: "test-converter",
            description: "a test converter"
        })
    }

    public override async convert(oldContent: Content, options: ConverterConvertOptions, passThrough: {letter: string}): Promise<Content> {
        this.validateOptions(oldContent, options);

        let content = new Content(
            Buffer.from(passThrough.letter.repeat(oldContent.getContents().length)), 
            FileType.TXT
        );
        return content;
    }
}