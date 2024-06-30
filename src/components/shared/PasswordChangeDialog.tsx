import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { bindDialog } from "material-ui-popup-state";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { authApi } from "../../api/auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Inputs {
  currentPwd: string;
  newPwd: string;
}

export default function PasswordChangeDialog({
  popupState,
}: {
  popupState: any;
}) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  // handle close
  const handleClose = () => {
    reset();
    popupState.close();
  };

  // password update handler
  const updateHandler: SubmitHandler<Inputs> = async (data) => {
    if (data?.currentPwd === data?.newPwd) {
      setError("Current password and new password are the same");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await authApi.updatePWD(data);
      toast.success("Password update successfully.");
      reset();
      Cookies.remove("auth_token");
      window.location.href = "/login";
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog {...bindDialog(popupState)}>
      <div className="px-5 pt-3 pb-6 bg-white  w-[96%] sm:w-[380px]">
        <div className="flex justify-between items-center border-b ">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Change Password
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
        <form onSubmit={handleSubmit(updateHandler)}>
          <div className="flex flex-col gap-4 mt-4">
            <TextField
              fullWidth
              label="Current Password"
              error={Boolean(errors["currentPwd"])}
              {...register("currentPwd", { required: true })}
            />
            <TextField
              fullWidth
              label="New Password"
              error={Boolean(errors["newPwd"])}
              {...register("newPwd", { required: true })}
            />
            {error && (
              <Typography className="!text-center !text-red-500">
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              className="!text-sm !capitalize !py-3"
              disabled={loading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
