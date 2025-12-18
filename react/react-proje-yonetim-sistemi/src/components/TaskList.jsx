import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  Paper,
  Pagination,
} from "@mui/material";

import {
  getUsersAllTasks,
  getUsersTasksByStatus,
  changeTaskStatusToInProgress,
  changeTaskStatusToReview
} from "../redux/slices/taskSlice";

const statusMap = {
  TODO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  REVIEW: "İnceleniyor",
  DONE: "Tamamlandı",
};

const statusColorMap = {
  TODO: "#E1C9E8",
  IN_PROGRESS: "#FFF5BA",
  REVIEW: "#BAE1FF",
  DONE: "#D4FFD4",
};

function TaskList() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const { tasks, totalPages, loading } = useSelector((state) => state.task);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const formatDateTR = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isOverdue = (dueDateStr) => {
    if (!dueDateStr) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  useEffect(() => {
    if (statusFilter) {
      dispatch(
        getUsersTasksByStatus({
          status: statusFilter,
          pageNo: page,
          pageSize: 5,
          token,
        })
      );
    } else {
      dispatch(
        getUsersAllTasks({
          pageNo: page,
          pageSize: 5,
          token,
        })
      );
    }
  }, [dispatch, page, statusFilter, token]);

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Görevlerim {statusFilter && `(${statusMap[statusFilter]})`}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography>Durum:</Typography>
            <Select
              size="small"
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              sx={{ backgroundColor: "white", minWidth: 160 }}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Başlık</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Proje</TableCell>
              <TableCell>Görevi Oluşturan</TableCell>
              <TableCell>Başlama Tarihi</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Görev bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task.taskId}
                  sx={{
                    backgroundColor:
                      statusColorMap[task.status] || "transparent",
                  }}
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.project?.name}</TableCell>
                  <TableCell>{task.project?.creator?.username}</TableCell>
                  <TableCell>{formatDateTR(task.startDate)}</TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2">
                        {formatDateTR(task.dueDate)}
                      </Typography>

                      {isOverdue(task.dueDate) &&
                        (task.status === "TODO" || task.status === "IN_PROGRESS") && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ fontWeight: 600 }}
                          >
                            ⚠ Süresi geçti
                          </Typography>
                        )}
                    </Box>
                  </TableCell>

                  <TableCell>{statusMap[task.status]}</TableCell>

                  <TableCell align="center">
                    {task.status === "TODO" ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ textTransform: "none" }}
                        disabled={loading}
                        onClick={() =>
                          dispatch(
                            changeTaskStatusToInProgress({
                              taskId: task.taskId,
                              token,
                            })
                          )
                        }
                      >
                        Başla
                      </Button>
                    ) : task.status === "IN_PROGRESS" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ textTransform: "none" }}
                        disabled={loading}
                        onClick={() =>
                          dispatch(
                            changeTaskStatusToReview({
                              taskId: task.taskId,
                              token,
                            })
                          )
                        }
                      >
                        Tamamla
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      )}
    </Box>
  );
}

export default TaskList;
