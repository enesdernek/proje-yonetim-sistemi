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



export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder

       
    }
});

export const {  } = taskSlice.actions;

export default taskSlice.reducer;
