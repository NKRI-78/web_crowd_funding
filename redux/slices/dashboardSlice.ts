// app/store/dashboardSlice.ts
import { DashboardData } from "@/app/interfaces/dashboard/dashboard";
import { fetchDashboard } from "@/app/lib/fetchDashboard";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboardClient = createAsyncThunk<
  DashboardData,
  string, // token
  { rejectValue: string }
>("dashboard/fetchDashboard", async (token, { rejectWithValue }) => {
  try {
    return await fetchDashboard(token);
  } catch (err) {
    return rejectWithValue("Gagal mengambil dashboard investor");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardClient.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Terjadi kesalahan";
      });
  },
});

export default dashboardSlice.reducer;
