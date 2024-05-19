import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import ipc, { IpcFile } from "../ipc";
import { useState } from "react";
import { setTaskDialogId } from "../Components/TaskVisualiserDialogue";

export default function Convert(props: {display: string}) {
    const [currentFile, setCurrentFile] = useState<IpcFile | null>(null);
    const [converters, setConverters] = useState<string[]>([]);
    const [selectedConverter, setSelectedConverter] = useState<string | null>(null);

    function openFile() {
        let contents = ipc.openFile();

        if (contents == null)
            return;

        let converters = ipc.getConvertersForExtension(contents.extension);
        let list: string[] = [];

        for (let converter of converters) {
            for (let fileType of converter.acceptsFileTypes) {
                list.push(`${fileType} - ${converter.name}`);
            }
        }

        setCurrentFile(contents);
        setConverters(list);
        setSelectedConverter(null);
    }

    function setSelected(what: string) {
        setSelectedConverter(what);
    }

    function beginTask() {
        let parts = selectedConverter?.split(" - ") as string[];
        let extension = parts[0];
        let converterName = parts[1];
        let fileName = currentFile?.fileName as string;

        let id = ipc.convert({
            file: fileName,
            extension,
            converterName
        });

        setTaskDialogId(id);
    }

    /*function test() {
        if (converters.length === 0) {
            let audio = new Audio("womp.mp3");
            audio.play();
        }
    }*/
    
    return (
        <>
            <Card style={{display: props.display}}>
                <CardContent>
                    <Grid container style={{display: "flex", gap: "10px"}}>
                        <Grid item xs={10} style={{display: "flex", gap: "10px"}}>
                            <Button onClick={() => {openFile()}} variant="contained">Select a file</Button>
                            <InputLabel style={{marginTop: "auto", marginBottom: "auto"}}>
                                {currentFile?.fileName ?? "Select File"}
                            </InputLabel>
                        </Grid>
                        <Grid item xs={10} style={{display: "flex", gap: "10px"}}>
                            <InputLabel style={{marginTop: "auto", marginBottom: "auto"}}>
                                Convert To:
                            </InputLabel>

                            <FormControl variant="filled" style={{minWidth: "150px"}}>
                                <InputLabel id="demo-simple-select-label">Format</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                >
                                    {
                                        converters.map(converter => 
                                            <MenuItem value={converter} onClick={() => setSelected(converter)}>{converter}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Button 
                            /*disabled={
                                selectedConverter == null || 
                                (taskDetails != null && !taskDetails.isComplete)
                            } */
                            disabled={
                                !selectedConverter
                            }
                            variant="contained" 
                            onClick={beginTask} 
                            fullWidth>Convert!
                        </Button>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}