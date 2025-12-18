import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Typography } from '@mui/material';
import { useFormik } from 'formik';
import  { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { changePhoneNumber, clearMessage, clearSuccessMessage, resendMailVerification } from '../redux/slices/userSlice';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';



const validationSchema = yup.object({
    phone: yup.string()
        .required("Telefon numarası zorunludur.")
        .matches(/^[0-9]+$/, "Telefon numarası sadece rakamlardan oluşmalıdır")
        .length(10, "Telefon numarası 10 haneli olmalıdır"),
});


function ChangePhonePage() {


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);
    const successMessage = useSelector((state) => state.user.successMessage);
    const token = useSelector((state) => state.user.token);

    const formik = useFormik({
        initialValues: { phone: "" },
        validationSchema,
        onSubmit: (values) => {
            const changePhoneRequest = {
                phone: values.phone,
            };
            dispatch(changePhoneNumber({ changePhoneRequest , token }));
        }
    });

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                navigate("/account-settings");
            }, 500);

            return () => clearTimeout(timer); 
        }
    }, [successMessage, navigate]);

    return (
        <Box sx={{ height: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5', mt: 2 }}>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { md: "400px", xs: "350px" }, padding: 4, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>

                    <Typography variant="h5" textAlign="center" mb={2}>Telefon Numarasını Güncelle</Typography>

                    <FormControl variant="standard">
                        <InputLabel>Telefon Numarası</InputLabel>
                        <Input
                            name="phone"
                            type="number"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            startAdornment={<InputAdornment position="start"><PhoneIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.phone && formik.errors.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}

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
                            "Telefon Numarasını Güncelle"
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

export default ChangePhonePage