import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StartPage from './StartPage';
import { Route, Routes } from 'react-router-dom';
import { Box, Container, Drawer, Grid } from '@mui/material';

function MainPage({ drawerOpen, toggleDrawer }) {

  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>

      <Grid spacing={2} container sx={{ width: "100%", height: "100vh" }}>

        {/* Desktop Sidebar */}
        <Grid
          item
          sx={{
            display: { xs: "none", md: "block" },
            height: "100%"
          }}
          size={{ xs: 2 }}

        >
          <Sidebar />
        </Grid>

        {/* Content */}
        <Grid
          item
          size={{ xs: 10 }}
        >
          <Box sx={{ mt: 2 }}>

            <Routes>
              <Route path="/" element={<StartPage />} />
            </Routes>
          </Box >
        </Grid>

      </Grid>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: 240 } }}
      >
        <Sidebar />
      </Drawer>

    </Box>
  );
}

export default MainPage;
