import Content from "./content/Content";

export default class ContentError extends Error {
    public fileIssue: string

    constructor(contentIssue: Content, message: string) {
        super(message);
        this.fileIssue = contentIssue.getPath();
    }
}