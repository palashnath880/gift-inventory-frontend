import {
  Autocomplete,
  Button,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Add } from "@mui/icons-material";

interface Inputs {
  subject: string;
  reason: string;
  itemName: string;
  itemCode: string;
  quantity: string;
  amount: string;
  customerId: string | number;
}

export default function MyApproval() {
  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Inputs>();

  //create approval handler
  const createApproval: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <PageHeader title="My Approval" />
      <div className="mx-auto lg:w-[700px] px-5 py-10 bg-white  shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(createApproval)}>
          <div className="grid grid-cols-2 gap-x-7 gap-y-5">
            <TextField
              fullWidth
              label="Subject"
              error={Boolean(errors["subject"])}
              {...register("subject", { required: true })}
            />

            <TextField
              fullWidth
              label="Item Name"
              error={Boolean(errors["itemName"])}
              {...register("itemName", { required: true })}
            />
            <div className="row-span-2">
              <TextField
                multiline
                fullWidth
                minRows={5}
                label="Reason"
                error={Boolean(errors["reason"])}
                {...register("reason", { required: true })}
              />
            </div>
            <TextField
              fullWidth
              label="Item Code"
              error={Boolean(errors["itemCode"])}
              {...register("itemCode", { required: true })}
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              error={Boolean(errors["quantity"])}
              {...register("quantity", { required: true, min: 1 })}
            />
            <TextField
              fullWidth
              type="number"
              label="Amount"
              error={Boolean(errors["amount"])}
              {...register("amount", { required: true, min: 1 })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"> &#2547;</InputAdornment>
                ),
              }}
            />
            <Controller
              control={control}
              name="customerId"
              rules={{ required: true }}
              render={({ fieldState: { error } }) => (
                <Autocomplete
                  options={[]}
                  noOptionsText="No Customer Match"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      label="Select Customer"
                    />
                  )}
                />
              )}
            />
          </div>
          <Divider className="!my-5 !bg-primary" />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!py-3"
            startIcon={<Add />}
          >
            Create Approval
          </Button>
        </form>
      </div>
    </div>
  );
}
