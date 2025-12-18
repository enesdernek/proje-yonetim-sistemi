import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    user: null,
    viewedUser: null,
    userList: [],
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
    userStats: null,
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

export const resetPasswordMail = createAsyncThunk(
    "user/reset-password-mail",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL_USER}/send-reset-password-email?email=${email}`);

            if (response.data.success === false) {
                return response.data.message
            }

            return response.data

        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
        }
    }
)

export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ newPassword, token }, { rejectWithValue }) => {

        try {
            const response = await axios.put(
                `${API_URL_USER}/reset-password?token=${token}`,
                { newPassword }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const getAuthenticatedUser = createAsyncThunk(
    "user/get-authenticated-user",
    async ({ token }, { rejectWithValue }) => {

        try {
            const response = await axios.get(
                `${API_URL_USER}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const sendChangeEmailAdressRequestMail = createAsyncThunk(
    "user/sendChangeEmailAdressRequestMail",
    async ({ newEmail, password, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL_USER}/send-change-email-adress-email`,
                null,
                {
                    params: {
                        newEmail: newEmail,
                        currentPassword: password
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const changeEmail = createAsyncThunk(
    "user/changeEmail",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_USER}/change-email`,
                {},
                {
                    params: { token },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const changePassword = createAsyncThunk(
    "user/changePassword",
    async ({ changePasswordRequest, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_USER}/change-password`,
                changePasswordRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const uploadProfilePicture = createAsyncThunk(
    "user/uploadProfilePicture",
    async ({ file, token }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file); 

            const response = await axios.post(
                `${API_URL_USER}/upload-profile-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const deleteProfilePicture = createAsyncThunk(
    "user/deleteProfilePicture",
    async ({ token }, { rejectWithValue }) => {
        try {

            const response = await axios.delete(
                `${API_URL_USER}/delete-profile-image`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const changePhoneNumber = createAsyncThunk(
    "user/changePhoneNumber",
    async ({ changePhoneRequest, token }, { rejectWithValue }) => {
        try {

            const response = await axios.put(
                `${API_URL_USER}/change-phone`, changePhoneRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;

        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const searchUser = createAsyncThunk(
    "user/searchUser",
    async ({ searchInput, token }, { rejectWithValue }) => {
        try {


            const response = await axios.get(
                `${API_URL_USER}/search-user`,
                {
                    params: { searchInput },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success === false) {
                return rejectWithValue(response.data.message);
            }

            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const getUserByUserId = createAsyncThunk(
    "user/getUserByUserId",
    async ({ userId, token }, { rejectWithValue }) => {
        try {


            const response = await axios.get(
                `${API_URL_USER}/get-by-user-id`,
                {
                    params: { userId },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success === false) {
                return rejectWithValue(response.data.message);
            }

            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

export const getUserInfos = createAsyncThunk(
    "user/getUserInfos",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_USER}/get-user-infos`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Bir hata oluştu"
            );
        }
    }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////
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
        },
        clearUserList: (state) => {
            state.userList = []
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
            state.successMessage = action.payload; 
        })
        builder.addCase(verifyEmail.pending, (state) => {
            state.loading = true
            state.successMessage = null;

        })
        builder.addCase(verifyEmail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(resetPasswordMail.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload?.message || "Şifre sıfırlama maili gönderildi";
        })
        builder.addCase(resetPasswordMail.pending, (state) => {
            state.loading = true
        })
        builder.addCase(resetPasswordMail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;
        })
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true
            state.successMessage = null
        })
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(getAuthenticatedUser.fulfilled, (state, action) => {
            state.user = action.payload.data;
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;
        })
        builder.addCase(getAuthenticatedUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAuthenticatedUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(sendChangeEmailAdressRequestMail.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message;
        })
        builder.addCase(sendChangeEmailAdressRequestMail.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(sendChangeEmailAdressRequestMail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
        })

        builder.addCase(changeEmail.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;

        })
        builder.addCase(changeEmail.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(changeEmail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(changePassword.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;
        })

        builder.addCase(changePassword.pending, (state) => {
            state.loading = true
        })

        builder.addCase(changePassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(uploadProfilePicture.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;
            state.user = action.payload.data;
        })
        builder.addCase(uploadProfilePicture.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(uploadProfilePicture.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(deleteProfilePicture.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;
            state.user = action.payload.data;
        })
        builder.addCase(deleteProfilePicture.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteProfilePicture.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })

        builder.addCase(changePhoneNumber.fulfilled, (state, action) => {
            state.loading = false
            state.error = null;
            state.successMessage = action.payload.message;
            state.user = action.payload.data;
        })
        builder.addCase(changePhoneNumber.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(changePhoneNumber.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.successMessage = null;
        })
        builder.addCase(searchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.userList = action.payload.data.userDtos;
            state.successMessage = action.payload.message;
        });

        builder.addCase(searchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        });

        builder.addCase(searchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.userList = [];
        });

        builder.addCase(getUserByUserId.pending, (state, action) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        });

        builder.addCase(getUserByUserId.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.viewedUser = action.payload.data;
            state.successMessage = action.payload.message;
        });

        builder.addCase(getUserByUserId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(getUserInfos.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        });

        builder.addCase(getUserInfos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.userStats = action.payload.data; 
            state.successMessage = action.payload.message;
        });

        builder.addCase(getUserInfos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.successMessage = null;
        });

    }
})

export const { logOut, clearMessage, clearSuccessMessage, clearUserList } = userSlice.actions

export default userSlice.reducer