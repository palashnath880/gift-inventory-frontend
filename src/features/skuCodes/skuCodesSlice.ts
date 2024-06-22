import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../api/admin";
import type { SKUCode } from "../../types";

const fetchSKUCodes = createAsyncThunk("admin/skuCodes", async () => {
  const res = await adminApi.getSKUCodes();
  return res.data;
});

const initialState: SKUCode[] = [];

const skuCodeSlice = createSlice({
  name: "admin/skuCodes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchSKUCodes.fulfilled, (_, action) => action.payload);
  },
});

export { fetchSKUCodes };
export default skuCodeSlice.reducer;
