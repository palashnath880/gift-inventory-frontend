import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  Button,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import PageHeader from "../components/shared/PageHeader";

interface Inputs {
  name: string;
  phoneNo: string;
  email: string;
  type: string[];
  project: string[];
  csc: string;
  remarks: string;
}

export default function CreateCustomer() {
  // react-hook-form
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<Inputs>();

  // add customer handler
  const addCustomer: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <PageHeader title="Create Customer" />
      <div className="w-[800px] max-w-[90%] mx-auto px-5 py-10 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(addCustomer)}>
          <div className="grid gap-5 grid-cols-2">
            <TextField
              fullWidth
              label="Name"
              error={Boolean(errors["name"])}
              {...register("name", { required: true })}
            />
            <TextField
              fullWidth
              label="Phone No"
              error={Boolean(errors["phoneNo"])}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+880</InputAdornment>
                ),
              }}
              {...register("phoneNo", { required: true })}
            />

            <TextField
              fullWidth
              label="Email"
              error={Boolean(errors["email"])}
              {...register("email", { required: true })}
            />
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ fieldState: { error } }) => (
                <Autocomplete
                  options={[]}
                  noOptionsText="Customer Type Not Found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      fullWidth
                      size="medium"
                      label="Select Customer Type"
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="project"
              rules={{ required: true }}
              render={({ fieldState: { error } }) => (
                <Autocomplete
                  options={[]}
                  noOptionsText="Project Not Found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      fullWidth
                      size="medium"
                      label="Select Project Name"
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="project"
              rules={{ required: true }}
              render={({ fieldState: { error } }) => (
                <Autocomplete
                  options={[]}
                  noOptionsText="CSC Not Found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      fullWidth
                      size="medium"
                      label="Select CSC"
                    />
                  )}
                />
              )}
            />
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
          </div>
          <Divider className="!my-5" />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!py-3 !font-semibold"
            startIcon={<Add />}
          >
            Create Customer
          </Button>
        </form>
      </div>
    </div>
  );
}
