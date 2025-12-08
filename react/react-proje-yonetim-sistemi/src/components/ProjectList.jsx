import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProjectsByUserId } from "../redux/slices/projectSlice";
import placeholderImage from "../files/placeholder-images/project-placeholder.jpg";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Pagination,
    CircularProgress,
    CardMedia,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", ""); 


function ProjectList() {
    const dispatch = useDispatch();

    const { projects, totalPages, loading } = useSelector((state) => state.project);
    const token = useSelector((state) => state.user.token);

    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(getProjectsByUserId({ pageNo: page, pageSize: 10, token }));
    }, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }



    return (
        <Box sx={{ px: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Projeler
            </Typography>

            <Grid container spacing={2}>
                {projects?.map((project) => (
                    <Grid key={project.projectId} item size={{ xs: 12, sm: 6, md: 6 }}>
                        <Card sx={{ p: 1 }}>
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
                                {/* Proje Adı */}
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {project.name}
                                </Typography>

                                {/* Açıklama */}
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

                                {/* Status */}
                                <Typography sx={{ mt: 1 }}>
                                    <b>Durum:</b> {project.status}
                                </Typography>

                                {/* Creator */}
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <b>Oluşturan:</b> {project.creator?.username}
                                </Typography>

                                {/* Created At */}
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <b>Oluşturulma:</b>{" "}
                                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                                </Typography>

                                {/* Progress */}
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <b>İlerleme:</b> %{project.progress}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
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
