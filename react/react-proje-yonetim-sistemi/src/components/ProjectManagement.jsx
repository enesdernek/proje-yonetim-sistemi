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
    CircularProgress,
    Slider,
    LinearProgress,
    Divider
} from "@mui/material";

import {
    cancelProject,
    onHoldProject,
    startProject,
    restartProject,
    getProjectById,
    updateProjectProgress
} from "../redux/slices/projectSlice";

function ProjectManagement() {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.user.token);
    const { project, loading } = useSelector((state) => state.project);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [progress, setProgress] = useState(0);
    const [progressLoading, setProgressLoading] = useState(false);

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

    useEffect(() => {
        if (project?.progress !== undefined) {
            setProgress(project.progress);
        }
    }, [project]);

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

    const handleProgressUpdate = async () => {
        setProgressLoading(true);

        const resultAction = await dispatch(
            updateProjectProgress({
                projectId,
                process: progress,
                token
            })
        );

        setProgressLoading(false);

        if (updateProjectProgress.rejected.match(resultAction)) {
            showSnackbar(
                resultAction.payload || "İlerleme güncellenemedi.",
                "error"
            );
            return;
        }

        showSnackbar("Proje ilerlemesi güncellendi.");
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
                                >
                                    Projeyi Başlat
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAction(cancelProject)}
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
                                >
                                    Beklemeye Al
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAction(cancelProject)}
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
                                >
                                    Projeyi Tekrar Başlat
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAction(cancelProject)}
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
                            >
                                Projeyi Tekrar Hayata Geçir
                            </Button>
                        )}
                    </Stack>

                    {["IN_PROGRESS", "ON_HOLD"].includes(project.status) && (
                        <>
                            <Divider sx={{ my: 3 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                gutterBottom
                            >
                                Proje İlerlemesi
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 10, borderRadius: 5, mb: 1 }}
                            />

                            <Typography
                                variant="body2"
                                align="right"
                                sx={{ mb: 2 }}
                            >
                                %{Math.round(progress)}
                            </Typography>

                            <Slider
                                value={progress}
                                onChange={(e, value) => setProgress(value)}
                                step={1}
                                min={0}
                                max={100}
                                valueLabelDisplay="auto"
                                disabled={progressLoading}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleProgressUpdate}
                                disabled={
                                    progressLoading ||
                                    progress === project.progress
                                }
                            >
                                {progressLoading
                                    ? "Güncelleniyor..."
                                    : "İlerlemeyi Güncelle"}
                            </Button>
                        </>
                    )}
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
