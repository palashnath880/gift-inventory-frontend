import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  loading: boolean;
  employees: Employee[];
}

const initialState: InitialState = {
  loading: true,
  employees: [],
};

// fetch employee

const employeesSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers(builder) {},
});
