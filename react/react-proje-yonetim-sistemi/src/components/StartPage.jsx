import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import CountUp from 'react-countup';
import GroupsIcon from '@mui/icons-material/Groups';
import TaskIcon from '@mui/icons-material/Checklist';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate } from 'react-router-dom';
import { getUserInfos } from '../redux/slices/userSlice';

function StartPage() {

  const userStats = useSelector((state) => state.user.userStats);
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      dispatch(getUserInfos({ token }))
    }
  }, [dispatch, token])

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' }}>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Proje Yönetim Sistemi
        </Typography>
        <Typography variant="h5" sx={{ color: '#555' }}>
          Hoşgeldiniz! Dashboard üzerinden projelerinizi, görevlerinizi ve bağlantılarınızı hızlıca görüntüleyebilirsiniz.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            onClick={() => navigate("/projects")}
            sx={{
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'translateY(-10px)', boxShadow: 6, cursor: "pointer" }
            }}

          >
            <CardContent sx={{ textAlign: 'center' }}>
              <GroupsIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h5" gutterBottom>Toplam Projeler</Typography>
              <Typography variant="h3">
                <CountUp end={userStats?.totalProjectMemberships || 0} duration={0.25} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            onClick={() => navigate("/tasks")}
            sx={{
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'translateY(-10px)', boxShadow: 6, cursor: "pointer" }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <TaskIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h5" gutterBottom>Toplam Görevler</Typography>
              <Typography variant="h3">
                <CountUp end={userStats?.totalTasks || 0} duration={0.25} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            onClick={() => navigate("/connections")}
            sx={{
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f57c00, #ffb74d)',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { transform: 'translateY(-10px)', boxShadow: 6, cursor: "pointer" }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <LinkIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h5" gutterBottom>Toplam Bağlantılar</Typography>
              <Typography variant="h3">
                <CountUp end={userStats?.totalConnections || 0} duration={0.25} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}

export default StartPage;
