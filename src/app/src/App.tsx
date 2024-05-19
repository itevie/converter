import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import Convert from './pages/Convert';
import SettingsIcon from '@mui/icons-material/Settings';
import TaskIcon from '@mui/icons-material/Checklist';
import Tasks from './pages/Tasks';

function App() {
  const [page, setPage] = useState<string>("convert");

  function updatePage(whatTo: string) {
    setPage(whatTo);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            File Converter
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" onClick={() => updatePage("convert")}>Converter</Button>
            <Button color="inherit" onClick={() => updatePage("download")}>Downloader</Button>
          </Box>
          <IconButton color="inherit" onClick={() => updatePage("tasks")}>
            <TaskIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Convert display={page === "convert" ? "block" : "none"} />
      <Tasks display={page === "tasks" ? "block" : "none"} />
    </Box>
  );
}

export default App;
