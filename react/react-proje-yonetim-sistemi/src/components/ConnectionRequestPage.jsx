import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Pagination,
  CircularProgress
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUsersRecievedConnectionRequests,
  getUsersSendedConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteConnectionRequest
} from "../redux/slices/connectionRequestSlice";

const PAGE_SIZE = 10;
const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_URL = API_URL.replace("/api", "");

function ConnectionRequestPage() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    recievedConnectionRequests = [],
    sendedConnectionRequests = [],
    receivedPagination = { pageNo: 0, pageSize: PAGE_SIZE, totalElements: 0, totalPages: 0 },
    sentPagination = { pageNo: 0, pageSize: PAGE_SIZE, totalElements: 0, totalPages: 0 },
    loading = false
  } = useSelector((state) => state.connectionRequest || {});

  const userState = useSelector((state) => state.user || {});
  const token = userState.token || userState.user?.token || null;

  useEffect(() => {
    if (!token) return;
    if (tab === 0) {
      dispatch(
        getUsersRecievedConnectionRequests({
          token,
          pageNo: page,
          pageSize: PAGE_SIZE
        })
      );
    } else if (tab === 1) {
      dispatch(
        getUsersSendedConnectionRequests({
          token,
          pageNo: page,
          pageSize: PAGE_SIZE
        })
      );
    }
  }, [tab, page, token, dispatch]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  const handleAccept = (requestId) => {
    if (!token) return;
    dispatch(acceptConnectionRequest({ token, requestId }));
  };

  const handleReject = (requestId) => {
    if (!token) return;
    dispatch(rejectConnectionRequest({ token, requestId }));
  };

  const handleDelete = (requestId) => {
    if (!token) return;
    dispatch(deleteConnectionRequest({ token, requestId }));
  };

  const handleUserClick = (userId) => {
    navigate(`/users-profile/${userId}`);
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} saniye önce`;
    if (diffMin < 60) return `${diffMin} dakika önce`;
    if (diffHour < 24) return `${diffHour} saat önce`;
    return `${diffDay} gün önce`;
  };

  const currentRequests = tab === 0 ? recievedConnectionRequests : sendedConnectionRequests;
  const currentPagination = tab === 0 ? receivedPagination : sentPagination;
  const totalPages = Number(currentPagination.totalPages) || 0;
  const totalElements = Number(currentPagination.totalElements) || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Bağlantı İstekleri
      </Typography>

      <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Alınan İstekler" />
        <Tab label="Gönderilen İstekler" />
      </Tabs>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : currentRequests.length === 0 ? (
        <Typography color="text.secondary">Henüz bağlantı isteği yok.</Typography>
      ) : (
        currentRequests.map((req) => {
          const isReceived = tab === 0;
          const userId = isReceived ? req.senderId : req.receiverId;
          const username = isReceived ? req.sendersUsername : req.recieversUsername;
          const avatarUrl = isReceived ? req.sendersProfileImageUrl : req.recieversProfileImageUrl;
          const status = req.status;

          return (
            <Card key={req.requestId} sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    onClick={() => handleUserClick(userId)}
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer", flexGrow: 1 }}
                  >
                    <Avatar src={avatarUrl ? BASE_URL + avatarUrl : undefined} sx={{ mr: 1 }}>
                      {username?.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`Gönderildi: ${timeAgo(req.createdAt)}`}
                      </Typography>
                    </Box>
                  </Box>

                  {isReceived ? (
                    status === "PENDING" ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAccept(req.requestId)}
                        >
                          Kabul Et
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => handleReject(req.requestId)}
                        >
                          Reddet
                        </Button>
                      </Stack>
                    ) : (
                      <Typography
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          fontWeight: 600,
                          color: status === "APPROVED" ? "success.main" : "error.main",
                          border: status === "APPROVED" ? "1px solid green" : "1px solid red",
                        }}
                      >
                        {status === "APPROVED" ? "Kabul Edildi" : "Reddedildi"}
                      </Typography>
                    )
                  ) : (
                    status === "PENDING" ? (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(req.requestId)}
                      >
                        İptal Et
                      </Button>
                    ) : (
                      <Typography
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          fontWeight: 600,
                          color: status === "APPROVED" ? "success.main" : "error.main",
                          border: status === "APPROVED" ? "1px solid green" : "1px solid red",
                        }}
                      >
                        {status === "APPROVED" ? "Kabul Edildi" : "Reddedildi"}
                      </Typography>
                    )
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
          />
        </Box>
      )}

      {totalElements > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1, textAlign: "center" }}
        >
          Toplam: {totalElements}
        </Typography>
      )}
    </Box>
  );
}

export default ConnectionRequestPage;
