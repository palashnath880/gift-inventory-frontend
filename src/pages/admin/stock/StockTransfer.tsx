import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  ListItem,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../../components/shared/PageHeader";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import { useAppSelector } from "../../../hooks";
import type { AdminStock, AssetsType, SKUCode } from "../../../types";
import { useState } from "react";
import { stockApi } from "../../../api/stock";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface Inputs {
  name: string;
  skuCode: SKUCode;
  quantity: number;
  remarks: string;
  branch: AssetsType;
}

interface TransferList {
  name: string;
  skuCode: string;
  quantity: number;
  giftType: string | null;
  remarks: string;
  branchId: number | string;
  branch: string;
}

export default function StockTransfer() {
  // states
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [transferList, setTransferList] = useState<TransferList[]>([]);
  const [error, setError] = useState<string>("");

  // redux
  const skuCodes = useAppSelector((state) => state.skuCodes);
  const branches = useAppSelector((state) => state.assets.branches);

  // react- hook -form
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  //  add to transfer list
  const addToTransferList: SubmitHandler<Inputs> = (data) => {
    const list: TransferList = {
      branch: data?.branch?.name,
      branchId: data?.branch?.id,
      giftType: data?.skuCode?.gift_type,
      name: data.name,
      quantity: data.quantity,
      remarks: data.remarks,
      skuCode: data.skuCode.name,
    };
    console.log(list);
    setTransferList([...transferList, list]);
    setMaxQuantity(0);
    reset();
  };

  // get stock by sku code
  const getStockBySKU = async (sku: SKUCode | any) => {
    if (!sku) {
      setMaxQuantity(0);
      return;
    }

    try {
      setStockLoading(true);
      setMaxQuantity(0);
      const res = await stockApi.getAdminStockBySKU(sku?.name);
      const stocks: AdminStock[] = res.data;
      const findMyStock = stocks.find((i) => i.sku_code === sku?.name);
      const stockList = transferList.filter((i) => i.skuCode === sku?.name);
      const listTotalQuantity = stockList.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const max = (findMyStock?.quantity || 0) - listTotalQuantity;
      setMaxQuantity(max);
    } catch (err) {
      console.log(err);
    } finally {
      setStockLoading(false);
    }
  };

  // delete item from transfer list
  const deleteListStock = (index: number) => {
    const list = [...transferList];
    list.splice(index, 1);
    setTransferList(list);
  };

  // transfer stock
  const transferStock = async () => {
    try {
      setLoading(true);
      setError("");
      await stockApi.adminStockTransfer(transferList);
      setTransferList([]);
      toast.success("Stock Transferred Successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Stock Transfer" />

      <div className="flex gap-5 items-start">
        <div className="w-[40%] bg-white shadow-lg rounded-md px-5 py-5">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Transfer Form
          </Typography>
          <Divider className="!my-4 !bg-primary" />
          <form onSubmit={handleSubmit(addToTransferList)}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                label="Name"
                error={Boolean(errors["name"])}
                {...register("name", { required: true })}
              />

              <Controller
                control={control}
                name="branch"
                rules={{ required: true }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={branches}
                    value={value || null}
                    onChange={(_, val) => onChange(val || null)}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(error)}
                        label="Select Branch"
                      />
                    )}
                  />
                )}
              />

              <Controller
                control={control}
                name="skuCode"
                rules={{ required: true }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={skuCodes}
                    disabled={stockLoading}
                    value={value || null}
                    onChange={(_, val) => {
                      onChange(val || null);
                      getStockBySKU(val || null);
                    }}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    renderOption={(props, option, state) => (
                      <ListItem {...props} key={state.index}>
                        <span className="flex flex-col">
                          {option.name}
                          <span className="scale-90">{option.gift_type}</span>
                        </span>
                      </ListItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(error)}
                        label="Select SKU Code"
                      />
                    )}
                  />
                )}
              />

              <Typography>
                Available Quantity: <strong>{maxQuantity}</strong>
              </Typography>

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                disabled={maxQuantity <= 0}
                error={Boolean(errors["quantity"])}
                {...register("quantity", {
                  required: true,
                  min: 1,
                  max: maxQuantity,
                  valueAsNumber: true,
                })}
              />

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Remarks"
                error={Boolean(errors["remarks"])}
                {...register("remarks", { required: true })}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                className="!py-3 !text-sm !normal-case"
                startIcon={<Add />}
              >
                Add to Transfer list
              </Button>
            </div>
          </form>
        </div>

        {/* transfer list  */}
        <div className="flex-1 bg-white shadow-lg rounded-md px-5 py-5">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Stock Entry List
          </Typography>
          <Divider className="!my-4 !bg-primary" />
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>SKU Code</StyledTableCell>
                <StyledTableCell>Gift Type</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Remarks</StyledTableCell>
                <StyledTableCell>Branch</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transferList?.map((list, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{list.name}</StyledTableCell>
                  <StyledTableCell>{list.skuCode}</StyledTableCell>
                  <StyledTableCell>{list.giftType}</StyledTableCell>
                  <StyledTableCell>{list.quantity}</StyledTableCell>
                  <StyledTableCell>{list.remarks}</StyledTableCell>
                  <StyledTableCell>{list.branch}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      onClick={() => deleteListStock(index)}
                      color="error"
                      edge="end"
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          {error && (
            <Typography className="!text-red-500 text-center">
              {error}
            </Typography>
          )}
          <Divider className="!my-4 !bg-primary" />
          <Button
            fullWidth
            type="submit"
            color="success"
            variant="contained"
            className="!py-3 !text-sm !normal-case"
            startIcon={<Add />}
            onClick={transferStock}
            disabled={Boolean(transferList?.length <= 0) || loading}
          >
            Add to Stock
          </Button>
        </div>
      </div>
    </div>
  );
}
