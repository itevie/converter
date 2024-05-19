import { Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import TaskVisualiser from "./TaskVisualiser";

export let setTaskDialogId = (id: string) => {};

export default function TaskVisualiserDialogue() {
    const [currentID, setCurrentID] = useState<string | null>(null);
    const [shown, setShown] = useState<boolean>(false);

    useEffect(() => {
        setTaskDialogId = (id: string) => {
            setCurrentID(id);
            setShown(true);
        }
    }, []);

    function closeDialogue() {
        setShown(false);
        setCurrentID(null);
    }

    return (
        <Dialog open={shown}>
            {
                currentID 
                    ? <TaskVisualiser onDialogueClose={closeDialogue} isDialogue={true} taskId={currentID} />
                    : <></>
            }
        </Dialog>
    )
}