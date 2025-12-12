import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Stack,
    Button,
    CircularProgress,
    Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getConnectionsPaged } from "../redux/slices/connectionSlice";
import { addProjectMembers } from "../redux/slices/projectMemberSlice";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

function ProjectAddMember() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { projectId } = useParams();
    const token = useSelector((state) => state.user.token);

    const { connections, loading } = useSelector((state) => state.connection);
    const project = useSelector((state) => state.project.project);

    const projectMembers = useSelector(state => state.projectMember.members);

    const userId = useSelector((state) => state.user.user?.userId);

    const [page] = useState(1);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const isAlreadyMember = (userId) => {
        return projectMembers?.some(
            (m) => m.userDto?.userId === userId
        );
    };

    useEffect(() => {
        if (userId && token) {
            dispatch(getConnectionsPaged({ userId, token, pageNo: page, pageSize: 50 }));
        }
    }, [dispatch, userId, token, page]);

    const handleAdd = (user) => {
        if (!selectedMembers.some((m) => m.userId === user.connectedUserId)) {
            setSelectedMembers((prev) => [
                ...prev,
                {
                    userId: user.connectedUserId,
                    role: "MEMBER", 
                },
            ]);
        }
    };

    const handleRemove = (userId) => {
        setSelectedMembers((prev) => prev.filter((m) => m.userId !== userId));
    };

    const handleSubmit = () => {
        if (selectedMembers.length === 0) return;

        dispatch(
            addProjectMembers({
                projectId,
                members: selectedMembers,
                token,
            })
        )
            .unwrap()
            .then(() => {
                navigate(`/projects/${projectId}`);
            });
    };

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>

            {/* ÜST BİLGİ KISMI */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    {project?.name} Projesine Üye Ekliyorsunuz
                </Typography>

                <Typography variant="body1" mt={1} color="text.secondary">
                    Sadece bağlantıda olduğunuz kullanıcıları projeye ekleyebilirsiniz.
                </Typography>
            </Box>

            {/* SEÇİLEN ÜYELER */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Eklenecek Üyeler ({selectedMembers.length})
                    </Typography>

                    {selectedMembers.length === 0 && (
                        <Typography color="text.secondary">
                            Henüz üye seçilmedi.
                        </Typography>
                    )}

                    <Stack spacing={2}>
                        {selectedMembers.map((m) => {
                            const userData = connections.find(
                                (c) => c.connectedUserId === m.userId
                            );

                            return (
                                <Card key={m.userId} sx={{ p: 1 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Stack direction="row" spacing={2}>
                                            <Avatar
                                                src={
                                                    userData?.connectedUsersProfileImageUrl
                                                        ? BASE_URL + userData.connectedUsersProfileImageUrl
                                                        : undefined
                                                }
                                            >
                                                {userData?.connectedUsername
                                                    ?.slice(0, 2)
                                                    ?.toUpperCase()}
                                            </Avatar>
                                            <Typography fontWeight={600}>
                                                {userData?.connectedUsername}
                                            </Typography>
                                        </Stack>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleRemove(m.userId)}
                                        >
                                            Çıkar
                                        </Button>
                                    </Stack>
                                </Card>
                            );
                        })}
                    </Stack>

                    {selectedMembers.length > 0 && (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleSubmit}
                        >
                            Üyeleri Ekle
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* CONNECTIONS LİSTESİ */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Stack spacing={2}>
                    {connections.map((conn) => (
                        <Card key={conn.connectionId}>
                            <CardContent
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        src={
                                            conn.connectedUsersProfileImageUrl
                                                ? BASE_URL + conn.connectedUsersProfileImageUrl
                                                : undefined
                                        }
                                        sx={{ width: 50, height: 50 }}
                                    >
                                        {conn.connectedUsername
                                            ?.slice(0, 2)
                                            ?.toUpperCase()}
                                    </Avatar>
                                    <Stack>
                                        <Typography fontWeight={600}>
                                            {conn.connectedUsername}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Üye No: {conn.connectedUserId}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {isAlreadyMember(conn.connectedUserId) ? (
                                    <Button variant="outlined" color="success" disabled>
                                        Zaten Eklendi
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAdd(conn)}
                                        disabled={selectedMembers.some(
                                            (m) => m.userId === conn.connectedUserId
                                        )}
                                    >
                                        {selectedMembers.some(
                                            (m) => m.userId === conn.connectedUserId
                                        )
                                            ? "Listeye Eklendi"
                                            : "Projeye Ekle"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default ProjectAddMember;
