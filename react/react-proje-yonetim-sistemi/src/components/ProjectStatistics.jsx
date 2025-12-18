import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Divider,
  Stack,
  Avatar,
  CircularProgress
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getProjectStatisticsById, clearProjectStatistics } from "../redux/slices/projectStatisticsSlice";

import userPlaceholderImage from "../files/placeholder-images/user-placeholder.jpg";


const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");


function ProjectStatistics() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const { stats, loading, error } = useSelector((state) => state.projectStatistics);

  useEffect(() => {
    if (projectId && token) {
      dispatch(getProjectStatisticsById({ projectId, token }));
    }

    return () => {
      dispatch(clearProjectStatistics());
    };
  }, [projectId, token, dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );
  }

  if (!stats) return null;

  const pieData = [
    { name: "Tamamlanan Görevler", value: stats.completedTasks },
    { name: "Bekleyen Görevler", value: stats.pendingTasks }
  ];
  const COLORS = ["#4caf50", "#f44336"];

  return (
    <Box sx={{ maxWidth: "auto", mx: 2 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {stats.projectDto.name} - İstatistikler
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {stats.projectDto.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={600}>
            Proje İlerlemesi
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stats.completionRate}
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />
          <Typography variant="body2" align="right" sx={{ mb: 2 }}>
            %{Math.round(stats.completionRate)}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1, minHeight: 250 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Görev Durumu
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Proje Bilgileri
              </Typography>

              <Stack spacing={1}>
                <Typography>
                  <strong>Toplam Görev:</strong> {stats.totalTasks}
                </Typography>
                <Typography>
                  <strong>Tamamlanan Görev:</strong> {stats.completedTasks}
                </Typography>
                <Typography>
                  <strong>Bekleyen Görev:</strong> {stats.pendingTasks}
                </Typography>
                <Typography>
                  <strong>Toplam Üye:</strong> {stats.totalMembers}
                </Typography>

                <Typography sx={{ mt: 2, fontWeight: 600 }}>Proje Oluşturan:</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={
                      stats.projectDto.creator.profileImageUrl
                        ? BASE_URL + stats.projectDto.creator.profileImageUrl
                        : userPlaceholderImage
                    }
                  >
                    {!stats.projectDto.creator.profileImageUrl &&
                      stats.projectDto.creator.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography>{stats.projectDto.creator.username}</Typography>
                    <Typography variant="body2">{stats.projectDto.creator.email}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProjectStatistics;
