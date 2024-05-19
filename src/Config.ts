const alreadyInitialised: Config | null = null;

export default class Config {
    public fileDirectory: string;

    constructor() {
        this.fileDirectory = "/home/isabella/projects/typescript/converter/files";
    }

    public static get(): Config {
        return alreadyInitialised ?? new Config();
    }
}