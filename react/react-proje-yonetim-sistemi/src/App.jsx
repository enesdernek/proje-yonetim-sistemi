import { use, useEffect, useState } from 'react';
import './App.css'
import Header from './layout/Header'
import MainContent from './layout/MainContent'
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearMessage, clearSuccessMessage } from './redux/slices/userSlice';


function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const error = useSelector(state => state.user.error);
  const successMessage = useSelector(state => state.user.successMessage);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage())
    dispatch(clearSuccessMessage())
  }, [navigate])

  return (
    <>
      <Header onMenuClick={toggleDrawer} />
      <MainContent drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </>
  )
}


export default App
