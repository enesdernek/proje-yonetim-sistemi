import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";

import { createProject } from "../redux/slices/projectSlice";

function ProjectCreate() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.user.token);
    const loading = useSelector((state) => state.project.loading);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const [error, setError] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const NAME_MIN = 2;
    const NAME_MAX = 128;
    const DESC_MIN = 8;
    const DESC_MAX = 1024;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || !trimmedDescription) {
            setError("Proje adı ve açıklama zorunludur.");
            setSnackbarOpen(true);
            return;
        }

        if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
            setError(`Proje adı ${NAME_MIN} ile ${NAME_MAX} karakter arasında olmalıdır.`);
            setSnackbarOpen(true);
            return;
        }

        if (trimmedDescription.length < DESC_MIN || trimmedDescription.length > DESC_MAX) {
            setError(`Proje açıklaması ${DESC_MIN} ile ${DESC_MAX} karakter arasında olmalıdır.`);
            setSnackbarOpen(true);
            return;
        }

        const resultAction = await dispatch(
            createProject({
                projectDtoIU: {
                    name: trimmedName,
                    description: trimmedDescription
                },
                file,
                token,
            })
        );

        if (createProject.rejected.match(resultAction)) {
            setError(resultAction.payload || "Proje oluşturulamadı.");
            setSnackbarOpen(true);
            return;
        }

        const createdProject = resultAction.payload;
        navigate(`/projects/${createdProject.projectId}`);
    };


    return (
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight={600} mb={3}>
                        Yeni Proje Oluştur
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            label="Proje Adı"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: NAME_MAX }}
                            helperText={`${name.length}/${NAME_MAX}`}
                        />

                        <TextField
                            label="Proje Açıklaması"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            multiline
                            minRows={4}
                            inputProps={{ maxLength: DESC_MAX }}
                            helperText={`${description.length}/${DESC_MAX}`}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{ textTransform: "none" }}

                        >
                            Proje Resmi Seç (Opsiyonel)
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>

                        {file && (
                            <Typography variant="body2" color="text.secondary">
                                Seçilen dosya: {file.name}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ textTransform: "none" }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Projeyi Oluştur"
                            )}
                        </Button>
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
                    severity="error"
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ProjectCreate;
