import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import type { AssetsType, EmployeeRole } from "../../../types";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { fetchEmployees } from "../../../features/employees/employeesSlice";
import { employeeApi } from "../../../api/employee";

interface Inputs {
  name: string;
  password: string;
  email: string;
  branch: AssetsType;
  role: EmployeeRole;
  employeeId: string;
}

export default function AddEmployee({ close }: { close: () => void }) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // redux
  const roles = useAppSelector((state) => state.roles);
  const branches = useAppSelector((state) => state.assets.branches);
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  // add handler
  const addHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      setError("");

      const formData: any = { ...data };
      formData.branchId = data.branch.id;
      formData.roleId = data.role.id;

      await employeeApi.addEmployee(formData);
      dispatch(fetchEmployees());
      toast.success("Employee Added");
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-sm:w-[96%] w-[500px] px-5 py-5 rounded-lg outline-none">
      <div className="flex justify-between items-center pb-1 border-b border-primary">
        <Typography variant="h6" className=" !font-semibold">
          Add New Employee
        </Typography>
        <IconButton onClick={close}>
          <Close />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit(addHandler)}>
        <div className="flex flex-col gap-4 mt-5">
          <TextField
            fullWidth
            error={Boolean(errors["name"])}
            label="Name"
            {...register("name", { required: true })}
          />
          <TextField
            fullWidth
            error={Boolean(errors["password"])}
            label="Password"
            {...register("password", { required: true })}
          />
          <TextField
            fullWidth
            error={Boolean(errors["email"])}
            label="Email"
            {...register("email", { required: false })}
          />
          <TextField
            fullWidth
            error={Boolean(errors["employeeId"])}
            label="Employee ID"
            {...register("employeeId", { required: true })}
          />

          <Controller
            control={control}
            name="role"
            rules={{ required: true }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Autocomplete
                options={roles}
                value={value || null}
                onChange={(_, val) => onChange(val)}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, val) => option.id === val.id}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(error)}
                    {...params}
                    label="Select Role"
                  />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="branch"
            rules={{ required: true }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Autocomplete
                options={branches}
                value={value || null}
                onChange={(_, val) => onChange(val)}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, val) => option.id === val.id}
                renderInput={(params) => (
                  <TextField
                    error={Boolean(error)}
                    {...params}
                    label="Select CSC"
                  />
                )}
              />
            )}
          />

          {error && (
            <Typography className="!text-red-500 text-center">
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            className="!py-3 !text-sm !normal-case"
            startIcon={<Add />}
            disabled={loading}
          >
            Add new Employee
          </Button>
        </div>
      </form>
    </div>
  );
}
