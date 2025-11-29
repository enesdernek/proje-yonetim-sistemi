import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
}

const API_URL_USER = import.meta.env.VITE_API_URL+"/users";


export const authenticate = createAsyncThunk(
    "user/authenticate",
    async (body) => {
        const response = await axios.post(`${API_URL_USER}/authenticate`, {
            email: body.email,
            password: body.password
        })

        return response.data.data

    }
)

export const register = createAsyncThunk(
    "user/register",
    async (body) => {

        const response = await axios.post(`${API_URL_USER}/register`, {
            username: body.username,
            email: body.email,
            password: body.password,
            phone: body.phone,
            address: body.address
        });
          console.log(response.data)
        //return response.data.data; 
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.loading = false
        }

    },
    extraReducers: (builder) => {
        builder.addCase(authenticate.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.userDto
            if (state.user != null && state.token != null) {
                state.isAuthenticated = true
                state.loading = false
            }

        })
        builder.addCase(authenticate.pending, (state) => {
            state.loading = true
        })
        builder.addCase(authenticate.rejected, (state) => {
            state.loading = false
        })

        builder.addCase(register.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.userDto
            if (state.user != null && state.token != null) {
                state.isAuthenticated = true
                state.loading = false
            }

        })
        builder.addCase(register.pending, (state) => {
            state.loading = true
        })
        builder.addCase(register.rejected, (state) => {
            state.loading = false
        })

    }
})

export const { logOut } = userSlice.actions

export default userSlice.reducer