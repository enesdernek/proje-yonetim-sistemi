import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import { clearMessage, clearSuccessMessage,sendChangeEmailAdressRequestMail } from '../redux/slices/userSlice';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';



const validationSchema = yup.object({
    email: yup.string().required("Email zorunludur").email("Geçerli email giriniz"),
    password: yup.string().required("Şifre zorunludur").min(6, "Şifre en az 6 karakter olmalıdır"),
});


function ChangeEmailAdress() {

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: (values) => {
            dispatch(clearMessage());
            dispatch(clearSuccessMessage());
            dispatch(sendChangeEmailAdressRequestMail({newEmail: values.email, password: values.password,token:token}));
        }
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);
    const successMessage = useSelector((state) => state.user.successMessage);
    const {token} = useSelector((state) => state.user);

    return (
        <Box sx={{ height: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5' , mt:2}}>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { md: "400px", xs: "350px" }, padding: 4, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>

                    <Typography variant="h5" textAlign="center" mb={2}>E-Mail Adresi Değiştir</Typography>

                    <FormControl variant="standard">
                        <InputLabel>Yeni E-Mail Adresi</InputLabel>
                        <Input
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            startAdornment={<InputAdornment position="start"><AlternateEmailIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.email && formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}

                    <FormControl variant="standard">
                        <InputLabel>Mecvut Şifreniz</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.password)}
                            startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.password && formik.errors.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}

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
                            "Şifre Değiştirme Maili Gönder"
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

export default ChangeEmailAdress