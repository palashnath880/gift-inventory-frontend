import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import inventoryReducer from "./features/inventory/inventorySlice";
import employeesReducer from "./features/employees/employeesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    employees: employeesReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
