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


    }
});

export const { } = taskSlice.actions;

export default taskSlice.reducer;
