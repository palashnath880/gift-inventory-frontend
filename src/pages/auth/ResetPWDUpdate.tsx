import { Alert, Button, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/shared/Loader";
import { useNavigate } from "react-router-dom";

interface Inputs {
  password: string;
  confirmPassword: string;
}
export default function ResetPWDUpdate({
  token,
}: {
  token: string | undefined;
}) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Inputs>();

  // password update handler
  const passwordUpdateHandler: SubmitHandler<Inputs> = async (
    data
  ): Promise<void> => {
    if (data?.confirmPassword !== data?.password) {
      setError("Password does not matched");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await authApi.updateResetPWD(token, data.password);
      toast.success("Your password updated successfully.");
      navigate("/", { replace: true });
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // verify token
  const { isLoading, data } = useQuery({
    queryKey: ["verifyToken", token],
    queryFn: async () => {
      const res = await authApi.verifyResetToken(token);
      return res.data;
    },
  });

  // loader
  if (isLoading) {
    return <Loader />;
  }

  if (!data?.id) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Alert severity="error">
          <Typography variant="h6" className="!font-semibold">
            This URL is expired
          </Typography>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="bg-white shadow-md max-w-[95%] sm:w-[400px]">
        <div className="px-5 pb-10 pt-5">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Set New Password
          </Typography>
          <form
            onSubmit={handleSubmit(passwordUpdateHandler)}
            className="!mt-5"
          >
            <div className="flex flex-col gap-5">
              <TextField
                fullWidth
                error={Boolean(errors["password"])}
                {...register("password", { required: true })}
                label="Password"
              />
              <TextField
                fullWidth
                error={Boolean(errors["confirmPassword"])}
                {...register("confirmPassword", { required: true })}
                label="Confirm Password"
              />

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
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
