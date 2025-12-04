import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    connections: [],
    isConnected: null,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    isConnectedMap: {},
}

const API_URL_CONNECTION = import.meta.env.VITE_API_URL + "/connections";


export const isConnected = createAsyncThunk(
    "connection/isConnected",
    async ({ otherUserId, token }, { rejectWithValue }) => {
        try {

            const response = await axios.get(`${API_URL_CONNECTION}/is-connected?otherUserId=${otherUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });


            return {
                otherUserId,
                isConnected: response.data.data
            };

        } catch (err) {
            return rejectWithValue(

                err.response?.data?.message || "Bağlantı kontrol hatası"
            );
        }
    }
);


export const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(isConnected.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(isConnected.fulfilled, (state, action) => {
            state.loading = false;
            const { otherUserId, isConnected } = action.payload;

            state.isConnectedMap = {
                ...state.isConnectedMap,
                [otherUserId]: isConnected,
            };
        });

        builder.addCase(isConnected.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isConnected = null;
        });
    }
})

export const { } = connectionSlice.actions

export default connectionSlice.reducer