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
import { Add, Delete } from "@mui/icons-material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import type { SKUCode } from "../../../types";
import { useAppSelector } from "../../../hooks";
import { useState } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";
import { AxiosError } from "axios";
import { stockApi } from "../../../api/stock";
import toast from "react-hot-toast";
import StockEntryList from "../../../components/admin/Stock/StockEntryList";

interface Inputs {
  skuCode: SKUCode;
  quantity: number;
  remarks: string;
}

interface EntryList {
  skuCode: string | null;
  giftType: string | null;
  itemName: string | null;
  quantity: number;
  remarks: string;
}

export default function StockEntry() {
  // states
  const [entryList, setEntryList] = useState<EntryList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // redux
  const skuCodes = useAppSelector((state) => state.skuCodes);

  // react-hook-form
  const {
    register,
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<Inputs>();

  // add to entry list
  const addToEntryList: SubmitHandler<Inputs> = (data) => {
    const list: any = { ...data };
    list.skuCode = data.skuCode.name;
    list.giftType = data.skuCode.gift_type;
    list.itemName = data.skuCode.item_name;

    setEntryList([...entryList, list]);
    reset();
  };

  // delete from entry list
  const deleteListStock = (index: number) => {
    const list = [...entryList];
    list.splice(index, 1);
    setEntryList(list);
  };

  // add to stock
  const addToStock = async () => {
    try {
      setLoading(true);
      setError("");
      await stockApi.adminStockEntry(entryList);
      setEntryList([]);
      toast.success("Stock Entry Successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Stock Entry" />
      <div className="flex gap-5 items-start">
        <div className="w-[40%] bg-white shadow-lg rounded-md px-5 py-5">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Add Stock
          </Typography>
          <Divider className="!my-4 !bg-primary" />
          <form onSubmit={handleSubmit(addToEntryList)}>
            <div className="flex flex-col gap-4">
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
                    value={value || null}
                    onChange={(_, val) => onChange(val || null)}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    renderOption={(props, option, state) => (
                      <ListItem key={state.index} {...props}>
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
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                error={Boolean(errors["quantity"])}
                {...register("quantity", { required: true, min: 1 })}
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
                Add to Entry list
              </Button>
            </div>
          </form>
        </div>

        {/* entry list  */}
        <div className="flex-1 bg-white shadow-lg rounded-md px-5 py-5">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Stock Entry List
          </Typography>
          <Divider className="!my-4 !bg-primary" />
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>SKU Code</StyledTableCell>
                <StyledTableCell>Gift Type</StyledTableCell>
                <StyledTableCell>Item Name</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Remarks</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entryList?.map((list, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{list.skuCode}</StyledTableCell>
                  <StyledTableCell>{list.giftType}</StyledTableCell>
                  <StyledTableCell>{list.itemName}</StyledTableCell>
                  <StyledTableCell>{list.quantity}</StyledTableCell>
                  <StyledTableCell>{list.remarks}</StyledTableCell>
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
            onClick={addToStock}
            disabled={Boolean(entryList?.length <= 0) || loading}
          >
            Add to Stock
          </Button>
        </div>
      </div>

      <StockEntryList />
    </div>
  );
}
