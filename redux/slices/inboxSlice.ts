import { InboxResponse } from "@/app/components/notif/inbox-interface";
import { fetchInboxClient } from "@/app/lib/fetchInbox";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface InboxState {
  items: InboxResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: InboxState = {
  items: [],
  loading: false,
  error: null,
};

// 🔹 Async thunk
export const fetchInboxThunk = createAsyncThunk<
  InboxResponse[],
  string,
  { rejectValue: string }
>("inbox/fetchInbox", async (token, { rejectWithValue }) => {
  try {
    return await fetchInboxClient(token);
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal fetch inbox");
  }
});

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    updateInboxes(state, action) {
      state.items = action.payload;
    },
    clearInbox(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInboxThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInboxThunk.fulfilled,
        (state, action: PayloadAction<InboxResponse[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchInboxThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Terjadi kesalahan";
      });
  },
});

export const { clearInbox, updateInboxes } = inboxSlice.actions;
export default inboxSlice.reducer;
