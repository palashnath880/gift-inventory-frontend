import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Employee } from "../../types";
import { employeeApi } from "../../api/employee";

interface InitialState {
  loading: boolean;
  employees: Employee[];
}

const initialState: InitialState = {
  loading: true,
  employees: [],
};

// fetch employee
const fetchEmployees = createAsyncThunk("employees", async () => {
  const res = await employeeApi.getAll();
  return res.data;
});

const employeesSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchEmployees.fulfilled, (_, action) => {
        return { loading: false, employees: action.payload };
      });
  },
});

export { fetchEmployees };
export default employeesSlice.reducer;
