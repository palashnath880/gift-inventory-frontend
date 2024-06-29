import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Customer from "../../components/shared/Customer";
import PageHeader from "../../components/shared/PageHeader";
import { allocateApi } from "../../api/allocate";
import type { AllocateFormInputs, SKUCode, StockType } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { stockApi } from "../../api/stock";
import { loadUser } from "../../features/auth/authSlice";

const GiftAllocateInputs = ({
  control,
}: {
  control: Control<AllocateFormInputs>;
}) => {
  // states
  const [selectedSKU, setSelectedSKU] = useState<SKUCode | null>(null);

  // get sku codes
  const skuCodes = useAppSelector((state) => state.inventory.skuCodes);

  const user = useAppSelector((state) => state.auth.user);
  const availableGift: number = user?.availableGift || 0;
  // const availableBal: number = user?.availableBal || 0;
  const { data, isLoading } = useQuery<StockType | null | undefined>({
    queryKey: ["sku_stocks", selectedSKU],
    queryFn: async (): Promise<StockType | null | undefined> => {
      if (!selectedSKU) {
        return null;
      }
      const res = await stockApi.getBranchStock(selectedSKU?.name);
      const data: StockType[] = res.data;
      const findStock: StockType | undefined = Array.isArray(data)
        ? data?.find((i) => i.sku_code === selectedSKU.name)
        : undefined;
      return findStock;
    },
  });

  // is quantity input is disabled
  const isQuantityDis =
    Boolean(availableGift <= 0) || Boolean(!data || data?.quantity <= 0);

  const stockQuantity: number = data?.quantity || 0;
  const maxInputVal: number = Math.min(availableGift, stockQuantity);

  return (
    <>
      <Controller
        control={control}
        name="comment"
        rules={{ required: true }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextField
            error={Boolean(error)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            label="Comments"
          />
        )}
      />

      <Controller
        control={control}
        name="skuCode"
        rules={{ required: true }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Autocomplete
            options={skuCodes}
            getOptionLabel={(option) => option.name}
            noOptionsText="No GIft Item Matched"
            value={value || null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
              onChange(value);
              setSelectedSKU(value);
            }}
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

      {/* quantity input */}
      <Controller
        control={control}
        name="quantity"
        rules={{ required: true, min: 1, max: maxInputVal }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            type="number"
            {...field}
            disabled={isQuantityDis}
            error={Boolean(error)}
            label="Gift Quantity"
          />
        )}
      />

      <Typography variant="body1" className="!pl-3 !text-primary">
        Available Gift: <strong>{user?.availableGift}</strong>
      </Typography>

      {!isLoading && data && (
        <>
          <Typography
            variant="body1"
            className={`!pl-3 ${
              data?.quantity <= 0 ? "!text-red-500" : "!text-primary"
            } `}
          >
            Available Gift in CSC: <strong>{data?.quantity}</strong>
          </Typography>
        </>
      )}
    </>
  );
};

export default function Allocate() {
  // states
  const [loading, setLoading] = useState<boolean>(false);

  // redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const availableBal: number = user?.availableBal || 0;

  // vouchers codes
  const voucherCodes = useAppSelector((state) => state.inventory.voucherCodes);
  const vouchersOptions = voucherCodes.filter(
    (item) =>
      item.amount <= availableBal &&
      item?.allowedRoles.includes(user?.role || "")
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
  } = useForm<AllocateFormInputs>();

  // allocate handler
  const allocateHandler: SubmitHandler<AllocateFormInputs> = async (data) => {
    try {
      setLoading(true);

      const formData = {
        so: data.so,
        quantity: data.quantity,
        voucherCode: data.voucherCode?.name,
        voucherAmount: data.voucherCode?.amount,
        skuCode: data.skuCode?.name,
        customerId: customerId,
        redeemType: allocateItem === "gift" ? "gift" : "voucher",
        comment: data?.comment,
      };

      await allocateApi.create(formData);
      toast.success(
        `${allocateItem === "gift" ? "Gift" : "Voucher"} Allocated Successfully`
      );
      reset();
      dispatch(loadUser());
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

          {/* customer info */}
          <Customer />
        </div>

        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(allocateHandler)}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                error={Boolean(errors["so"])}
                label="SO"
                {...register("so", { required: false })}
              />

              {allocateItem === "gift" && (
                <GiftAllocateInputs control={control} />
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
                        getOptionLabel={(option) => option.name}
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

                  <Typography
                    variant="body1"
                    className={`!pl-3 ${
                      availableBal <= 0 ? "!text-red-500" : "!text-primary"
                    } `}
                  >
                    Available Gift in CSC: <strong>{availableBal}</strong>
                  </Typography>
                </>
              )}
            </div>

            <Divider className="!my-5 !bg-primary" />

            {allocateItem === "gift" && (
              <Button
                type="submit"
                className="!py-3 !capitalize !text-sm"
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
