import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Box, Select, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow,
  Avatar, Button, TableContainer, Paper, Pagination,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, Snackbar, Alert
} from "@mui/material";
import {
  getAllProjectMembersTasksByProject,
  deleteTask,
  updateTask,
  changeTaskStatusToDone
} from "../redux/slices/taskSlice";
import userPlaceholderImage from "../files/placeholder-images/user-placeholder.jpg";
import { getProjectMemberByMemberIdAndProjectId } from "../redux/slices/projectMemberSlice";
import AddIcon from '@mui/icons-material/Add';
import { useTheme, useMediaQuery } from "@mui/material";


const statusMap = { TODO: "Yapılacak", IN_PROGRESS: "Devam Ediyor", REVIEW: "İnceleniyor", DONE: "Tamamlandı" };
const statusColorMap = { TODO: "#E1C9E8", IN_PROGRESS: "#FFF5BA", REVIEW: "#BAE1FF", DONE: "#D4FFD4" };

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");



function ProjectMembersTasks() {
  const { projectId, memberId } = useParams();
  const token = useSelector(state => state.user.token);
  const { tasks, totalPages, loading } = useSelector(state => state.task);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: "", description: "", startDate: "", dueDate: "" });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchTasks = () => {
    dispatch(getAllProjectMembersTasksByProject({
      projectId,
      assignedMemberId: memberId,
      pageNo: page,
      pageSize: 10,
      token
    }));
  };

  const { projectMember, loading: memberLoading } = useSelector(
    state => state.projectMember
  );

  useEffect(() => { fetchTasks(); }, [dispatch, projectId, memberId, page, token]);

  useEffect(() => {
    if (memberId && projectId && token) {
      dispatch(
        getProjectMemberByMemberIdAndProjectId({
          memberId: Number(memberId),
          projectId: Number(projectId),
          token,
        })
      );
    }
  }, [dispatch, memberId, projectId, token]);

  const handlePageChange = (event, value) => setPage(value);
  const handleStatusChange = (e) => { setStatusFilter(e.target.value); setPage(1); };

  const filteredTasks = tasks
    .filter(task => !statusFilter || task.status === statusFilter);

  const openDeleteDialog = (task) => { setSelectedTask(task); setDeleteDialogOpen(true); };
  const closeDeleteDialog = () => { setSelectedTask(null); setDeleteDialogOpen(false); };
  const confirmDeleteTask = async () => {
    if (selectedTask) {
      try {
        await dispatch(deleteTask({ taskId: selectedTask.taskId, token })).unwrap();
        setSnackbarMessage("Görev başarıyla silindi!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        closeDeleteDialog();
        fetchTasks();
      } catch (err) {
        setSnackbarMessage(err || "Görev silinirken hata oluştu!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleApproveTask = async (taskId) => {
    try {
      await dispatch(changeTaskStatusToDone({ taskId, token })).unwrap();
      setSnackbarMessage("Görev başarıyla tamamlandı!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchTasks();
    } catch (err) {
      setSnackbarMessage(err || "Görev durumu güncellenirken hata oluştu!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const openUpdateDialog = (task) => {
    setSelectedTask(task);
    setUpdateForm({
      title: task.title || "",
      description: task.description || "",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });
    setFormErrors({});
    setUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => { setSelectedTask(null); setUpdateDialogOpen(false); setFormErrors({}); };
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };
  const validateForm = () => {
    const errors = {};
    if (!updateForm.title || updateForm.title.trim().length < 2 || updateForm.title.length > 64) errors.title = "Başlık 2-64 karakter arasında olmalıdır.";
    if (!updateForm.description || updateForm.description.trim().length < 2 || updateForm.description.length > 512) errors.description = "Açıklama 2-512 karakter arasında olmalıdır.";
    if (!updateForm.startDate) errors.startDate = "Başlama tarihi gerekli.";
    if (!updateForm.dueDate) errors.dueDate = "Bitiş tarihi gerekli.";
    if (updateForm.startDate && updateForm.dueDate && updateForm.startDate > updateForm.dueDate) errors.dueDate = "Bitiş tarihi, başlangıç tarihinden önce olamaz.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const confirmUpdateTask = async () => {
    if (!validateForm()) return;
    if (selectedTask) {
      try {
        await dispatch(updateTask({
          taskId: selectedTask.taskId,
          taskDtoIU: {
            ...updateForm,
            assignedMemberId: selectedTask.assignedMember?.memberId,
            projectId: selectedTask.project?.projectId,
          },
          token
        })).unwrap();
        setSnackbarMessage("Görev başarıyla güncellendi!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        closeUpdateDialog();
        fetchTasks();
      } catch (err) {
        setSnackbarMessage(err || "Görev güncellenirken hata oluştu!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
            {memberLoading ? (
              <Typography variant="h6">Yükleniyor...</Typography>
            ) : projectMember?.userDto ? (
              <>
                <Avatar
                  src={
                    projectMember.userDto.profileImageUrl
                      ? BASE_URL + projectMember.userDto.profileImageUrl
                      : userPlaceholderImage
                  }
                  alt={projectMember.userDto.username}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="h6" noWrap>
                  {projectMember.userDto.username}
                </Typography>
              </>
            ) : (
              <Typography variant="h6">Kullanıcının Görevleri</Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                textTransform: "none",
                px: isMobile ? 0 : 1,
                minWidth: isMobile ? 40 : "auto",
              }}
              onClick={() =>
                navigate(`/projects/${projectId}/${memberId}/create-task`)
              }
            >
              <AddIcon />
              {!isMobile && (
                <Typography sx={{ ml: 1 }} component="span">
                  Görev Ekle
                </Typography>
              )}
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "flex-end" }}>
            <Typography>Durum:</Typography>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              size="small"
              displayEmpty
              sx={{ minWidth: 140, backgroundColor: "white" }}
            >
              <MenuItem value="">Tüm Görevler</MenuItem>
              {Object.entries(statusMap).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Box>

        </Toolbar>
      </AppBar>


      {loading ? (
        <Typography align="center">Yükleniyor...</Typography>
      ) : filteredTasks.length === 0 ? (
        <Typography align="center">Görev bulunamadı.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Başlık</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell>Başlama Tarihi</TableCell>
                <TableCell>Bitiş Tarihi</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.taskId} sx={{ backgroundColor: statusColorMap[task.status] || "transparent" }}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.startDate}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{statusMap[task.status]}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      {task.status === "REVIEW" && <Button variant="contained" color="success" size="small" sx={{ textTransform: "none" }} onClick={() => handleApproveTask(task.taskId)}>Onayla</Button>}
                      <Button variant="contained" color="warning" size="small" sx={{ textTransform: "none" }} onClick={() => openUpdateDialog(task)}>Güncelle</Button>
                      <Button variant="contained" color="error" size="small" sx={{ textTransform: "none" }} onClick={() => openDeleteDialog(task)}>Sil</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 1 && <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}><Pagination count={totalPages} page={page} onChange={handlePageChange} /></Box>}

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Görevi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedTask ? `"${selectedTask.title}" görevini silmek istediğinizden emin misiniz?` : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} variant="contained" color="primary" sx={{ textTransform: "none" }}>Vazgeç</Button>
          <Button onClick={confirmDeleteTask} variant="contained" color="error" sx={{ textTransform: "none" }}>Sil</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={closeUpdateDialog} maxWidth="md" fullWidth>
        <DialogTitle>Görevi Güncelle</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Başlık" name="title" value={updateForm.title} onChange={handleUpdateFormChange} fullWidth error={!!formErrors.title} helperText={formErrors.title} />
          <TextField label="Açıklama" name="description" value={updateForm.description} onChange={handleUpdateFormChange} fullWidth multiline rows={3} error={!!formErrors.description} helperText={formErrors.description} />
          <TextField label="Başlama Tarihi" type="date" name="startDate" value={updateForm.startDate} onChange={handleUpdateFormChange} InputLabelProps={{ shrink: true }} error={!!formErrors.startDate} helperText={formErrors.startDate} />
          <TextField label="Bitiş Tarihi" type="date" name="dueDate" value={updateForm.dueDate} onChange={handleUpdateFormChange} InputLabelProps={{ shrink: true }} error={!!formErrors.dueDate} helperText={formErrors.dueDate} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateDialog} variant="contained" color="primary" sx={{ textTransform: "none" }}>Vazgeç</Button>
          <Button onClick={confirmUpdateTask} variant="contained" color="success" sx={{ textTransform: "none" }}>Güncelle</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ProjectMembersTasks;
