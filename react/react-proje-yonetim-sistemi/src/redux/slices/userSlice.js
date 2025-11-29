import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null
}

const API_URL_USER = import.meta.env.VITE_API_URL + "/users";


export const authenticate = createAsyncThunk(
    "user/authenticate",
    async (body, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL_USER}/authenticate`, {
                email: body.email,
                password: body.password
            })

            if (response.data.success === false) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Bir hata oluştu")
        }

    }
)

export const register = createAsyncThunk(
    "user/register",
    async (body, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL_USER}/register`, body);

            if (response.data.success === false) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
        }
    }
);

export const resendMailVerification = createAsyncThunk(
    "user/resendMailVerification",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL_USER}/resend-email-verification?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Mail gönderilemedi");
        }
    }
);

export const verifyEmail = createAsyncThunk(
    "user/verify-email",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL_USER}/verify-email?token=${token}`);
            console.log(response.data)
            return response.data.message;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.loading = false
        },
        clearMessage: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null
        }

    },
    extraReducers: (builder) => {
        builder.addCase(authenticate.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.userDto
            state.error = null;
            if (state.user != null && state.token != null) {
                state.isAuthenticated = true
                state.loading = false
            }
            state.loading = false

        })
        builder.addCase(authenticate.pending, (state) => {
            state.loading = true
            state.error = null;
        })
        builder.addCase(authenticate.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
        })

        builder.addCase(register.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.userDto
            state.error = null;
            if (state.user != null && state.token != null) {
                state.isAuthenticated = true
                state.loading = false

            }
            state.loading = false

        })
        builder.addCase(register.pending, (state) => {
            state.loading = true
        })
        builder.addCase(register.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false
        })

        builder.addCase(resendMailVerification.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false
            state.successMessage = action.payload.message;
        })
        builder.addCase(resendMailVerification.pending, (state) => {
            state.loading = true
            state.successMessage = null;

        })
        builder.addCase(resendMailVerification.rejected, (state, action) => {
            state.error = action.payload;
            state.successMessage = null;
            state.loading = false
        })

        builder.addCase(verifyEmail.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.successMessage = action.payload; // artık direkt mesaj
        })
        builder.addCase(verifyEmail.pending, (state) => {
            console.log("b")

            state.loading = true
            state.successMessage = null;

        })
        builder.addCase(verifyEmail.rejected, (state, action) => {
            console.log("c")

            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

    }
})

export const { logOut, clearMessage, clearSuccessMessage } = userSlice.actions

export default userSlice.reducer