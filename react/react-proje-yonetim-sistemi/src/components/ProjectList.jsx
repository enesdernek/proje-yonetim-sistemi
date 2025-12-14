import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProjectsByUserId } from "../redux/slices/projectSlice";
import placeholderImage from "../files/placeholder-images/project-placeholder.jpg";
import { useNavigate } from "react-router-dom";


import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Pagination,
    CircularProgress,
    CardMedia,
    Button,
} from "@mui/material";
import { getProjectMemberByUserIdAndProjectId } from "../redux/slices/projectMemberSlice";
import AddIcon from '@mui/icons-material/Add';

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");


function ProjectList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { projects, totalPages, loading } = useSelector((state) => state.project);
    const token = useSelector((state) => state.user.token);
    const roles = useSelector((state) => state.projectMember.projectRoles || {});
    const user = useSelector((state) => state.user.user);

    const [page, setPage] = useState(1);

    const ROLE_LABELS = {
        MANAGER: "Yönetici",
        DEVELOPER: "Geliştirici",
        DESIGNER: "Tasarımcı",
        TESTER: "Test Uzmanı",
        MEMBER: "Üye",
    };

    const ROLE_COLORS = {
        MANAGER: "#1976d2",
        DEVELOPER: "#2e7d32",
        DESIGNER: "#6a1b9a",
        TESTER: "#ed6c02",
        MEMBER: "#616161",
    };

    const STATUS_LABELS = {
        PLANNING: "Planlanıyor",
        IN_PROGRESS: "Devam Ediyor",
        ON_HOLD: "Beklemede",
        CANCELLED: "İptal Edildi",
        COMPLETED: "Tamamlandı",
    };

    const STATUS_COLORS = {
        PLANNING: "#1976d2",
        IN_PROGRESS: "#2e7d32",
        ON_HOLD: "#ed6c02",
        CANCELLED: "#d32f2f",
        COMPLETED: "#6a1b9a",
    };

    useEffect(() => {
        dispatch(getProjectsByUserId({ pageNo: page, pageSize: 10, token }));
    }, [page]);

    useEffect(() => {
        if (projects?.length > 0) {
            projects.forEach((project) => {
                dispatch(getProjectMemberByUserIdAndProjectId({
                    userId: user.userId,
                    projectId: project.projectId,
                    token
                }));
            });
        }
    }, [projects]);

    useEffect(() => {
        console.log(roles)
    }, [roles])

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ px: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Projeler
                </Typography>

                <Button
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "none" }}
                    onClick={() => navigate("/projects/create-project")}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Yeni Proje Oluştur
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} >
                    {projects?.map((project) => {
                        const role = roles?.[project.projectId];

                        return (
                            <Grid key={project.projectId} item size={{ xs: 12, sm: 6, md: 6 }}>
                                <Card
                                    sx={{
                                        p: 1,
                                        cursor: "pointer",
                                        transition: "0.2s ease",
                                        "&:hover": {
                                            boxShadow: 4,
                                            transform: "scale(1.01)",
                                            backgroundColor: "rgba(0,0,0,0.03)",
                                        }
                                    }}
                                    onClick={() => navigate(`/projects/${project.projectId}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="170"
                                        image={
                                            project.projectImageUrl
                                                ? BASE_URL + project.projectImageUrl
                                                : placeholderImage
                                        }
                                        alt={project.name}
                                        sx={{ borderRadius: 1 }}
                                    />

                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {project.name}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {project.description}
                                        </Typography>

                                        <Typography sx={{ mt: 1 }}>
                                            <b>Durum:</b>{" "}
                                            <span
                                                style={{
                                                    color:
                                                        STATUS_COLORS[project.status] ??
                                                        "#000",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {STATUS_LABELS[project.status] ??
                                                    project.status}
                                            </span>
                                        </Typography>

                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <b>Oluşturan:</b> {project.creator?.username}
                                        </Typography>

                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <b>Oluşturulma:</b>{" "}
                                            {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                                        </Typography>

                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <b>İlerleme:</b> %{project.progress}
                                        </Typography>

                                        <Typography sx={{ mt: 1 }}>
                                            <b>Rolün: </b>
                                            {role ? (
                                                <span
                                                    style={{
                                                        color:
                                                            ROLE_COLORS[role] ||
                                                            "#616161",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {ROLE_LABELS[role] || role}
                                                </span>
                                            ) : (
                                                <span style={{ color: "#9e9e9e" }}>
                                                    Yükleniyor...
                                                </span>
                                            )}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}

                </Grid>
            )}

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
}

export default ProjectList;

