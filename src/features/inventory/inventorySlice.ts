import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { inventoryApi } from "../../api/inventory";
import type { Branch, SKUCode, VoucherCode } from "../../types";

interface InitialState {
  branches: Branch[];
  projects: {
    name: string;
    id: number;
  }[];
  types: {
    name: string;
    id: number;
  }[];
  voucherCodes: VoucherCode[];
  skuCodes: SKUCode[];
  policyPdfUrl: string | null;
}

const initialState: InitialState = {
  branches: [],
  policyPdfUrl: null,
  projects: [],
  types: [],
  voucherCodes: [],
  skuCodes: [],
};

const fetchMetaData = createAsyncThunk("inventory/meta-data", async () => {
  const res = await inventoryApi.getMeta();
  return res.data;
});

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchMetaData.fulfilled, (state, action) => {
      state.branches = action.payload?.branches || [];
      state.policyPdfUrl = action.payload?.policyPdfUrl;
      state.projects = action.payload?.projects || [];
      state.types = action.payload?.types || [];
      state.skuCodes = action.payload?.skuCodes || [];
      state.voucherCodes = action.payload?.voucherCodes || [];
    });
  },
});

export { fetchMetaData };
export default inventorySlice.reducer;
