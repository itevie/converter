import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import ipc, { TaskUpdate } from './ipc';
import TaskVisualiserDialogue from './Components/TaskVisualiserDialogue';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TaskVisualiserDialogue />
    <App />
  </React.StrictMode>
);

export let tasks: Map<string, TaskUpdate> = new Map();
ipc.taskUpdateEvent(data => {
  tasks.set(data.details.taskID, data);
});

ipc.taskDeleteEvent(data => {
  tasks.delete(data);
});