import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
    projects: [],
    project: null,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null
};

const API_URL_PROJECT = import.meta.env.VITE_API_URL + "/projects";

export const getProjectsByUserId = createAsyncThunk(
    "project/getProjectsByUserId",
    async ({ pageNo, pageSize, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_PROJECT}/get-projects-by-user-id?pageNo=${pageNo}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Projeler getirilirken hata oluştu."
            );
        }
    }
);

export const getProjectById = createAsyncThunk(
    "project/getProjectById",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_PROJECT}/get-project-by-id?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data; 
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje getirilirken hata oluştu."
            );
        }
    }
);

///////////////////////////////////////////////////////////////////////////////////////////////////

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getProjectsByUserId.fulfilled, (state, action) => {
                state.loading = false;

                state.projects = action.payload.projectDtos;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })

            .addCase(getProjectsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Projeler getirilemedi.";
            })
            .addCase(getProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.project = null;
            })
            .addCase(getProjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload; 
            })
            .addCase(getProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Proje getirilemedi.";
            });
    }
})

export const { } = projectSlice.actions

export default projectSlice.reducer