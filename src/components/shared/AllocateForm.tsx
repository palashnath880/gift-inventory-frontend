import { Autocomplete, Button, Divider, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export interface Inputs {
  so: string;
  voucherCode?: string;
  skuCode: string;
}

export default function AllocateForm({
  allocate,
}: {
  allocate: "gift" | "voucher";
}) {
  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Inputs>();

  // allocate handler
  const allocateHandler: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(allocateHandler)}>
      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          error={Boolean(errors["so"])}
          label="SO"
          {...register("so", { required: true })}
        />

        {allocate === "gift" && (
          <>
            <Controller
              control={control}
              name="skuCode"
              rules={{ required: true }}
              render={({ fieldState: { error } }) => (
                <Autocomplete
                  options={[]}
                  noOptionsText="No GIft Item Matched"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select GIft Item"
                      error={Boolean(error)}
                    />
                  )}
                />
              )}
            />
          </>
        )}

        {allocate === "voucher" && (
          <>
            <Controller
              control={control}
              name="voucherCode"
              rules={{ required: true }}
              render={({ fieldState: { error } }) => (
                <Autocomplete
                  options={[]}
                  noOptionsText="No Voucher Code Matched"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Voucher Code"
                      error={Boolean(error)}
                    />
                  )}
                />
              )}
            />
          </>
        )}
      </div>

      <Divider className="!my-5 !bg-primary" />

      <Button type="submit" className="!py-3" variant="contained" fullWidth>
        Allocate
      </Button>
    </form>
  );
}
