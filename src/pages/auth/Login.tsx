import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../features/auth/authSlice";
import logo from "../../assets/logo.webp";
import Cookies from "js-cookie";

interface Inputs {
  login: string;
  password: string;
}

export default function Login() {
  // states
  const [isShow, setIsShow] = useState<boolean>(false);

  // react-redux
  const {
    loading,
    data: response,
    error,
  } = useAppSelector((state) => state.auth.login);
  const dispatch = useAppDispatch();

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  // login handler
  const loginHandler = async (data: Inputs): Promise<void> => {
    dispatch(login({ login: data.login, password: data.password }));
  };

  if (response?.token) {
    Cookies.set("auth_token", response?.token, { expires: 7 });
    if (response?.isAdmin) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="bg-white shadow-md rounded-lg max-w-[95%] sm:w-[400px]">
        <div className="px-5 pb-10 pt-7">
          <div className="pb-5 flex justify-center">
            <img
              src={logo}
              draggable={false}
              alt="Logo"
              className="w-28 h-auto"
            />
          </div>
          <form onSubmit={handleSubmit(loginHandler)}>
            <div className="flex flex-col gap-5">
              <TextField
                fullWidth
                error={Boolean(errors["login"])}
                {...register("login", { required: true })}
                label={
                  <Typography variant="body2">Employee ID / Email</Typography>
                }
              />

              <FormControl fullWidth error={Boolean(errors["password"])}>
                <InputLabel htmlFor="outlined-adornment-password-login">
                  <Typography variant="body2">Password</Typography>
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-login"
                  type={isShow ? "text" : "password"}
                  {...register("password", { required: true })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setIsShow(!isShow)}
                        onMouseDown={() => setIsShow(!isShow)}
                        edge="end"
                        size="medium"
                      >
                        {isShow ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <div className="flex justify-center">
                <Typography
                  variant="body2"
                  component={Link}
                  to={"/forgot-password"}
                  className="hover:!underline !font-medium"
                >
                  Forgot Password
                </Typography>
              </div>
              {error && (
                <Typography
                  className="!text-red-500 !text-center"
                  variant="body2"
                >
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                fullWidth
                startIcon={
                  loading && <CircularProgress color="inherit" size={20} />
                }
                className="!py-2.5"
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
