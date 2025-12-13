import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    members: [],
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

export const getProjectMembers = createAsyncThunk(
    "projectMember/getProjectMembers",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL_PROJECT_MEMBER}/get-members?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            console.log(response.data)

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Proje üyeleri getirilirken hata oluştu."
            );
        }
    }
);

export const changeMembersRole = createAsyncThunk(
    "projectMember/changeMembersRole",
    async ({ roleChangedUserId, projectId, role, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL_PROJECT_MEMBER}/change-members-role?roleChangedUserId=${roleChangedUserId}&projectId=${projectId}&role=${role}`,
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
                err.response?.data?.message || "Üyenin rolü değiştirilirken bir hata oluştu."
            );
        }
    }
);

export const deleteMemberFromProject = createAsyncThunk(
    "projectMember/deleteMemberFromProject",
    async ({ deletedUserId, projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_URL_PROJECT_MEMBER}/delete-member-by-user-id-and-project-id?deletedUserId=${deletedUserId}&projectId=${projectId}`,
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
                err.response?.data?.message || "Üye silinirken hata oluştu."
            );
        }
    }
);

export const addProjectMembers = createAsyncThunk(
    "projectMember/addProjectMembers",
    async ({ projectId, members, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL_PROJECT_MEMBER}/add-members?projectId=${projectId}`,
                members,
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
                err.response?.data?.message || "Üyeler eklenirken bir hata oluştu."
            );
        }
    }
);

export const leaveProject = createAsyncThunk(
    "projectMember/leaveProject",
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_URL_PROJECT_MEMBER}/leave-project?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return { projectId };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Projeden ayrılırken bir hata oluştu."
            );
        }
    }
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const projectMemberSlice = createSlice({
    name: 'projectMember',
    initialState,
    reducers: {

    }, extraReducers: (builder) => {
        builder
            .addCase(getProjectMemberByUserIdAndProjectId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectMemberByUserIdAndProjectId.fulfilled, (state, action) => {
                state.loading = false;
                state.projectMember = action.payload;

                const projectId = action.payload.projectDto?.projectId;
                const role = action.payload.role;

                if (!state.projectRoles) state.projectRoles = {};

                if (projectId) {
                    state.projectRoles[projectId] = role;
                }
            })
            .addCase(getProjectMemberByUserIdAndProjectId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getProjectMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProjectMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(getProjectMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Proje üyeleri getirilemedi.";
            })
            .addCase(changeMembersRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeMembersRole.fulfilled, (state, action) => {
                state.loading = false;

                const updatedMember = action.payload;

                const index = state.members.findIndex(
                    (m) => m.userDto?.userId === updatedMember.userDto?.userId
                );

                if (index !== -1) {
                    state.members[index] = updatedMember;
                }

                const projectId = updatedMember.projectDto?.projectId;
                const role = updatedMember.role;


                state.projectMember = updatedMember;
            })
            .addCase(changeMembersRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMemberFromProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMemberFromProject.fulfilled, (state, action) => {
                state.loading = false;

                state.members = action.payload;

                const stillMember = action.payload.some(
                    (m) => m.userDto.userId === state.projectMember?.userDto?.userId
                );

                if (!stillMember) {
                    state.projectMember = null;
                }
            })
            .addCase(deleteMemberFromProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProjectMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProjectMembers.fulfilled, (state, action) => {
                state.loading = false;

                state.members = action.payload;

                const stillMember = action.payload.some(
                    (m) => m.userDto.userId === state.projectMember?.userDto?.userId
                );

                if (!stillMember) {
                    state.projectMember = null;
                }
            })
            .addCase(addProjectMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(leaveProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(leaveProject.fulfilled, (state, action) => {
                state.loading = false;

                const { projectId } = action.payload;

                state.projectMember = null;

                if (state.projectRoles?.[projectId]) {
                    delete state.projectRoles[projectId];
                }

                if (state.members && state.members.length > 0) {
                    state.members = state.members.filter(
                        (m) => m.projectDto?.projectId !== projectId
                    );
                }
            })
            .addCase(leaveProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

// Action creators are generated for each case reducer function
export const { } = projectMemberSlice.actions

export default projectMemberSlice.reducer