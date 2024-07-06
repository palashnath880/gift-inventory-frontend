import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import type { AssetsType, Employee, EmployeeRole } from "../../../types";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { employeeApi } from "../../../api/employee";

type EditEmployeeProps = {
  close: () => void;
  employee: Employee;
  refetch: () => void;
};

type UpdateInputs = {
  role: EmployeeRole | null;
  branch: AssetsType | null;
};

export default function EditEmployee({
  close,
  employee,
  refetch,
}: EditEmployeeProps) {
  // state
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const roles = useAppSelector((state) => state.roles);
  const branches = useAppSelector((state) => state.assets.branches);

  // react hook form
  const { handleSubmit, control, setValue, watch } = useForm<UpdateInputs>();

  // employee update handler
  const updateHandler: SubmitHandler<UpdateInputs> = async (data) => {
    try {
      setLoading(true);

      const formData = {
        branch: data?.branch?.id,
        role: data?.role?.id,
      };
      await employeeApi.updateEmployee(employee?.id, formData);
      toast.success(`${employee?.name} Updated Successfully`);
      close();
      refetch();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee) {
      if (employee?.branch) {
        const branch = branches.find((i) => i.name === employee.branch);
        branch && setValue("branch", branch);
      }
      if (employee?.role) {
        const role = roles.find((i) => i.name === employee.role);
        role && setValue("role", role);
      }
    }

    watch(({ branch, role }) => {
      const checkRole = role && role?.name !== employee.role;
      const checkCsc = branch && branch?.name !== employee.branch;
      if (checkRole || checkCsc) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    });
  }, [employee, roles, branches]);

  return (
    <div className="max-sm:w-[96%] w-[500px] px-5 py-5 rounded-lg outline-none">
      <div className="flex justify-between items-center pb-1 border-b border-primary">
        <Typography variant="h6" className=" !font-semibold">
          Edit <span className="!text-primary">{employee?.name}</span>
        </Typography>
        <IconButton onClick={close}>
          <Close />
        </IconButton>
      </div>
      <form onSubmit={handleSubmit(updateHandler)}>
        <div className="flex flex-col gap-4 mt-5">
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
            startIcon={
              loading && <CircularProgress color="inherit" size={22} />
            }
            disabled={loading || Boolean(!isChanged)}
          >
            Update {employee?.name}
          </Button>
        </div>
      </form>
    </div>
  );
}
