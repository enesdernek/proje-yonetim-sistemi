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
        <Box  sx={{ px: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Projeler
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} >
                    {projects?.map((project) => (
                        <Grid key={project.projectId} item size={{ xs: 12, sm: 6, md: 6 }} >
                            <Card
                                sx={{ p: 1, cursor: "pointer" }}
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

                                <CardContent >
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
                                        <b>Durum:</b> {project.status}
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
                                        <b>Rol: </b>
                                        <Button
                                            sx={{
                                                paddingX: "3px",
                                                pointerEvents: "none",
                                                opacity: 1,
                                                "&.Mui-disabled": {
                                                    backgroundColor: (theme) => theme.palette.warning.main,
                                                    color: "#fff",
                                                },
                                            }}
                                            disabled
                                            color="warning"
                                            variant="contained"
                                        >
                                            {roles?.[project.projectId] ?? "Yükleniyor..."}
                                        </Button>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
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

