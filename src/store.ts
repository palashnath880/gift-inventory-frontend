import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import inventoryReducer from "./features/inventory/inventorySlice";
import employeesReducer from "./features/employees/employeesSlice";
import adminReducer from "./features/admin/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    employees: employeesReducer,
    assets: adminReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
