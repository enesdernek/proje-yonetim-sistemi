import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StartPage from './StartPage';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Box, Container, Drawer, Grid } from '@mui/material';
import Profile from './Profile';

function MainPage({ drawerOpen, toggleDrawer }) {

  return (
    <Box sx={{ height: "auto", overflow: "hidden" }}>

      <Grid  container sx={{ width: "100%" }}>

        {/* Desktop Sidebar */}
        <Grid
          sx={{
            display: { xs: "none", md: "block" },
          }}
          size={{ md:2 }}

        >
          <Sidebar />
        </Grid>

        {/* Content */}
        <Grid
          size={{ xs: 12, sm:12,md:10}}
        >
          <Box sx={{ mt: 2}}>

            <Outlet />

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
