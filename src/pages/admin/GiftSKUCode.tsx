import {
  Alert,
  Button,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import { Add, Close, Delete } from "@mui/icons-material";
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/shared/Loader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import type { SKUCode } from "../../types";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";

interface Inputs {
  name: string;
  giftType: string;
  itemName: string;
}

export default function GiftSKUCode() {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // sku add popup
  const popupState = usePopupState({
    variant: "popover",
    popupId: "addSKUCode",
  });

  // react hook form
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<Inputs>();

  // react-query
  const { data, isLoading, isSuccess, refetch } = useQuery<SKUCode[]>({
    queryKey: ["skuCodes"],
    queryFn: async () => {
      const res = await adminApi.getSKUCodes();
      return res.data;
    },
  });

  // delete handler
  const deleteHandler = async (e: any, id: number) => {
    try {
      e.target.disabled = true;
      await adminApi.deleteSKUCode(id);
      refetch();
      toast.success("SKU Code Deleted");
    } catch (err) {
      e.target.disabled = false;
      toast.error("SKU Code Couldn't Be Deleted");
    }
  };

  // add handler
  const addHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      setError("");
      await adminApi.createSKU(data);
      reset();
      refetch();
      toast.success("SKU Code Added");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Gift SKU Code" />

      <Button
        variant="contained"
        className="!text-sm !capitalize !py-3 !px-7"
        startIcon={<Add />}
        {...bindTrigger(popupState)}
      >
        Add SKU Code
      </Button>

      {/* loader */}
      {isLoading && <Loader dataLoading />}

      {/* sku code display */}
      {isSuccess && (
        <>
          {data?.length <= 0 && (
            <div className="mt-5 shadow-lg">
              <Alert severity="error">
                <Typography>SKU Code Not Found</Typography>
              </Alert>
            </div>
          )}

          {data?.length > 0 && (
            <>
              <Table className="!mt-5">
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Gift Item Name</StyledTableCell>
                    <StyledTableCell>SKU Code</StyledTableCell>
                    <StyledTableCell>Gift Type</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map(
                    ({ id, createdAt, gift_type, item_name, name }, index) => (
                      <StyledTableRow key={id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{item_name}</StyledTableCell>
                        <StyledTableCell>{name}</StyledTableCell>
                        <StyledTableCell>{gift_type}</StyledTableCell>
                        <StyledTableCell>{createdAt}</StyledTableCell>
                        <StyledTableCell>
                          <IconButton
                            color="error"
                            onClick={(e) => deleteHandler(e, id)}
                          >
                            <Delete />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </>
      )}

      {/* add sku code dialog */}
      <Dialog {...bindDialog(popupState)}>
        <div className="max-sm:w-[96%] w-[500px] px-5 py-5 rounded-lg outline-none">
          <div className="flex justify-between items-center pb-1 border-b border-primary">
            <Typography variant="h6" className=" !font-semibold">
              Add New SKU Code
            </Typography>
            <IconButton onClick={popupState.close}>
              <Close />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit(addHandler)}>
            <div className="flex flex-col gap-4 mt-5">
              <TextField
                fullWidth
                label="Gift SKU Code"
                error={Boolean(errors["name"])}
                {...register("name", { required: true })}
              />
              <TextField
                fullWidth
                label="Gift Type"
                error={Boolean(errors["giftType"])}
                {...register("giftType", { required: true })}
              />
              <TextField
                fullWidth
                label="Gift Item Name"
                error={Boolean(errors["itemName"])}
                {...register("itemName", { required: true })}
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
                startIcon={<Add />}
                disabled={loading}
              >
                Add new SKU Code
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
