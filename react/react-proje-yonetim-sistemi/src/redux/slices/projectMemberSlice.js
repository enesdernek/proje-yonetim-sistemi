import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    projectMember: null,
    projectRoles: {},
    loading: false,
    error: null,
}

const API_URL_PROJECT_MEMBER = import.meta.env.VITE_API_URL + "/project-members";


export const getProjectMemberByUserIdAndProjectId = createAsyncThunk(
    "projectMember/getByUserIdAndProjectId",
    async ({ userId, projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_PROJECT_MEMBER}/get-by-user-id-and-project-id?userId=${userId}&projectId=${projectId}`,
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
            console.log(err)

            return rejectWithValue(
                err.response?.data?.message || "Proje üyesi getirilirken bir hata oluştu."
            );
        }
    }
);

export const projectMemberSlice = createSlice({
    name: 'projectMember',
    initialState,
    reducers: {

    }, extraReducers: (builder) => {

        builder.addCase(getProjectMemberByUserIdAndProjectId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(getProjectMemberByUserIdAndProjectId.fulfilled, (state, action) => {
            state.loading = false;
            state.projectMember = action.payload;

            const projectId = action.payload.projectDto?.projectId;
            const role = action.payload.role;

            if (!state.projectRoles) state.projectRoles = {}; 

            if (projectId) {
                state.projectRoles[projectId] = role;
            }
        });

        builder.addCase(getProjectMemberByUserIdAndProjectId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    }
})

// Action creators are generated for each case reducer function
export const { } = projectMemberSlice.actions

export default projectMemberSlice.reducer