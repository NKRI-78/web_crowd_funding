import { Project } from "@/app/interfaces/project/IProject";
import {
  projectDelete,
  projectList,
  projectStore,
  projectUpdate,
} from "@lib/projectService";
import { createSlice, createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";

interface ProjectState {
  loading: boolean;
}

const initialState: ProjectState = {
  loading: false,
};

export const projectListAsync = createAsyncThunk("project/list", async () => {
  const response = await projectList();
  return response;
});

export const projectStoreAsync = createAsyncThunk(
  "project/store",
  async ({ project }: { project: Project }) => {
    const response = await projectStore(project);
    return response;
  }
);

export const projectUpdateAsync = createAsyncThunk(
  "project/update",
  async ({ project }: { project: Project }) => {
    const response = await projectUpdate(project);
    return response;
  }
);

export const projectDeleteAsync = createAsyncThunk(
  "project/delete",
  async ({ project }: { project: Project }) => {
    const response = await projectDelete(project);
    return response;
  }
);

const handleAsyncThunk = <Returned, ThunkArg>(
  builder: any,
  asyncThunk: AsyncThunk<Returned, ThunkArg, {}>
) => {
  builder
    .addCase(asyncThunk.pending, (state: ProjectState) => {
      state.loading = true;
    })
    .addCase(asyncThunk.fulfilled, (state: ProjectState) => {
      state.loading = false;
    })
    .addCase(asyncThunk.rejected, (state: ProjectState) => {
      state.loading = false;
    });
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunk(builder, projectListAsync);
    handleAsyncThunk(builder, projectStoreAsync);
    handleAsyncThunk(builder, projectUpdateAsync);
    handleAsyncThunk(builder, projectDeleteAsync);
  },
});

export default projectSlice.reducer;
