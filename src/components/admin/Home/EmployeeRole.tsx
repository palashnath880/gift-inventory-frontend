import { Add, Close, Delete } from "@mui/icons-material";
import {
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
import { AxiosError } from "axios";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { adminApi } from "../../../api/admin";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { StyledTableCell, StyledTableRow } from "../../shared/MUITable";
import { fetchRoles } from "../../../features/employee-role/employeeRoleSlice";

interface Inputs {
  name: string;
  amountLimit: number;
  giftLimit: number;
}

export default function EmployeeRole() {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // react-redux
  const roles = useAppSelector((state) => state.roles);
  const dispatch = useAppDispatch();

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Inputs>();

  // add handler
  const addHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      setError("");
      await adminApi.createRole(data);
      dispatch(fetchRoles());
      reset();
      toast.success("Employee Added Successfully");
    } catch (err) {
      const error = err as AxiosError<{ code: "exists" }>;
      if (error?.response?.data?.code === "exists") {
        setError("Employee role already exists");
      } else {
        toast.error("Sorry! Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // delete handler
  const deleteRole = async (e: any, id: number) => {
    try {
      e.target.disabled = true;
      await adminApi.deleteRole(id);
      dispatch(fetchRoles());
      toast.success("Employee Role Deleted");
    } catch (err) {
      e.target.disabled = false;
      toast.error("Employee Role Couldn't Be Deleted");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="!text-primary !font-semibold">
          Employee Roles
          <span className="!ml-2 !text-black">({roles?.length || 0})</span>
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
                      Add New Employee Role
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
                        label={"Employee Role"}
                        {...register("name", { required: true })}
                      />

                      <TextField
                        fullWidth
                        type="number"
                        error={Boolean(errors["amountLimit"])}
                        label={"Amount Limit"}
                        {...register("amountLimit", { required: true, min: 1 })}
                      />

                      <TextField
                        fullWidth
                        type="number"
                        error={Boolean(errors["giftLimit"])}
                        label={"Gift Limit"}
                        {...register("giftLimit", { required: true, min: 1 })}
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
                        Add New Employee Role
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

      {roles?.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Amount Limit</StyledTableCell>
              <StyledTableCell>Gift Limit</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles?.map(({ amountLimit, createdAt, giftLimit, id, name }) => (
              <StyledTableRow key={id}>
                <StyledTableCell>{name}</StyledTableCell>
                <StyledTableCell>{amountLimit}</StyledTableCell>
                <StyledTableCell>{giftLimit}</StyledTableCell>
                <StyledTableCell>{createdAt}</StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={(e) => deleteRole(e, id)} color="error">
                    <Delete />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
