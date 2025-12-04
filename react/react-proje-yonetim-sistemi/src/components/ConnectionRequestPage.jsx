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
  acceptConnectionRequest,
  rejectConnectionRequest
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
    receivedPagination = { pageNo: 0, pageSize: PAGE_SIZE, totalElements: 0, totalPages: 0 },
    loading = false
  } = useSelector((state) => state.connectionRequest || {});

  const userState = useSelector((state) => state.user || {});
  const token = userState.token || userState.user?.token || null;

  useEffect(() => {
    if (tab === 0 && token) {
      dispatch(
        getUsersRecievedConnectionRequests({
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

  const handleUserClick = (userId) => {
    navigate(`/users-profile/${userId}`);
  };

  const totalPages = Number(receivedPagination.totalPages) || 0;
  const totalElements = Number(receivedPagination.totalElements) || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Bağlantı İstekleri
      </Typography>

      <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Alınan İstekler" />
        <Tab label="Gönderilen İstekler" />
      </Tabs>

      {tab === 0 && (
        <Box>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (recievedConnectionRequests?.length ?? 0) === 0 ? (
            <Typography color="text.secondary">Henüz bağlantı isteği yok.</Typography>
          ) : (
            recievedConnectionRequests.map((req) => {
              const avatarUrl = req.sendersProfileImageUrl
                ? BASE_URL + req.sendersProfileImageUrl
                : undefined;

              return (
                <Card key={req.requestId} sx={{ mb: 2 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        onClick={() => handleUserClick(req.senderId)}
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer", flexGrow: 1 }}
                      >
                        <Avatar src={avatarUrl} sx={{ mr: 1 }}>
                          {req.sendersUsername?.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{req.sendersUsername}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`Gönderildi: ${new Date(req.createdAt).toLocaleString()}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        {req.status === "PENDING" ? (
                          <>
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
                          </>
                        ) : (
                          <Typography
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: 1,
                              fontWeight: 600,
                              color:
                                req.status === "APPROVED"
                                  ? "success.main"
                                  : "error.main",
                              border:
                                req.status === "APPROVED"
                                  ? "1px solid green"
                                  : "1px solid red",
                            }}
                          >
                            {req.status === "APPROVED" ? "Kabul Edildi" : "Reddedildi"}
                          </Typography>
                        )}
                      </Stack>
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
      )}

      {tab === 1 && (
        <Box>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={600}>Kullanıcı Adı</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placeholder gönderilen istek
                  </Typography>
                </Box>

                <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
                  İptal Et
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination count={5} color="primary" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ConnectionRequestPage;
