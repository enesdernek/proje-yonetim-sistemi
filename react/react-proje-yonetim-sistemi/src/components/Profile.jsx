import React, { useEffect } from 'react'
import { Box, Card, CardContent, Avatar, Typography, Stack, Chip, Divider, IconButton, Tooltip, Grid } from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LinkIcon from '@mui/icons-material/Link'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthenticatedUser } from '../redux/slices/userSlice';

export default function Profile() {

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    if (token) {
      dispatch(getAuthenticatedUser({ token }))

    }
  }, [dispatch, token])

  return (
    <Box sx={{ p: 2 }}>
      <Grid justifyContent="center" container >
        <Grid size={{ xs: 12, md: 6 }}>
          {
            user && (
              <Card >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mb: 3 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar alt="Enes Dernek" sx={{ width: 150, height: 150, fontSize: 48 }}>ED</Avatar>
                      <Tooltip title="Profil resmini değiştir">
                        <IconButton sx={{ position: 'absolute', bottom: -10, right: -10, bgcolor: 'background.paper', boxShadow: 1 }}>
                          <PhotoCameraIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Stack spacing={1} direction="column" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                    <Typography variant="h4">{user.username}</Typography>
                    <Chip icon={<LinkIcon />} label={`128 bağlantı`} sx={{ mt: 1 }} />
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
                      <Typography variant="body1">  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )
          }

        </Grid>
      </Grid>
    </Box>
  )
}