import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Avatar, Badge, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/slices/userSlice';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import usersPlaceholderImage from "../files/placeholder-images/user-placeholder.jpg";


const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", ""); // http://localhost:8080

export default function MenuAppBar({ onMenuClick }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)

  const logOutFunc = () => {
    handleClose()
    dispatch(logOut())
    navigate("/authenticate")
  }


  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const navigateToProfilePage = () => {
    handleClose();
    navigate("/profile");
  }

  const navigateToAccountSettingsPage = () => {
    handleClose();
    navigate("/account-settings");
  }

  const connectionRequests = useSelector(
    (state) => state.connectionRequest.recievedConnectionRequests || []
  );

  const pendingRequestCount = connectionRequests.filter(
    (req) => req.status === "PENDING"
  ).length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }} // xs’de görünür, md ve üstü gizli
            onClick={onMenuClick}  // Drawer açma fonksiyonu
          >
            <MenuIcon />
          </IconButton>
          <Typography onClick={() => navigate("/")} variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Proje Yönetim Sistemi
          </Typography>

          {
            isAuthenticated ? (
              <div>
                <IconButton
                  size="medium"
                  onClick={() => navigate("/connection-requests")}
                  color="inherit"
                >
                  <Badge badgeContent={pendingRequestCount} color="error">
                    <PersonAddIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="medium"
                  onClick={() => navigate("/search-user")}
                  color="inherit"
                >
                  <PersonSearchIcon />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    src={user.profileImageUrl ? BASE_URL + user.profileImageUrl : usersPlaceholderImage}
                    alt={user.username}
                    sx={{ width: 32, height: 32, fontSize: 48 }}
                  >
                    {user.username?.slice(0, 2).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={navigateToProfilePage}>Profil</MenuItem>
                  <MenuItem onClick={navigateToAccountSettingsPage}>Ayarlar</MenuItem>
                  <MenuItem onClick={() => logOutFunc()}>Çıkış Yap</MenuItem>
                </Menu>
              </div>
            )
              :
              (
                <Button onClick={() => navigate("/authenticate")} variant='contained' color="success">Giriş Yap</Button>

              )
          }

        </Toolbar>
      </AppBar>
    </Box >
  );
}
