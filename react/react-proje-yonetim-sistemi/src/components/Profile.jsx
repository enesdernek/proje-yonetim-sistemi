import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Avatar, Typography, Stack, Chip,
  Divider, IconButton, Tooltip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuthenticatedUser, uploadProfilePicture, deleteProfilePicture } from '../redux/slices/userSlice';
import { getConnectionsPaged } from '../redux/slices/connectionSlice';
import userPlaceholderImage from "../files/placeholder-images/user-placeholder.jpg";


const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);
  const connections = useSelector((state) => state.connection.connections || []);
  const connectionLoading = useSelector((state) => state.connection.loading);

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getAuthenticatedUser({ token }));
      if (user?.userId) {
        dispatch(getConnectionsPaged({ token, userId: user.userId, pageNo: 1, pageSize: 50 }));
      }
    }
  }, [dispatch, token, user?.userId]);

  const handleOpenUploadDialog = () => setOpenUploadDialog(true);
  const handleCloseUploadDialog = () => {
    setSelectedFile(null);
    setOpenUploadDialog(false);
  };
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleUpload = () => {
    if (!selectedFile) return;
    dispatch(uploadProfilePicture({ file: selectedFile, token }))
      .unwrap()
      .then(() => {
        handleCloseUploadDialog();
        dispatch(getAuthenticatedUser({ token }));
      });
  };

  // --- Delete handlers ---
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleDelete = () => {
    dispatch(deleteProfilePicture({ token }))
      .unwrap()
      .then(() => {
        handleCloseDeleteDialog();
        dispatch(getAuthenticatedUser({ token }));
      });
  };

  if (!user) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Grid justifyContent="center" container>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={user.profileImageUrl ? BASE_URL + user.profileImageUrl : userPlaceholderImage}
                    alt={user.username}
                    sx={{ width: 150, height: 150, fontSize: 48 }}
                  >
                    {user.username?.slice(0, 2).toUpperCase()}
                  </Avatar>

                  <Tooltip title="Profil resmini değiştir">
                    <IconButton
                      onClick={handleOpenUploadDialog}
                      sx={{
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        bgcolor: 'background.paper',
                        boxShadow: 1
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Tooltip>

                  {user.profileImageUrl && (
                    <Tooltip title="Profil resmini kaldır">
                      <IconButton
                        onClick={handleOpenDeleteDialog}
                        sx={{
                          position: 'absolute',
                          bottom: -10,
                          left: -10,
                          bgcolor: 'background.paper',
                          boxShadow: 1
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              <Stack spacing={1} direction="column" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <Typography variant="h4">{user.username}</Typography>
                <Chip
                  icon={<LinkIcon />}
                  label={`${connections.length} bağlantı`}
                  sx={{
                    mt: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'primary.light', color: 'white' }
                  }}
                  onClick={() => navigate('/connections')}
                  disabled={connectionLoading}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" sx={{ minWidth: 100 }}>Kullanıcı adı:</Typography>
                  <Typography variant="body1">{user.username}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" sx={{ minWidth: 100 }}>E-posta:</Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" sx={{ minWidth: 100 }}>Telefon:</Typography>
                  <Typography variant="body1">{user.phone}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1" sx={{ minWidth: 100 }}>Katılma Tarihi:</Typography>
                  <Typography variant="body1">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
        <DialogTitle>Profil Resmi Yükle</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCameraIcon />}
            >
              Dosya Seç
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {selectedFile.name}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>İptal</Button>
          <Button variant="contained" onClick={handleUpload} disabled={!selectedFile}>
            Yükle
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Profil Resmini Sil</DialogTitle>
        <DialogContent>
          <Typography>Profil resmini silmek istediğinizden emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hayır</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
