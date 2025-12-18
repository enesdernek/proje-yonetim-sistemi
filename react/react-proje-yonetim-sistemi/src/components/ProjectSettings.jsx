import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from "@mui/material";

import { deleteProjectByProjectId } from "../redux/slices/projectSlice";

function ProjectSettings() {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.user.token);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleDelete = async () => {
        setDeleteError(""); 

        const resultAction = await dispatch(
            deleteProjectByProjectId({
                projectId,
                token
            })
        );

        if (deleteProjectByProjectId.rejected.match(resultAction)) {
            setDeleteError(
                resultAction.payload || "Proje silinirken hata oluştu."
            );
            return;
        }

        setOpenConfirm(false);
        navigate("/projects");
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Proje Ayarları
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Bu sayfada proje ile ilgili kritik işlemleri
                gerçekleştirebilirsiniz.
            </Typography>

            <Button
                variant="contained"
                color="error"
                onClick={() => {
                    setDeleteError("");
                    setOpenConfirm(true);
                }}
                sx={{ textTransform: "none" }}
            >
                Projeyi Sil
            </Button>

            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>
                    Projeyi Silmek Üzeresiniz
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1">
                        <strong>Uyarı:</strong> Projedeki bütün veriler
                        (proje üyeleri, görevler, istatistikler)
                        <strong> kalıcı olarak silinecektir.</strong>
                    </Typography>

                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ mt: 2 }}
                    >
                        Bu işlem geri alınamaz.
                    </Typography>

                    {deleteError && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 2, fontWeight: 600 }}
                        >
                            {deleteError}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenConfirm(false)}
                        color="inherit"
                    >
                        Vazgeç
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Onayla
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ProjectSettings;
