enum FileType {
    PNG,
    JPEG,

    MP4,
    AVI,
    MOV,
    MKV,

    MP3,
    WAV,
    OGG,

    GIF,

    NONE,

    TXT,
}

const types = {
    [FileType.PNG]: "png",
    [FileType.JPEG]: "jpeg",

    [FileType.MP4]: "mp4",
    [FileType.AVI]: "avi",
    [FileType.MOV]: "mov",
    [FileType.MKV]: "mkv",

    [FileType.GIF]: "gif",

    [FileType.MP3]: "mp3",
    [FileType.WAV]: "wav",
    [FileType.OGG]: "ogg",

    [FileType.TXT]: "txt",

    [FileType.NONE]: "<unknown>"
}

export function fileTypeToString(what: FileType) {
    return types[what];
}

export function stringToFileType(what: string): FileType {
    for (let i in Object.keys(types)) {
        if (types[i] === what.toLowerCase().replace(/^\./, "")) return parseInt(i) as FileType;
    }

    return FileType.NONE;
}

export default FileType;