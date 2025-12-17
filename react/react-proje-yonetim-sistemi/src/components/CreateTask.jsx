import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../redux/slices/taskSlice";
import { getProjectMembers } from "../redux/slices/projectMemberSlice";

function CreateTask() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projectId, assignedMemberId } = useParams();
  const token = useSelector((state) => state.user.token);

  const { loading } = useSelector((state) => state.task);
  const { members } = useSelector((state) => state.projectMember);

  const assignedMember = members?.find(
    (m) => String(m.memberId) === String(assignedMemberId)
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    startDate: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (projectId && token) {
      dispatch(getProjectMembers({ projectId, token }));
    }
  }, [dispatch, projectId, token]);

  const validate = () => {
    const newErrors = {};

    if (!form.title || form.title.length < 2 || form.title.length > 64) {
      newErrors.title = "Başlık 2–64 karakter arasında olmalıdır.";
    }

    if (
      !form.description ||
      form.description.length < 2 ||
      form.description.length > 512
    ) {
      newErrors.description = "Açıklama 2–512 karakter arasında olmalıdır.";
    }

    if (form.startDate && form.dueDate && form.startDate > form.dueDate) {
      newErrors.dueDate = "Bitiş tarihi başlangıç tarihinden önce olamaz.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const taskDtoIU = {
      title: form.title,
      description: form.description,
      status: "TODO",
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
      assignedMemberId: Number(assignedMemberId),
      projectId: Number(projectId),
    };

    try {
      await dispatch(createTask({ taskDtoIU, token })).unwrap();

      setSnackbar({
        open: true,
        message: "Görev başarıyla oluşturuldu",
        severity: "success",
      });

      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 1500);
    } catch (errMessage) {
      setSnackbar({
        open: true,
        message: errMessage,
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 5,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {assignedMember
            ? `Görev verilecek proje üyesi: ${assignedMember.userDto?.username}`
            : "Görev oluşturuluyor..."}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Görev Başlığı"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
            />

            <TextField
              label="Açıklama"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              multiline
              rows={4}
              required
            />

            <TextField
              type="date"
              label="Başlangıç Tarihi"
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />

            <TextField
              type="date"
              label="Bitiş Tarihi"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
              error={!!errors.dueDate}
              helperText={errors.dueDate}
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {loading ? "Oluşturuluyor..." : "Görev Oluştur"}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateTask;
