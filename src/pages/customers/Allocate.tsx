import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAppSelector } from "../../hooks";
import Customer from "../../components/shared/Customer";
import PageHeader from "../../components/shared/PageHeader";
import { allocateApi } from "../../api/allocate";

interface Inputs {
  so: string;
  quantity?: number;
  voucherCode?: null | {
    voucher_code: string;
    amount: number;
    id: number;
    exp_days: number;
  };
  skuCode?: null | {
    name: string;
    gift_type: string;
    id: number;
    label: string;
  };
}

export default function Allocate() {
  // states
  const [loading, setLoading] = useState<boolean>(false);

  // react-redux
  const skuCodes = useAppSelector((state) => state.inventory.skuCodes);
  const skuCodesOptions = skuCodes.map((code) => ({
    ...code,
    label: `${code.name} - ${code.gift_type}`,
  }));

  const user = useAppSelector((state) => state.auth.user);
  const availableBal: number = user?.availableBal || 0;

  // vouchers codes
  const voucherCodes = useAppSelector((state) => state.inventory.voucherCodes);
  const vouchersOptions = voucherCodes.filter(
    (item) => item.amount <= availableBal
  );

  // get params
  const { allocateItem, customerId } = useParams<{
    allocateItem: "gift" | "voucher";
    customerId: string;
  }>();

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm<Inputs>();

  // allocate handler
  const allocateHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);

      const formData = {
        so: data.so,
        quantity: data.quantity,
        voucherCode: data.voucherCode?.voucher_code,
        voucherAmount: data.voucherCode?.amount,
        skuCode: data.skuCode?.name,
        customerId: customerId,
        redeemType: allocateItem === "gift" ? "gift" : "voucher",
      };

      await allocateApi.create(formData);
      toast.success(
        `${allocateItem === "gift" ? "Gift" : "Voucher"} Allocated Successfully`
      );
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(
        error?.response?.data?.message || "Sorry! Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Gift Allocate" />
      <div className="grid grid-cols-2 gap-7">
        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Customer
          </Typography>
          <Divider className="!mb-4 !mt-2 !bg-primary" />
          <Customer />
        </div>

        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(allocateHandler)}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                error={Boolean(errors["so"])}
                label="SO"
                {...register("so", { required: true })}
              />

              {allocateItem === "gift" && (
                <>
                  <Controller
                    control={control}
                    name="skuCode"
                    rules={{ required: true }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        options={skuCodesOptions}
                        getOptionLabel={(option) => option.label}
                        noOptionsText="No GIft Item Matched"
                        value={value || null}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(_, value) => onChange(value)}
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

                  <TextField
                    fullWidth
                    type="number"
                    disabled={user?.availableGift === 0}
                    error={Boolean(errors["quantity"])}
                    label="Gift Quantity"
                    {...register("quantity", {
                      required: true,
                      min: 1,
                      max: user?.availableGift,
                    })}
                  />
                  <Typography variant="body1" className="!pl-3 !text-primary">
                    Available Gift Quantity:{" "}
                    <strong>{user?.availableGift}</strong>
                  </Typography>
                </>
              )}

              {allocateItem === "voucher" && (
                <>
                  <Controller
                    control={control}
                    name="voucherCode"
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        options={vouchersOptions}
                        noOptionsText="No Voucher Code Matched"
                        getOptionLabel={(option) => option.voucher_code}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        value={value || null}
                        onChange={(_, val) => onChange(val)}
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

            {allocateItem === "gift" && (
              <Button
                type="submit"
                className="!py-3"
                variant="contained"
                fullWidth
                disabled={user?.availableGift === 0 || loading}
                startIcon={
                  loading && <CircularProgress color="inherit" size={20} />
                }
              >
                Gift Allocate
              </Button>
            )}

            {allocateItem === "voucher" && (
              <Button
                fullWidth
                type="submit"
                className="!py-3"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading && <CircularProgress color="inherit" size={20} />
                }
              >
                Voucher Allocate
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
