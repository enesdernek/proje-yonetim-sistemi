import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    cancelProject,
    onHoldProject,
    startProject,
    restartProject,
    getProjectById
} from "../redux/slices/projectSlice";

function ProjectManagement() {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.user.token);
    const { project, loading } = useSelector((state) => state.project);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const STATUS_LABELS = {
        PLANNING: "Planlanıyor",
        IN_PROGRESS: "Devam Ediyor",
        ON_HOLD: "Beklemede",
        CANCELLED: "İptal Edildi",
        COMPLETED: "Tamamlandı",
    };

    useEffect(() => {
        if (token) {
            dispatch(getProjectById({ projectId, token }));
        }
    }, [dispatch, projectId, token]);

    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleAction = async (actionThunk) => {
        const resultAction = await dispatch(
            actionThunk({ projectId, token })
        );

        if (actionThunk.rejected.match(resultAction)) {
            showSnackbar(
                resultAction.payload || "İşlem sırasında hata oluştu.",
                "error"
            );
            return;
        }

        showSnackbar("İşlem başarıyla tamamlandı.");
    };

    if (loading || !project) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Proje Durum Yönetimi
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 3 }}>
                        <strong>Mevcut Durum:</strong>{" "}
                        <span style={{ color: "#1976d2", fontWeight: 600 }}>
                            {STATUS_LABELS[project.status] || project.status}
                        </span>
                    </Typography>

                    <Stack direction="row" spacing={2} flexWrap="wrap">

                        {project.status === "PLANNING" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAction(startProject)}
                                    sx={{ textTransform: "none" }}
                                >
                                    Projeyi Başlat
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAction(cancelProject)}
                                    sx={{ textTransform: "none" }}

                                >
                                    Projeyi İptal Et
                                </Button>
                            </>
                        )}

                        {project.status === "IN_PROGRESS" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleAction(onHoldProject)}
                                    sx={{ textTransform: "none" }}

                                >
                                    Beklemeye Al
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAction(cancelProject)}
                                    sx={{ textTransform: "none" }}

                                >
                                    Projeyi İptal Et
                                </Button>
                            </>
                        )}

                        {project.status === "ON_HOLD" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAction(restartProject)}
                                    sx={{ textTransform: "none" }}

                                >
                                    Projeyi Tekrar Başlat
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAction(cancelProject)}
                                    sx={{ textTransform: "none" }}


                                >
                                    Projeyi İptal Et
                                </Button>
                            </>
                        )}

                        {project.status === "CANCELLED" && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleAction(restartProject)}
                                sx={{ textTransform: "none" }}

                            >
                                Projeyi Tekrar Hayata Geçir
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snackbarSeverity}
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ProjectManagement;
