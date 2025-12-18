import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { changePassword, clearMessage, clearSuccessMessage, resetPasswordMail } from '../redux/slices/userSlice';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PasswordIcon from '@mui/icons-material/Password';



const validationSchema = yup.object({
    oldPassword: yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre alanı zorunludur"),
    newPassword: yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre alanı zorunludur"),
     passwordCheck: yup.string()
        .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor')
        .required('Şifre tekrarı zorunludur'),
});


function ChangePassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);
    const successMessage = useSelector((state) => state.user.successMessage);
    const token = useSelector((state) => state.user.token);

    const formik = useFormik({
        initialValues: {  oldPassword: "",newPassword: "", passwordCheck: "" },
        validationSchema,
        onSubmit: (values) => {

            const changePasswordRequest = {
                currentPassword: values.oldPassword,
                newPassword: values.newPassword
            }

            dispatch(changePassword({changePasswordRequest,token}))


        }
    });

    

    return (
        <Box sx={{ height: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5' , mt:2}}>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { md: "400px", xs: "350px" }, padding: 4, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>

                    <Typography variant="h5" textAlign="center" mb={2}>Şifreyi Değiştir</Typography>

                    <FormControl variant="standard">
                        <InputLabel>Mecvut Şifre</InputLabel>
                        <Input
                            name="oldPassword"
                            type="password"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                            startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.oldPassword && formik.errors.oldPassword && <FormHelperText error>{formik.errors.oldPassword}</FormHelperText>}

                    <FormControl variant="standard">
                        <InputLabel>Yeni Şifre</InputLabel>
                        <Input
                            name="newPassword"
                            type="password"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                            startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.newPassword && formik.errors.newPassword && <FormHelperText error>{formik.errors.newPassword}</FormHelperText>}

                    <FormControl variant="standard">
                        <InputLabel>Yeni Şifre Tekrar</InputLabel>
                        <Input
                            name="passwordCheck"
                            type="password"
                            value={formik.values.passwordCheck}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordCheck && Boolean(formik.errors.passwordCheck)}
                            startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.passwordCheck && formik.errors.passwordCheck && <FormHelperText error>{formik.errors.passwordCheck}</FormHelperText>}

                    <Button
                        variant="contained"
                        type="submit"
                        color="warning"
                        sx={{
                            mt: 2,
                            paddingY: 1.5,
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress size={32} sx={{ color: "white" }} />
                            </Box>
                        ) : (
                            "Şifreyi Değiştir"
                        )}
                    </Button>

                    {successMessage && (
                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => dispatch(clearSuccessMessage())}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {successMessage}
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => dispatch(clearMessage())}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                </Box>
            </form>
        </Box>
    )
}

export default ChangePassword