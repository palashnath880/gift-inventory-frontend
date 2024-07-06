import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type { AssetsType, Customer } from "../../../types";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { customerApi } from "../../../api/customer";
import toast from "react-hot-toast";

type EditCustomerProps = {
  customer: Customer;
  close: () => void;
  refetch: () => void;
};

type Inputs = {
  name: string;
  phoneNo: string;
  email: string;
  type: number | null;
  project: number | null;
  csc: number | null;
  remarks: string;
};

type SelectOptions = {
  name: "project" | "csc" | "type";
  label: string;
  noOptionText: string;
  options: AssetsType[];
};

export default function EditCustomer({
  close,
  customer,
  refetch,
}: EditCustomerProps) {
  // state
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // react-redux
  const { branches, projects, customerTypes } = useAppSelector(
    (state) => state.assets
  );

  // react-hook-form
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue,
  } = useForm<Inputs>();

  // select input array
  const selectInputsArr: SelectOptions[] = [
    {
      name: "type",
      label: "Select Customer Type",
      noOptionText: "Sorry! No customer matching",
      options: customerTypes,
    },
    {
      name: "project",
      label: "Select Project Name",
      noOptionText: "Sorry! No project matching",
      options: projects,
    },
    {
      name: "csc",
      label: "Select CSC",
      noOptionText: "Sorry! No CSC matching",
      options: branches,
    },
  ];

  // update handler
  const updateHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      setError("");
      await customerApi.update(customer?.id, data);
      toast.success(`${customer?.name} updated successfully`);
      refetch();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer) {
      const csc = branches.find((i) => i.name === customer?.csc)?.id;
      const project = projects.find((i) => i.name === customer?.project)?.id;
      const cusType = customerTypes.find((i) => i.name === customer?.type)?.id;

      setValue("name", customer?.name);
      setValue("email", customer?.email);
      setValue("phoneNo", customer?.phoneNo);
      setValue("csc", csc ? parseInt(csc) : null);
      setValue("project", project ? parseInt(project) : null);
      setValue("type", cusType ? parseInt(cusType) : null);
      setValue("remarks", customer?.remarks);
    }
  }, [customer, branches, customerTypes, projects]);

  return (
    <div className="max-sm:w-[96%] w-[500px] px-5 py-5 rounded-lg outline-none">
      <div className="flex justify-between items-center pb-1 border-b border-primary">
        <Typography variant="h6" className=" !font-semibold">
          Edit <span className="!text-primary">{customer?.name}</span>
        </Typography>
        <IconButton onClick={close}>
          <Close />
        </IconButton>
      </div>
      <form onSubmit={handleSubmit(updateHandler)}>
        <div className="flex flex-col gap-4 mt-5">
          <TextField
            fullWidth
            size="small"
            label="Name"
            error={Boolean(errors["name"])}
            {...register("name", {
              required: true,
              validate: (val) => !/\d/.test(val),
            })}
          />

          <TextField
            fullWidth
            label="Phone No"
            size="small"
            error={Boolean(errors["phoneNo"])}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+88</InputAdornment>
              ),
            }}
            {...register("phoneNo", {
              required: true,
              pattern: {
                value: /^01[3-9]\d{8}$/,
                message: "invalid phone number",
              },
            })}
          />

          <TextField
            fullWidth
            size="small"
            label="Email"
            error={Boolean(errors["email"])}
            {...register("email", {
              required: true,
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid Email",
              },
            })}
          />

          {selectInputsArr.map(({ name, label, noOptionText, options }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Autocomplete
                  options={options}
                  getOptionLabel={(option) => option?.name}
                  noOptionsText={noOptionText}
                  value={options.find((i) => parseInt(i.id) === value) || null}
                  onChange={(_, newVal) => onChange(newVal?.id || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      fullWidth
                      size="small"
                      label={label}
                    />
                  )}
                />
              )}
            />
          ))}

          <div className="col-span-2">
            <TextField
              fullWidth
              label="Remarks"
              multiline
              minRows={3}
              error={Boolean(errors["remarks"])}
              {...register("remarks", { required: false })}
            />
          </div>

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
            disabled={loading}
          >
            Update {customer?.name}
          </Button>
        </div>
      </form>
    </div>
  );
}
