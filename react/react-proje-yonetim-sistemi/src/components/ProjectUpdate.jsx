import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  getProjectById,
  updateProject,
  uploadProjectImage,
  deleteProjectImage,
} from "../redux/slices/projectSlice";

import projectPlaceholder from "../files/placeholder-images/project-placeholder.jpg";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");

function ProjectUpdate() {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const { project, loading, error } = useSelector((state) => state.project);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (projectId && token) {
      dispatch(getProjectById({ projectId, token }));
    }
  }, [dispatch, projectId, token]);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
    }
  }, [project]);

  const handleUpdateProject = async () => {
    if (name.trim().length < 2 || description.trim().length < 8) {
      setFormError("Proje adı en az 2, açıklama en az 8 karakter olmalıdır.");
      return;
    }

    setFormError("");

    const resultAction = await dispatch(
      updateProject({
        projectId,
        projectDtoIU: { name, description },
        token,
      })
    );

    if (updateProject.fulfilled.match(resultAction)) {
      showSnackbar("Proje bilgileri başarıyla güncellendi.");
    } else {
      showSnackbar(
        resultAction.payload || "Proje güncellenirken hata oluştu.",
        "error"
      );
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    e.target.value = null;

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showSnackbar("Sadece resim dosyaları yüklenebilir.", "error");
      return;
    }

    const resultAction = await dispatch(
      uploadProjectImage({
        projectId,
        file,
        token,
      })
    );

    if (uploadProjectImage.fulfilled.match(resultAction)) {
      showSnackbar("Proje resmi başarıyla güncellendi.");
    } else {
      showSnackbar(
        resultAction.payload || "Resim yüklenirken hata oluştu.",
        "error"
      );
    }
  };

  // 🔹 Resim sil
  const handleDeleteImage = async () => {
    const resultAction = await dispatch(
      deleteProjectImage({
        projectId,
        token,
      })
    );

    if (deleteProjectImage.fulfilled.match(resultAction)) {
      showSnackbar("Proje resmi başarıyla silindi.");
    } else {
      showSnackbar(
        resultAction.payload || "Resim silinirken hata oluştu.",
        "error"
      );
    }
  };

  if (loading && !project) {
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
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Proje Ayarları
          </Typography>

          {/* 🔹 PROJE BİLGİLERİ */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
            Proje Bilgileri
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Proje Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Proje Açıklaması"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={4}
              fullWidth
            />

            {formError && (
              <Typography color="error">{formError}</Typography>
            )}

            <Button
              variant="contained"
              onClick={handleUpdateProject}
              sx={{ alignSelf: "flex-start", textTransform: "none" }}
            >
              Bilgileri Güncelle
            </Button>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Typography variant="subtitle1" fontWeight={600}>
            Proje Resmi
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <img
              src={
                project.projectImageUrl
                  ? BASE_URL + project.projectImageUrl
                  : projectPlaceholder
              }
              alt="Project"
              style={{
                width: "100%",
                maxHeight: 250,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <Button variant="contained" component="label" sx={{ textTransform: "none" }}>
              {project.projectImageUrl ? "Resmi Değiştir" : "Resim Yükle"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            {project.projectImageUrl && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteImage}
                sx={{ textTransform: "none" }}
              >
                Resmi Sil
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
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProjectUpdate;
