import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../api/admin";
import type { AssetsType } from "../../types";

interface InitialState {
  loading: boolean;
  isSuccess: boolean;
  branches: AssetsType[];
  projects: AssetsType[];
  customerTypes: AssetsType[];
}

const initialState: InitialState = {
  loading: true,
  branches: [],
  projects: [],
  customerTypes: [],
  isSuccess: false,
};

const fetchAssets = createAsyncThunk("admin/assets", async () => {
  const res = await adminApi.getAssets();
  return res.data;
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAssets.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchAssets.fulfilled, (_, { payload }) => {
        return {
          loading: false,
          branches: payload.branches,
          customerTypes: payload.customerTypes,
          projects: payload.projects,
          isSuccess: true,
        };
      })
      .addCase(fetchAssets.rejected, () => {
        return {
          loading: false,
          projects: [],
          branches: [],
          customerTypes: [],
          isSuccess: false,
        };
      });
  },
});

export { fetchAssets };
export default adminSlice.reducer;
