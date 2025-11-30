import { useState } from 'react';
import './App.css'
import Header from './layout/Header'
import MainContent from './layout/MainContent'
import { Box } from '@mui/material';


function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <Header onMenuClick={toggleDrawer} />
      <MainContent drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </>
  )
}


export default App
