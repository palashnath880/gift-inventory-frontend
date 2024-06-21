import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Fab,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { StyledTableCell, StyledTableRow } from "../../shared/MUITable";
import { Add, Close, Delete } from "@mui/icons-material";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { EmployeeRole } from "../../../types";
import { AxiosError } from "axios";
import { adminApi } from "../../../api/admin";
import toast from "react-hot-toast";
import { fetchVouchers } from "../../../features/voucher/voucherSlice";

interface Inputs {
  name: string;
  expDays: number;
  amount: number;
  allowedRoles: EmployeeRole[];
}

export default function VoucherCode() {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [code, setCode] = useState<string>("");

  // redux
  const roles = useAppSelector((state) => state.roles);
  const vouchers = useAppSelector((state) => state.vouchers);
  const dispatch = useAppDispatch();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<Inputs>();

  // add handler
  const addHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);

      const formData: any = { ...data };
      formData.allowedRoles = data.allowedRoles.map((i) => i.name);
      formData.name = code;

      await adminApi.createVoucher(formData);
      toast.success("Voucher Code Added");
      reset();
      setCode("");
      dispatch(fetchVouchers());
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // delete handler
  const deleteVoucher = async (e: any, id: number) => {
    try {
      e.target.disabled = true;
      await adminApi.deleteVoucher(id);
      dispatch(fetchVouchers());
      toast.success("Voucher Code Deleted");
    } catch (err) {
      e.target.disabled = false;
      toast.error("Voucher Code Couldn't Be Deleted");
    }
  };

  useEffect(() => {
    watch(({ name, amount }) => {
      const generateCode = `${name}${amount}`.toUpperCase();
      setCode(generateCode);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="!text-primary !font-semibold">
          Voucher Code
          <span className="!ml-2 !text-black">(20)</span>
        </Typography>

        {/* add dialog */}
        <PopupState variant="popover">
          {(popupState) => (
            <>
              <Fab size="small" color="primary" {...bindTrigger(popupState)}>
                <Add />
              </Fab>

              <Dialog {...bindDialog(popupState)}>
                <div className="max-sm:w-[95%] w-[400px] px-5 py-5">
                  <div className="flex justify-between items-center pb-1 border-b border-primary">
                    <Typography
                      variant="h6"
                      className="!text-primary !font-semibold"
                    >
                      Add New Voucher Code
                    </Typography>
                    <IconButton onClick={popupState.close}>
                      <Close />
                    </IconButton>
                  </div>
                  <form onSubmit={handleSubmit(addHandler)}>
                    <div className="mt-5 flex flex-col gap-4">
                      <TextField
                        fullWidth
                        error={Boolean(errors["name"])}
                        label={"Code"}
                        {...register("name", { required: true })}
                      />

                      <TextField
                        fullWidth
                        type="number"
                        error={Boolean(errors["amount"])}
                        label={"Amount"}
                        {...register("amount", { required: true, min: 1 })}
                      />

                      <Typography>
                        Generated Code: <strong>{code}</strong>
                      </Typography>

                      <TextField
                        fullWidth
                        type="number"
                        error={Boolean(errors["expDays"])}
                        label={"EXP Days"}
                        {...register("expDays", { required: true, min: 1 })}
                      />

                      <Controller
                        control={control}
                        name="allowedRoles"
                        rules={{ required: true }}
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <Autocomplete
                            multiple
                            id="selectedEmployeeRoles"
                            options={roles}
                            value={value || []}
                            onChange={(_, val) => onChange(val)}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, val) =>
                              option.id === val.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(error)}
                                label="Select Employee Roles"
                              />
                            )}
                          />
                        )}
                      />

                      {error && (
                        <Typography className="!text-red-500 !text-center">
                          {error}
                        </Typography>
                      )}

                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        className="!py-3 !text-sm !capitalize"
                        disabled={loading}
                        startIcon={
                          loading && (
                            <CircularProgress size={20} color="inherit" />
                          )
                        }
                      >
                        Add New Voucher
                      </Button>
                    </div>
                  </form>
                </div>
              </Dialog>
            </>
          )}
        </PopupState>
      </div>
      <Divider className="!bg-primary !my-3" />

      {vouchers?.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Exp Days</StyledTableCell>
              <StyledTableCell>Allowed Roles</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers?.map(
              ({ createdAt, id, name, amount, expDays, allowedRoles }) => (
                <StyledTableRow key={id}>
                  <StyledTableCell>{name}</StyledTableCell>
                  <StyledTableCell>{amount}</StyledTableCell>
                  <StyledTableCell>{expDays}</StyledTableCell>
                  <StyledTableCell>{allowedRoles.join("; ")}</StyledTableCell>
                  <StyledTableCell>{createdAt}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      onClick={(e) => deleteVoucher(e, id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
