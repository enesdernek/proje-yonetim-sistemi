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
            });


    }
});

export const { } = taskSlice.actions;

export default taskSlice.reducer;
