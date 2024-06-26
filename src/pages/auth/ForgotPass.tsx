import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import ResetPWDUpdate from "./ResetPWDUpdate";

interface Inputs {
  login: string;
}

export default function ForgotPass() {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [search] = useSearchParams();
  const token = search.get("token");

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Inputs>();

  // login handler
  const loginHandler: SubmitHandler<Inputs> = async (data): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      await authApi.sendResetLink(data.login);
      toast.success("Your password reset link was sent successfully.");
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return <ResetPWDUpdate token={token} />;
  }

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="bg-white shadow-md max-w-[95%] sm:w-[400px]">
        <div className="px-5 pb-10 pt-5">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit(loginHandler)} className="!mt-5">
            <div className="flex flex-col gap-5">
              <TextField
                fullWidth
                error={Boolean(errors["login"])}
                {...register("login", { required: true })}
                label="Employee ID / Email"
              />

              <div className="flex justify-center">
                <Typography
                  component={Link}
                  to={"/login"}
                  className="!underline !font-medium"
                >
                  Login Here
                </Typography>
              </div>
              {error && (
                <Typography className="!text-center !text-red-500">
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                type="submit"
                disabled={loading}
                variant="contained"
                className="!py-3 !text-sm !capitalize"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
