import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjectById } from "../redux/slices/projectSlice";
import { getProjectMemberByUserIdAndProjectId, getProjectMembers } from "../redux/slices/projectMemberSlice";
import placeholderImage from "../files/placeholder-images/project-placeholder.jpg";
import userPlaceholderImage from "../files/placeholder-images/user-placeholder.jpg";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");

import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Divider,
    Stack,
    Chip,
    Button
} from "@mui/material";

function Project() {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { project, loading, error } = useSelector((state) => state.project);
    const token = useSelector((state) => state.user.token);
    const userId = useSelector((state) => state.user.user?.userId);
    const projectRoles = useSelector((state) => state.projectMember.projectRoles);
    const members = useSelector((state) => state.projectMember.members);

    const userRole = projectRoles?.[projectId];

    useEffect(() => {
        dispatch(getProjectMembers({ projectId, token }));
    }, [dispatch, projectId, token])

    useEffect(() => {
        console.log(members)
    }, [members])

    useEffect(() => {
        if (token) {
            dispatch(getProjectById({ projectId, token }));
        }

        if (token && userId) {
            dispatch(
                getProjectMemberByUserIdAndProjectId({
                    userId,
                    projectId,
                    token,
                })
            );
        }
    }, [dispatch, projectId, token, userId]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>
                {error}
            </Typography>
        );
    }

    if (!project) return null;

    return (
        <Box sx={{ mx: "auto", mt: 4, px: 2 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                {/* 🔹 Proje Resmi */}
                <CardMedia
                    component="img"
                    height="260"
                    image={
                        project.projectImageUrl
                            ? BASE_URL + project.projectImageUrl
                            : placeholderImage
                    }
                    alt="Project Image"
                    sx={{
                        objectFit: "cover",
                    }}
                />

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            {project.name}
                        </Typography>

                        {userRole === "MANAGER" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button variant="contained" color="primary" sx={{ textTransform: "none" }}>
                                    <EditCalendarIcon sx={{ mr: 1 }} />Projeyi Güncelle
                                </Button>

                                <Button variant="contained" color="secondary" sx={{ textTransform: "none" }}>
                                    <SettingsIcon sx={{ mr: 1 }} /> Proje Ayarları
                                </Button>

                            </Box>
                        )}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {userRole && (
                            <Chip label={`Rolün: ${userRole}`} color="secondary" sx={{ mt: 1 }} />
                        )}
                        <Chip label={project.status} color="primary" />
                        <Chip label={`İlerleme: %${project.progress}`} variant="outlined" />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {project.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                        <Typography variant="body2">
                            <strong>Başlangıç:</strong>{" "}
                            {project.startDate ? project.startDate.split("T")[0] : "-"}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Bitiş:</strong>{" "}
                            {project.endDate ? project.endDate.split("T")[0] : "-"}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Oluşturan:</strong> {project.creator?.username}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Oluşturulma:</strong> {project.createdAt.split("T")[0]}
                        </Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Proje Üyeleri
                        {
                            userRole === "MANAGER" && (
                                <Button variant="contained" color="success" sx={{ textTransform: "none", ml: 1, padding: "5px", paddingRight: "10px" }}>
                                    <AddIcon sx={{ mr: 0 }} /> Üye Ekle
                                </Button>)
                        }

                    </Typography>

                    <Stack spacing={1}>
                        {members?.map((m) => (
                            <Card
                                onClick={() => navigate("/users-profile/" + m.userDto.userId)}
                                key={m.memberId}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    boxShadow: 1,
                                    cursor: "pointer",
                                    transition: "0.2s ease",
                                    "&:hover": {
                                        boxShadow: 4,
                                        transform: "scale(1.01)",
                                        backgroundColor: "rgba(0,0,0,0.03)",
                                    }
                                }}
                            >
                                {/* Profil resmi */}
                                <CardMedia
                                    component="img"
                                    image={
                                        m.userDto.profileImageUrl
                                            ? BASE_URL + m.userDto.profileImageUrl
                                            : userPlaceholderImage
                                    }
                                    alt="User Avatar"
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    {/* Username */}
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {m.userDto.username}
                                    </Typography>

                                    {/* Projedeki Rol */}
                                    <Chip
                                        label={`Rol: ${m.role}`}
                                        color="secondary"
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />

                                    {/* Katılma Tarihi */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Katıldı: {m.joinedAt.split("T")[0]}
                                    </Typography>
                                </Box>

                                {/* Manager için üye yönetim butonları (SAĞDA) */}
                                {userRole === "MANAGER" && (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            ml: "auto",
                                        }}
                                        onClick={(e) => e.stopPropagation()} // Kart açılmasını engelle
                                    >
                                        <Button variant="contained" color="info" size="small" sx={{ textTransform: "none" }}>
                                            Yetki Değiştir
                                        </Button>

                                        <Button variant="contained" color="error" size="small" sx={{ textTransform: "none" }}>
                                            Üyeyi Sil
                                        </Button>
                                    </Stack>
                                )}

                            </Card>
                        ))}
                    </Stack>

                </CardContent>


            </Card>
        </Box>
    );
}

export default Project;
