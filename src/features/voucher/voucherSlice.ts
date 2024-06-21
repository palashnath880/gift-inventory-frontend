import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../api/admin";
import type { VoucherCodeType } from "../../types";

const fetchVouchers = createAsyncThunk("admin/vouchers", async () => {
  const res = await adminApi.getVouchers();
  return res.data;
});

const initialState: VoucherCodeType[] = [];

const voucherSlice = createSlice({
  name: "admin/vouchers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchVouchers.fulfilled, (_, action) => action.payload);
  },
});

export { fetchVouchers };
export default voucherSlice.reducer;
