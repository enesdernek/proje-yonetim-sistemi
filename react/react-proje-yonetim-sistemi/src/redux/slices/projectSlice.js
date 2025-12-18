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

export const updateProject = createAsyncThunk(
    "project/updateProject",
    async ({ projectId, projectDtoIU, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/update-project?projectId=${projectId}`,
                projectDtoIU,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje güncellenirken bir hata oluştu."
            );
        }
    }
);

export const uploadProjectImage = createAsyncThunk(
    "project/uploadProjectImage",
    async ({ projectId, file, token }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.put(
                `${API_URL_PROJECT}/upload-project-image?projectId=${projectId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje resmi yüklenirken bir hata oluştu."
            );
        }
    }
);

export const deleteProjectImage = createAsyncThunk(
    "project/deleteProjectImage",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_URL_PROJECT}/delete-project-image?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje resmi silinirken bir hata oluştu."
            );
        }
    }
);

export const cancelProject = createAsyncThunk(
    "project/cancelProject",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/cancel-project?projectId=${projectId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data; 
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje iptal edilirken hata oluştu."
            );
        }
    }
);

export const onHoldProject = createAsyncThunk(
    "project/onHoldProject",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/onhold-project?projectId=${projectId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje beklemeye alınırken hata oluştu."
            );
        }
    }
);

export const startProject = createAsyncThunk(
    "project/startProject",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/start-project?projectId=${projectId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje başlatılırken hata oluştu."
            );
        }
    }
);

export const createProject = createAsyncThunk(
    "project/createProject",
    async ({ projectDtoIU, file, token }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            formData.append(
                "project",
                new Blob([JSON.stringify(projectDtoIU)], {
                    type: "application/json",
                })
            );

            if (file) {
                formData.append("file", file);
            }

            const response = await axios.post(
                `${API_URL_PROJECT}/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Proje oluşturulurken bir hata oluştu."
            );
        }
    }
);

export const restartProject = createAsyncThunk(
    "project/restartProject",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/restart-project?projectId=${projectId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Proje tekrar hayata geçirilirken hata oluştu."
            );
        }
    }
);

export const updateProjectProgress = createAsyncThunk(
    "project/updateProjectProgress",
    async ({ projectId, process, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/update-progress?projectId=${projectId}&process=${process}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Proje ilerlemesi güncellenirken hata oluştu."
            );
        }
    }
);

export const deleteProjectByProjectId = createAsyncThunk(
    "project/deleteProjectByProjectId",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_URL_PROJECT}/delete-project-by-project-id?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return { projectId };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Proje silinirken hata oluştu."
            );
        }
    }
);

export const completeProject = createAsyncThunk(
    "project/completeProject",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT}/complete-project?projectId=${projectId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Proje tamamlanırken hata oluştu."
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
            })

            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;

                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(uploadProjectImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadProjectImage.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;

                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(uploadProjectImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProjectImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProjectImage.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;

                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(deleteProjectImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(cancelProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelProject.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;
                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(cancelProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(onHoldProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(onHoldProject.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;
                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(onHoldProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(startProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startProject.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;
                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(startProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;

                const createdProject = action.payload;

                state.project = createdProject;

                state.projects.unshift(createdProject);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(restartProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(restartProject.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;

                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(restartProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProjectProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProjectProgress.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;

                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(updateProjectProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Proje ilerlemesi güncellenemedi.";
            })
            .addCase(deleteProjectByProjectId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProjectByProjectId.fulfilled, (state, action) => {
                state.loading = false;

                const { projectId } = action.payload;

                if (state.project?.projectId === projectId) {
                    state.project = null;
                }

                state.projects = state.projects.filter(
                    (p) => p.projectId !== projectId
                );
            })
            .addCase(deleteProjectByProjectId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Proje silinemedi.";
            })
            .addCase(completeProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeProject.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProject = action.payload;

                state.project = updatedProject;

                const index = state.projects.findIndex(
                    (p) => p.projectId === updatedProject.projectId
                );

                if (index !== -1) {
                    state.projects[index] = updatedProject;
                }
            })
            .addCase(completeProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Proje tamamlanamadı.";
            })
    }
})

export const { } = projectSlice.actions

export default projectSlice.reducer