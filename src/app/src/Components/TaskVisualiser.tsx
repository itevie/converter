import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ipc, { TaskUpdate } from "../ipc";
import { tasks } from "..";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

export default function TaskVisualiser(props: {taskId: string, isDialogue?: boolean, onDialogueClose?: () => void}) {
    const [taskDetails, setTaskDetails] = useState<TaskUpdate | null>(null);

    useEffect(() => {
        let timer = setInterval(() => {
            let details = structuredClone(tasks.get(props.taskId));
            if (details) {
                details.details.fileName = details?.details.fileName.split(/[/\\]/g)[details?.details.fileName.split(/[/\\]/g).length - 1]
                setTaskDetails(details);
                if (details.isComplete === true) {
                    clearInterval(timer);
                }
            }
        }, 50);
    }, [props.taskId]);

    function deleteFile() {
        if (taskDetails?.finishedDetails) {
            ipc.deleteFile({ 
                fileName: taskDetails.finishedDetails.fileName,
                taskID: taskDetails.details.taskID
            });
            setTaskDetails(null);
        }
    }

    function openFile() {
        if (taskDetails?.finishedDetails) {
            ipc.openFileExternally(taskDetails.finishedDetails.fileName,);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">
                    Converting {taskDetails?.details.fileName ?? "<No File Name>"} to {taskDetails?.details.toFileType ?? ".notsure"}
                </Typography>
                <Typography variant="subtitle1">
                    Using {taskDetails?.details.converter}
                </Typography>
                <LinearProgressWithLabel variant={!taskDetails?.percentComplete ? "indeterminate" : "determinate"} value={taskDetails?.percentComplete ?? 0} />
                <Grid container justifyContent="space-between">
                    <Button style={{opacity: props.isDialogue ? "100%" : "0%"}} onClick={props.onDialogueClose}>Close</Button>
                    <Grid justifyContent="flex-end">
                        <Button disabled={taskDetails == null || !taskDetails?.isComplete} onClick={() => {deleteFile(); if (props.onDialogueClose) props.onDialogueClose();}} color="error">Delete</Button>
                        <Button disabled={taskDetails == null || !taskDetails?.isComplete} onClick={openFile}>Open...</Button>
                        <Button disabled={taskDetails == null || !taskDetails?.isComplete} >Save To...</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}