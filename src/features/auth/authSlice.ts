import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../api/auth";
import Cookies from "js-cookie";
import type { User } from "../../types";

interface InitialState {
  loading: boolean;
  user: User | null;
  login: {
    loading: boolean;
    data: null | { token: string };
    error: string;
  };
  resetLink: {
    loading: boolean;
    data: null | { message: string };
    error: string;
  };
}

const initialState: InitialState = {
  loading: true,
  user: null,
  login: {
    loading: false,
    data: null,
    error: "",
  },
  resetLink: {
    loading: false,
    data: null,
    error: "",
  },
};

// login reducer
const login = createAsyncThunk<
  { token: string },
  { login: string; password: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { login, password } = payload;
    const res = await authApi.login({ login, password });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message);
  }
});

// forgot password reducer
const sendResetLink = createAsyncThunk<{ message: string }, { login: string }>(
  "auth/send-reset-link",
  async (payload) => {
    const res = await authApi.sendResetLink(payload.login);
    return res.data;
  }
);

// verify user
const verifyUser = createAsyncThunk("auth/verifyUser", async () => {
  const res = await authApi.verify();
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logOut: () => {
      Cookies.remove("auth_token");
    },
    loadingOff: (state) => {
      return { ...state, loading: false, user: null };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state: InitialState) => {
        return {
          ...state,
          login: { ...state.login, loading: true, error: "" },
        };
      })
      .addCase(
        login.fulfilled,
        (state: InitialState, action: { payload: { token: string } }) => {
          return {
            ...state,
            login: { ...state.login, loading: false, data: action.payload },
          };
        }
      )
      .addCase(login.rejected, (state: InitialState, action: any) => {
        return {
          ...state,
          login: {
            ...state.login,
            loading: false,
            data: null,
            error: action.payload || "Sorry! Something went wrong",
          },
        };
      })
      .addCase(verifyUser.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        return { ...state, loading: false, user: action.payload };
      })
      .addCase(verifyUser.rejected, (state) => {
        return { ...state, loading: false, user: null };
      });
  },
});

export const { logOut, loadingOff } = authSlice.actions;
export { login, sendResetLink, verifyUser };
export default authSlice.reducer;
