import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_PROJECT_STATISTICS = import.meta.env.VITE_API_URL + "/project-statistics";

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

export const getProjectStatisticsById = createAsyncThunk(
  "projectStatistics/getByProjectId",
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL_PROJECT_STATISTICS}/get-by-project-id`, {
        params: { projectId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Proje istatistikleri getirilemedi.");
      }

      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Proje istatistikleri getirilirken bir hata oluştu.");
    }
  }
);

export const projectStatisticsSlice = createSlice({
  name: "projectStatistics",
  initialState,
  reducers: {
    clearProjectStatistics: (state) => {
      state.stats = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectStatisticsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectStatisticsById.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getProjectStatisticsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Proje istatistikleri getirilemedi.";
      });
  },
});

export const { clearProjectStatistics } = projectStatisticsSlice.actions;

export default projectStatisticsSlice.reducer;
