import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_TASK = import.meta.env.VITE_API_URL + "/tasks";

const initialState = {
    tasks: [],
    task: null,

    totalPages: 0,
    totalElements: 0,

    loading: false,
    error: null
};

export const createTask = createAsyncThunk(
    "task/createTask",
    async ({ taskDtoIU, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL_TASK}/create-task`,
                taskDtoIU,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
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
                "Görev oluşturulurken bir hata oluştu."
            );
        }
    }
);

export const getTasksByProjectId = createAsyncThunk(
    "task/getTasksByProjectId",
    async ({ projectId, pageNo = 1, pageSize = 10, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-all-tasks-by-project-id`,
                {
                    params: { projectId, pageNo, pageSize },
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
                err.response?.data?.message || "Görevler getirilirken bir hata oluştu."
            );
        }
    }
);

export const getProjectTasksByTaskStatus = createAsyncThunk(
    "task/getProjectTasksByTaskStatus",
    async ({ projectId, status, pageNo = 1, pageSize = 10, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-all-project-tasks-by-status`,
                {
                    params: { projectId, status, pageNo, pageSize },
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
                err.response?.data?.message || "Görevler getirilirken bir hata oluştu."
            );
        }
    }
);


export const deleteTask = createAsyncThunk(
    "task/deleteTask",
    async ({ taskId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL_TASK}/delete-task`, {
                params: { taskId },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return taskId;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Görev silinirken bir hata oluştu."
            );
        }
    }
);

export const updateTask = createAsyncThunk(
    "task/updateTask",
    async ({ taskId, taskDtoIU, token }, { rejectWithValue }) => {
        try {
            console.log(taskDtoIU)
            const response = await axios.put(
                `${API_URL_TASK}/update-task`,
                taskDtoIU,
                {
                    params: { taskId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Görev güncellenirken bir hata oluştu."
            );
        }
    }
);

export const changeTaskStatusToDone = createAsyncThunk(
    "task/changeTaskStatusToDone",
    async ({ taskId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_TASK}/change-task-status-to-done`,
                null,
                {
                    params: { taskId },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Görev durumu güncellenirken bir hata oluştu."
            );
        }
    }
);

export const getProjectTasksAssignedToMember = createAsyncThunk(
    "task/getProjectTasksAssignedToMember",
    async ({ projectId, pageNo = 1, pageSize = 10, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-all-project-tasks-assigned-to-member`,
                {
                    params: { projectId, pageNo, pageSize },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Görevler getirilirken bir hata oluştu."
            );
        }
    }
);

export const getAllProjectMembersTasksByProject = createAsyncThunk(
    "task/getAllProjectMembersTasksByProject",
    async ({ projectId, assignedMemberId, pageNo = 1, pageSize = 10, token }, { rejectWithValue }) => {
        console.log(projectId, assignedMemberId, pageNo, pageSize, token)
        try {
            const response = await axios.get(`${API_URL_TASK}/get-all-project-members-tasks-by-project`, {
                params: { projectId, assignedMemberId, pageNo, pageSize },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Görevler getirilirken bir hata oluştu.");
        }
    }
);

export const getUsersAllTasks = createAsyncThunk(
    "task/getUsersAllTasks",
    async ({ pageNo = 1, pageSize = 10, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-users-all-tasks`,
                {
                    params: { pageNo, pageSize },
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
                "Kullanıcının görevleri getirilirken bir hata oluştu."
            );
        }
    }
);

export const getUsersTasksByStatus = createAsyncThunk(
    "task/getUsersTasksByStatus",
    async (
        { status, pageNo = 1, pageSize = 10, token },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-all-users-tasks-by-status`,
                {
                    params: { status, pageNo, pageSize },
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
                "Kullanıcının görevleri status'e göre getirilirken hata oluştu."
            );
        }
    }
);

export const changeTaskStatusToInProgress = createAsyncThunk(
    "task/changeTaskStatusToInProgress",
    async ({ taskId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_TASK}/change-task-status-to-in-progress`,
                null,
                {
                    params: { taskId },
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
                "Görev durumu güncellenirken bir hata oluştu."
            );
        }
    }
);

export const changeTaskStatusToReview = createAsyncThunk(
    "task/changeTaskStatusToReview",
    async ({ taskId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_TASK}/change-task-status-to-review`,
                null,
                {
                    params: { taskId },
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
                "Görev durumu REVIEW yapılırken hata oluştu."
            );
        }
    }
);

export const getUsersTasksByProjectId = createAsyncThunk(
    "task/getUsersTasksByProjectId",
    async (
        { projectId, pageNo = 1, pageSize = 10, token },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-all-users-tasks-by-project`,
                {
                    params: { projectId, pageNo, pageSize },
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
                "Kullanıcının projedeki görevleri getirilirken hata oluştu."
            );
        }
    }
);

export const getUsersTasksByProjectIdAndStatus = createAsyncThunk(
    "task/getUsersTasksByProjectIdAndStatus",
    async (
        { projectId, status, pageNo = 1, pageSize = 10, token },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `${API_URL_TASK}/get-all-users-tasks-by-project-and-status`,
                {
                    params: { projectId, status, pageNo, pageSize },
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
                "Kullanıcının projedeki görevleri status'e göre getirilirken hata oluştu."
            );
        }
    }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.
            addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;

                const createdTask = action.payload;

                state.task = createdTask;

                state.tasks.unshift(createdTask);

                state.totalElements += 1;
            })

            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görev oluşturulamadı.";
            })
            .addCase(getTasksByProjectId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTasksByProjectId.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.taskDtos;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(getTasksByProjectId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })
            .addCase(getProjectTasksByTaskStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectTasksByTaskStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.taskDtos;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(getProjectTasksByTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
                state.totalElements -= 1;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görev silinemedi.";
            })
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;

                const index = state.tasks.findIndex(t => t.taskId === updatedTask.taskId);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }

                state.task = updatedTask;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görev güncellenemedi.";
            })
            .addCase(changeTaskStatusToDone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeTaskStatusToDone.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;

                const index = state.tasks.findIndex(t => t.taskId === updatedTask.taskId);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }

                state.task = updatedTask;
            })
            .addCase(changeTaskStatusToDone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görev durumu güncellenemedi.";
            })
            .addCase(getProjectTasksAssignedToMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectTasksAssignedToMember.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.taskDtos;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(getProjectTasksAssignedToMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })
            .addCase(getAllProjectMembersTasksByProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProjectMembersTasksByProject.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.taskDtos || [];
                state.totalPages = action.payload.totalPages || 0;
                state.totalElements = action.payload.totalElements || 0;
            })
            .addCase(getAllProjectMembersTasksByProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })
            .addCase(getUsersAllTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersAllTasks.fulfilled, (state, action) => {
                state.loading = false;

                state.tasks = action.payload.taskDtos;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(getUsersAllTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })
            .addCase(getUsersTasksByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersTasksByStatus.fulfilled, (state, action) => {
                state.loading = false;

                state.tasks = action.payload.taskDtos;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(getUsersTasksByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })
            .addCase(changeTaskStatusToInProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeTaskStatusToInProgress.fulfilled, (state, action) => {
                state.loading = false;

                const updatedTask = action.payload;

                const index = state.tasks.findIndex(
                    (t) => t.taskId === updatedTask.taskId
                );

                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }

                state.task = updatedTask;
            })
            .addCase(changeTaskStatusToInProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görev durumu güncellenemedi.";
            })
            .addCase(changeTaskStatusToReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeTaskStatusToReview.fulfilled, (state, action) => {
                state.loading = false;

                const updatedTask = action.payload;

                const index = state.tasks.findIndex(
                    (t) => t.taskId === updatedTask.taskId
                );

                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }

                state.task = updatedTask;
            })
            .addCase(changeTaskStatusToReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görev REVIEW durumuna alınamadı.";
            })
            .addCase(getUsersTasksByProjectId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersTasksByProjectId.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.taskDtos || [];
                state.totalPages = action.payload.totalPages || 0;
                state.totalElements = action.payload.totalElements || 0;
            })
            .addCase(getUsersTasksByProjectId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })

            .addCase(getUsersTasksByProjectIdAndStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersTasksByProjectIdAndStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.taskDtos || [];
                state.totalPages = action.payload.totalPages || 0;
                state.totalElements = action.payload.totalElements || 0;
            })
            .addCase(getUsersTasksByProjectIdAndStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Görevler getirilemedi.";
            })

    }
});

export const { } = taskSlice.actions;

export default taskSlice.reducer;
