import { useEffect, useState } from "react";
import { tasks } from "..";
import TaskVisualiser from "../Components/TaskVisualiser";
import { Box } from "@mui/material";

export default function Tasks(props: {display: string}) {
    const [_tasks, setTasks] = useState<string[]>([]);

    useEffect(() => {
        setInterval(() => {
            setTasks(Array.from(tasks.keys()));
            console.log("update");
        }, 100);
    }, []);

    return (
        <Box style={{display: props.display}}>
            {
                _tasks.map(task => 
                    <TaskVisualiser taskId={task}></TaskVisualiser>
                )
            }
        </Box>
    );
}