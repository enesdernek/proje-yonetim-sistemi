import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    connections: [],
    isConnected: null,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    isConnectedMap: {},
};

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
            return rejectWithValue(err.response?.data?.message || "Bağlantı kontrol hatası");
        }
    }
);

export const deleteConnection = createAsyncThunk(
    "connection/deleteConnection",
    async ({ otherUserId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL_CONNECTION}/delete?otherUserId=${otherUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }
            return otherUserId; 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Bağlantı silinirken bir hata oluştu");
        }
    }
);


export const getConnectionsPaged = createAsyncThunk(
    "connection/getConnectionsPaged",
    async ({ userId, token, pageNo = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL_CONNECTION}/get-connections-paged`, {
                params: { userId, pageNo, pageSize },
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }
            return response.data.data; 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Bağlantılar getirilirken hata oluştu");
        }
    }
);

export const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
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

        builder.addCase(deleteConnection.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteConnection.fulfilled, (state, action) => {
            state.loading = false;
            const otherUserId = action.payload;
            state.isConnectedMap = {
                ...state.isConnectedMap,
                [otherUserId]: false, 
            };
        });
        builder.addCase(deleteConnection.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(getConnectionsPaged.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getConnectionsPaged.fulfilled, (state, action) => {
            state.loading = false;
            state.connections = action.payload.connectionDtos || [];
            state.totalElements = action.payload.totalElements || 0;
            state.totalPages = action.payload.totalPages || 0;
        });
        builder.addCase(getConnectionsPaged.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export default connectionSlice.reducer;
