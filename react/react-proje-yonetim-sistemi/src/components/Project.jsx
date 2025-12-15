import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjectById } from "../redux/slices/projectSlice";
import { getProjectMemberByUserIdAndProjectId, getProjectMembers } from "../redux/slices/projectMemberSlice";
import placeholderImage from "../files/placeholder-images/project-placeholder.jpg";
import userPlaceholderImage from "../files/placeholder-images/user-placeholder.jpg";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from "@mui/material";
import { changeMembersRole, deleteMemberFromProject, leaveProject } from "../redux/slices/projectMemberSlice";
import EditIcon from '@mui/icons-material/Edit';

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace("/api", "");

import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Divider,
    Stack,
    Chip,
    Button
} from "@mui/material";

function Project() {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { project, loading, error } = useSelector((state) => state.project);
    const token = useSelector((state) => state.user.token);
    const userId = useSelector((state) => state.user.user?.userId);
    const projectRoles = useSelector((state) => state.projectMember.projectRoles);
    const members = useSelector((state) => state.projectMember.members);

    const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
    const [selectedMember, setSelectedMember] = React.useState(null);
    const [selectedRole, setSelectedRole] = React.useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deleteUser, setDeleteUser] = React.useState(null);
    const [deleteError, setDeleteError] = React.useState("");

    const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
    const [leaveError, setLeaveError] = React.useState("");

    const userRole = projectRoles?.[projectId];

    const STATUS_LABELS = {
        PLANNING: "Planlanıyor",
        IN_PROGRESS: "Devam Ediyor",
        ON_HOLD: "Beklemede",
        CANCELLED: "İptal Edildi",
        COMPLETED: "Tamamlandı",
    };

    const STATUS_COLORS = {
        PLANNING: "#1976d2",
        IN_PROGRESS: "#2e7d32",
        ON_HOLD: "#ed6c02",
        CANCELLED: "#d32f2f",
        COMPLETED: "#6a1b9a",
    };

    const ROLE_LABELS = {
        MANAGER: "Yönetici",
        DEVELOPER: "Geliştirici",
        DESIGNER: "Tasarımcı",
        TESTER: "Test Uzmanı",
        MEMBER: "Üye",
    };

    const ROLE_COLORS = {
        MANAGER: "#1976d2",
        DEVELOPER: "#2e7d32",
        DESIGNER: "#6a1b9a",
        TESTER: "#ed6c02",
        MEMBER: "#616161",
    };

    const openLeaveDialog = () => {
        setLeaveError("");
        setLeaveDialogOpen(true);
    };

    const handleLeaveConfirm = async () => {
        const resultAction = await dispatch(
            leaveProject({
                projectId,
                token,
            })
        );

        if (leaveProject.rejected.match(resultAction)) {
            setLeaveError(resultAction.payload || "Projeden ayrılırken bir hata oluştu.");
            return;
        }

        // Başarılıysa
        setLeaveDialogOpen(false);
        navigate("/projects");
    };

    const handleDeleteConfirm = async () => {
        if (!deleteUser) return;

        const resultAction = await dispatch(deleteMemberFromProject({
            deletedUserId: deleteUser.userDto.userId,
            projectId,
            token,
        }));

        if (deleteMemberFromProject.rejected.match(resultAction)) {
            setDeleteError(resultAction.payload || "Bir hata oluştu.");
            return;
        }

        setDeleteDialogOpen(false);
        setDeleteUser(null);
    };


    const openDeleteDialog = (member) => {
        setDeleteUser(member);
        setDeleteError("");
        setDeleteDialogOpen(true);
    };

    const openRoleDialog = (member) => {
        setSelectedMember(member);
        setSelectedRole(member.role);
        setRoleDialogOpen(true);
    };

    const handleRoleChangeConfirm = () => {
        if (!selectedMember) return;

        dispatch(changeMembersRole({
            roleChangedUserId: selectedMember.userDto.userId,
            projectId,
            role: selectedRole,
            token
        }));

        setRoleDialogOpen(false);
    };

    useEffect(() => {
        dispatch(getProjectMembers({ projectId, token }));
    }, [dispatch, projectId, token])

    useEffect(() => {
        console.log(members)
    }, [members])

    useEffect(() => {
        if (token) {
            dispatch(getProjectById({ projectId, token }));
        }

        if (token && userId) {
            dispatch(
                getProjectMemberByUserIdAndProjectId({
                    userId,
                    projectId,
                    token,
                })
            );
        }
    }, [dispatch, projectId, token, userId]);

    if (loading) {
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
        <Box sx={{ mx: "auto", mt: 2, px: 2 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                {/* 🔹 Proje Resmi */}
                <CardMedia
                    component="img"
                    height="260"
                    image={
                        project.projectImageUrl
                            ? BASE_URL + project.projectImageUrl
                            : placeholderImage
                    }
                    alt="Project Image"
                    sx={{
                        objectFit: "cover",
                    }}
                />

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            {project.name}
                        </Typography>

                        {userRole === "MANAGER" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button onClick={() => navigate(`/projects/${projectId}/manage-project`)} variant="contained" color="secondary" sx={{ textTransform: "none" }}>
                                    <EditCalendarIcon sx={{ mr: 1 }} />Proje Durumunu Yönet
                                </Button>

                                <Button onClick={() => navigate(`/projects/${projectId}/update-project`)} variant="contained" color="warning" sx={{ textTransform: "none" }}>
                                    <EditIcon sx={{ mr: 1 }} /> Projeyi Güncelle
                                </Button>

                                <Button onClick={() => navigate(`/projects/${projectId}/project-settings`)} variant="contained" color="primary" sx={{ textTransform: "none" }}>
                                    <SettingsIcon sx={{ mr: 1 }} /> Proje Ayarları
                                </Button>

                            </Box>
                        )}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {userRole && (
                            <Chip
                                label={`Rolün: ${ROLE_LABELS[userRole] || userRole}`}
                                sx={{
                                    mt: 1,
                                    backgroundColor: ROLE_COLORS[userRole] || "#e0e0e0",
                                    color: "#fff",
                                    fontWeight: 600,
                                }}
                            />)}
                        <Chip
                            label={STATUS_LABELS[project.status] || project.status}
                            sx={{
                                backgroundColor: "#e3f2fd", // açık mavi arka plan
                                color: STATUS_COLORS[project.status] || "#1976d2",
                                fontWeight: 600,
                            }}
                        />                        <Chip label={`İlerleme: %${project.progress}`} variant="outlined" />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {project.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                        <Typography variant="body2">
                            <strong>Başlangıç:</strong>{" "}
                            {project.startDate ? project.startDate.split("T")[0] : "-"}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Bitiş:</strong>{" "}
                            {project.endDate ? project.endDate.split("T")[0] : "-"}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Oluşturan:</strong> {project.creator?.username}
                        </Typography>

                        <Typography variant="body2">
                            <strong>Oluşturulma:</strong> {project.createdAt.split("T")[0]}
                        </Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Proje Üyeleri
                        {
                            userRole === "MANAGER" && (
                                <Button onClick={() => navigate(`/projects/${project.projectId}/add-member`)} variant="contained" color="success" sx={{ textTransform: "none", ml: 1, padding: "5px", paddingRight: "10px" }}>
                                    <AddIcon sx={{ mr: 0 }} /> Üye Ekle
                                </Button>)
                        }

                    </Typography>

                    <Stack spacing={1}>
                        {members?.map((m) => {
                            const isCurrentUser = m.userDto.userId === userId;

                            return (
                                <Card
                                    onClick={() =>
                                        !isCurrentUser && navigate("/users-profile/" + m.userDto.userId)
                                    }
                                    key={m.memberId}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        boxShadow: 1,
                                        cursor: isCurrentUser ? "default" : "pointer",
                                        transition: "0.2s ease",
                                        backgroundColor: isCurrentUser ? "rgba(0, 150, 255, 0.08)" : "inherit",
                                        "&:hover": !isCurrentUser && {
                                            boxShadow: 4,
                                            transform: "scale(1.01)",
                                            backgroundColor: "rgba(0,0,0,0.03)",
                                        },
                                    }}
                                >
                                    {/* Profil resmi */}
                                    <CardMedia
                                        component="img"
                                        image={
                                            m.userDto.profileImageUrl
                                                ? BASE_URL + m.userDto.profileImageUrl
                                                : userPlaceholderImage
                                        }
                                        alt="User Avatar"
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {m.userDto.username}{" "}
                                            {isCurrentUser && (
                                                <Chip
                                                    label="Sizsiniz"
                                                    color="info"
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Typography>

                                        {/* Projedeki Rol */}
                                        <Typography
                                            variant="body2"
                                            sx={{ mt: 0.5 }}
                                        >
                                            <b>Rol: </b>
                                            <span
                                                style={{
                                                    color: ROLE_COLORS[m.role] || "#616161",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {ROLE_LABELS[m.role] || m.role}
                                            </span>
                                        </Typography>

                                        {/* Katılma Tarihi */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            Katıldı: {m.joinedAt.split("T")[0]}
                                        </Typography>
                                    </Box>

                                    {isCurrentUser && (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                size="small"
                                                sx={{ textTransform: "none" }}
                                                onClick={openLeaveDialog}
                                            >
                                                Projeden Ayrıl
                                            </Button>
                                        </Stack>
                                    )}

                                    {!isCurrentUser && userRole === "MANAGER" && (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ ml: "auto" }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="contained"
                                                color="info"
                                                size="small"
                                                sx={{ textTransform: "none" }}
                                                onClick={() => openRoleDialog(m)}
                                            >
                                                Yetki Değiştir
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                sx={{ textTransform: "none" }}
                                                onClick={() => openDeleteDialog(m)}
                                            >
                                                Üyeyi Sil
                                            </Button>
                                        </Stack>
                                    )}
                                </Card>
                            );
                        })}
                    </Stack>

                    <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)}>
                        <DialogTitle>Projeden Ayrıl</DialogTitle>

                        <DialogContent sx={{ minWidth: 300 }}>
                            <Typography>
                                Bu projeden ayrılmak istediğinize emin misiniz?
                            </Typography>

                            {leaveError && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {leaveError}
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setLeaveDialogOpen(false)}>
                                Vazgeç
                            </Button>

                            <Button
                                variant="contained"
                                color="warning"
                                onClick={handleLeaveConfirm}
                            >
                                Onayla
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Üyeyi Sil</DialogTitle>

                        <DialogContent sx={{ minWidth: 300 }}>
                            <Typography>
                                <strong>{deleteUser?.userDto.username}</strong> adlı üyeyi projeden
                                silmek istediğinize emin misiniz?
                            </Typography>

                            {deleteError && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {deleteError}
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>Vazgeç</Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteConfirm}
                            >
                                Onayla
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
                        <DialogTitle>Üye Rolünü Değiştir</DialogTitle>
                        <DialogContent sx={{ minWidth: 300, pb: 2 }}>
                            <Typography sx={{ mb: 1 }}>
                                <strong>{selectedMember?.userDto.username}</strong> için yeni rolü seçin:
                            </Typography>

                            <Select
                                fullWidth
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <MenuItem value="MANAGER">Yönetici</MenuItem>
                                <MenuItem value="DEVELOPER">Geliştirici</MenuItem>
                                <MenuItem value="DESIGNER">Tasarımcı</MenuItem>
                                <MenuItem value="TESTER">Test Uzmanı</MenuItem>
                                <MenuItem value="MEMBER">Üye</MenuItem>
                            </Select>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setRoleDialogOpen(false)}>Vazgeç</Button>
                            <Button variant="contained" onClick={handleRoleChangeConfirm}>
                                Onayla
                            </Button>
                        </DialogActions>
                    </Dialog>

                </CardContent>


            </Card>
        </Box>
    );
}

export default Project;
