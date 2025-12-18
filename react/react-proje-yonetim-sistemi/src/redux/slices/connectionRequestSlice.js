import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"

const API_URL_CONNECTION_REQUESTS = import.meta.env.VITE_API_URL + "/connection-requests";


export const getUsersRecievedConnectionRequests = createAsyncThunk(
  "connectionRequest/getUsersRecievedConnectionRequests",
  async ({ token, pageNo, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL_CONNECTION_REQUESTS}/get-all-users-received-connection-requests-paged?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data;

    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "connectionRequest/acceptConnectionRequest",
  async ({ token, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL_CONNECTION_REQUESTS}/accept-request?requestId=${requestId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.success) return rejectWithValue(response.data.message);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
    }
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  "connectionRequest/rejectConnectionRequest",
  async ({ token, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL_CONNECTION_REQUESTS}/reject-request?requestId=${requestId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data)

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
    }
  }
);

export const getUsersSendedConnectionRequests = createAsyncThunk(
  "connectionRequest/getUsersSendedConnectionRequests",
  async ({ token, pageNo, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL_CONNECTION_REQUESTS}/get-all-users-sended-connection-requests-paged?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
    }
  }
);

export const deleteConnectionRequest = createAsyncThunk(
  "connectionRequest/deleteConnectionRequest",
  async ({ token, requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL_CONNECTION_REQUESTS}/delete?requestId=${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data)

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return requestId;

    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bağlantı isteği silinirken bir hata oluştu");
    }
  }
);

export const createConnectionRequest = createAsyncThunk(
  "connectionRequest/createConnectionRequest",
  async ({ token, connectionRequestDtoIU }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL_CONNECTION_REQUESTS}/create`,
        connectionRequestDtoIU,
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
        err.response?.data?.message || "Bağlantı isteği gönderilirken bir hata oluştu"
      );
    }
  }
);



const initialState = {
  recievedConnectionRequests: [],
  sendedConnectionRequests: [],

  receivedPagination: {
    pageNo: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },

  sentPagination: {
    pageNo: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },

  loading: false,
  error: null,
  successMessage: null,
};


export const connectionRequestSlice = createSlice({
  name: 'connectionRequest',
  initialState,
  reducers: {
    clearConnectionRequestsState: (state) => {
      state.sendedConnectionRequests = [];
      state.recievedConnectionRequests = [];
      state.error = null;
      state.successMessage = null;
    }

  }, extraReducers: (builder) => {
    builder
      .addCase(getUsersRecievedConnectionRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersRecievedConnectionRequests.fulfilled, (state, action) => {
        state.loading = false;

        const { requestDtos, totalElements, totalPages } = action.payload.data;

        state.recievedConnectionRequests = requestDtos;

        state.receivedPagination = {
          pageNo: action.meta.arg.pageNo,
          pageSize: action.meta.arg.pageSize,
          totalElements,
          totalPages,
        };
      })
      .addCase(getUsersRecievedConnectionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu";
      })
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRequest = action.payload;

        state.recievedConnectionRequests = state.recievedConnectionRequests.map(req =>
          req.requestId === updatedRequest.requestId
            ? { ...req, status: updatedRequest.status }
            : req
        );
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu";
      })
      .addCase(rejectConnectionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRequest = action.payload;

        state.recievedConnectionRequests = state.recievedConnectionRequests.map(req =>
          req.requestId === updatedRequest.requestId
            ? { ...req, status: updatedRequest.status }
            : req
        );
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bağlantı isteği reddedilirken bir hata oluştu";
      })
      .addCase(getUsersSendedConnectionRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersSendedConnectionRequests.fulfilled, (state, action) => {
        state.loading = false;

        const { requestDtos, totalElements, totalPages } = action.payload.data;

        state.sendedConnectionRequests = requestDtos;

        state.sentPagination = {
          pageNo: action.meta.arg.pageNo,
          pageSize: action.meta.arg.pageSize,
          totalElements,
          totalPages,
        };
      })
      .addCase(getUsersSendedConnectionRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu";
      })

      .addCase(deleteConnectionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        const requestId = action.payload;

        state.recievedConnectionRequests = state.recievedConnectionRequests.filter(req => req.requestId !== requestId);
        state.sendedConnectionRequests = state.sendedConnectionRequests.filter(req => req.requestId !== requestId);
      })
    builder.addCase(deleteConnectionRequest.rejected, (state, action) => {
      state.loading = false;


      if (action.payload === "İstek önceden kabul edilmiş") {
        state.sendedConnectionRequests = state.sendedConnectionRequests.filter(
          req => req.receiverId !== action.meta.arg.receiverId
        );
      } else {
        state.error = action.payload || "Bağlantı isteği silinirken bir hata oluştu";
      }
    })
      .addCase(createConnectionRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        const newRequest = action.payload;
        state.sendedConnectionRequests.unshift(newRequest);
        state.successMessage = "Bağlantı isteği gönderildi.";
      })
      .addCase(createConnectionRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bağlantı isteği gönderilirken bir hata oluştu";
      });
  },
})

export const {clearConnectionRequestsState } = connectionRequestSlice.actions

export default connectionRequestSlice.reducer