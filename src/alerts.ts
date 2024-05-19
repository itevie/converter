import { window } from ".";

export function showWarning(message: string) {
    window.webContents.send("alert-warning", message);
}