import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  ListItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { approvalApi } from "../../api/approval";
import { customerApi } from "../../api/customer";
import type { ApprovalFormInputs, Customer } from "../../types";
import { useAppSelector } from "../../hooks";

export default function ApprovalForm({
  close,
  open,
  refetch,
}: {
  open: boolean;
  close: () => void;
  refetch: () => void;
}) {
  //  states
  const [loading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cusLoading, setCusLoading] = useState<boolean>(false);

  // react-redux
  const voucherCodes = useAppSelector((state) => state.inventory.voucherCodes);
  const user = useAppSelector((state) => state.auth.user);
  let approvers = useAppSelector((state) => state.employees.employees);
  approvers = approvers.filter((i) => i?.id !== user?.id);

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm<ApprovalFormInputs>();

  // close popup function
  const handleClose = () => {
    close();
  };

  // fetch customers
  const fetchCustomers = async (e: any) => {
    const value = e?.target?.value;
    if (!value) {
      return;
    }

    try {
      setCusLoading(true);
      const res = await customerApi.getAll(1, value);
      if (res?.data) {
        setCustomers(res?.data?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCusLoading(false);
    }
  };

  // de bouncer function
  const debounce = (callback: any, delay: number = 3) => {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  //create approval handler
  const createApproval: SubmitHandler<ApprovalFormInputs> = async (data) => {
    try {
      setLoading(true);

      data.approver_1 = data?.approverOne?.id;
      data.approver_2 = data?.approverTwo?.id || null;
      data.customer_id = data?.customer?.id;
      data.voucherAmount = data?.voucher?.amount;
      data.voucherCode = data?.voucher?.voucher_code;

      await approvalApi.create(data);
      toast.success("Approval created successfully");
      reset();
      refetch();
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} className="!grid !place-items-center">
      <div className="!outline-none w-[90%] sm:w-[500px] lg:w-[700px] px-5 pb-10 pt-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center">
          <Typography variant="h5" className="!font-semibold !text-primary">
            Create Approval
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
        <Divider className="!mb-5 !mt-2 !bg-primary" />
        <form onSubmit={handleSubmit(createApproval)}>
          <div className="grid grid-cols-2 gap-x-7 gap-y-5">
            {/* description field  */}
            <div className="col-span-2">
              <TextField
                multiline
                fullWidth
                minRows={4}
                label="Description"
                error={Boolean(errors["description"])}
                {...register("description", { required: true })}
              />
            </div>

            {/* select customers */}
            <Controller
              control={control}
              name="customer"
              rules={{ required: true }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id="select_customer"
                  options={customers}
                  noOptionsText="No Customer Match"
                  onChange={(e, val) => onChange(val)}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  loading={cusLoading}
                  loadingText="Customer searching"
                  getOptionLabel={(option) => option.name}
                  onInputChange={debounce(fetchCustomers, 500)}
                  value={value || null}
                  renderOption={(props, option, state) => (
                    <ListItem {...props} key={state.index}>
                      <span>
                        <strong>{option.name}</strong>
                        <br />
                        <small>{option.phoneNo}</small>
                      </span>
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      label="Select Customer"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {cusLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
            {/* select approver one */}
            <Controller
              control={control}
              name="approverOne"
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Autocomplete
                  value={value || null}
                  onChange={(e, val) => onChange(val)}
                  options={approvers}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option) => option.name}
                  noOptionsText="No user for approver one"
                  renderOption={(props, option, state) => (
                    <ListItem {...props} key={state.index}>
                      <span>
                        <strong>{option.name}</strong>
                        <br />
                        {option.role}
                      </span>
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      label="Select Approver One"
                    />
                  )}
                />
              )}
            />

            {/* select approver one */}
            <Controller
              control={control}
              name="approverTwo"
              rules={{ required: false }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Autocomplete
                  value={value || null}
                  onChange={(e, val) => onChange(val)}
                  options={approvers}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option) => option.name}
                  noOptionsText="No user for approver two"
                  renderOption={(props, option, state) => (
                    <ListItem {...props} key={state.index}>
                      <span>
                        <strong>{option.name}</strong>
                        <br />
                        {option.role}
                      </span>
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(error)}
                      label="Select Approver Two"
                    />
                  )}
                />
              )}
            />

            {/* select voucher codes */}
            <Controller
              control={control}
              name="voucher"
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Autocomplete
                  value={value || null}
                  onChange={(e, val) => onChange(val)}
                  options={voucherCodes}
                  getOptionLabel={(option) => option.voucher_code}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
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
          </div>
          <Divider className="!my-5 !bg-primary" />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!py-3"
            startIcon={<Add />}
            disabled={loading}
          >
            Create Approval
          </Button>
        </form>
      </div>
    </Modal>
  );
}
