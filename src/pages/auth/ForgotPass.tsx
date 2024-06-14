import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface Inputs {
  login: string;
  password: string;
}

export default function ForgotPass() {
  // states
  const [loading, setLoading] = useState<boolean>(false);

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  // login handler
  const loginHandler = async (data: Inputs): Promise<void> => {
    try {
      setLoading(true);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="bg-white shadow-md max-w-[95%] sm:w-[400px]">
        <div className="px-5 py-10">
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

              <div className="flex justify-center">
                <Typography
                  variant="body2"
                  component={Link}
                  to={"/login"}
                  className="hover:!underline !font-medium"
                >
                  Login Here
                </Typography>
              </div>
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                fullWidth
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
