import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../api/admin";
import type { EmployeeRole } from "../../types";

const fetchRoles = createAsyncThunk("admin/employeeRole", async () => {
  const res = await adminApi.getRoles();
  return res.data;
});

const initialState: EmployeeRole[] = [];

const employeeRoleSlice = createSlice({
  name: "admin/employeeRole",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRoles.pending, () => [])
      .addCase(fetchRoles.fulfilled, (_, action) => action.payload)
      .addCase(fetchRoles.rejected, () => []);
  },
});

export { fetchRoles };
export default employeeRoleSlice.reducer;
