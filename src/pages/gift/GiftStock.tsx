import PageHeader from "../../components/shared/PageHeader";
import {
  Alert,
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { Download } from "@mui/icons-material";
import { useAppSelector } from "../../hooks";
import { useQuery } from "@tanstack/react-query";
import { stockApi } from "../../api/stock";
import Loader from "../../components/shared/Loader";
import type { BranchStock } from "../../types";
import { useSearchParams } from "react-router-dom";
import { downloadExcel } from "../../utility/utility";

export default function GiftStock() {
  // use search params
  const [params, setParams] = useSearchParams();
  const sku_code = params.get("sku_code") || "";

  // react redux
  const skuCodes = useAppSelector((state) => state.inventory.skuCodes);

  // fetch branch stock
  const { data, isLoading, isSuccess } = useQuery<BranchStock[]>({
    queryKey: ["branchStock", sku_code],
    queryFn: async () => {
      const res = await stockApi.getBranchStock(sku_code);
      return res.data;
    },
  });

  const totalQuantity = data?.reduce(
    (total, stock) => total + stock.quantity,
    0
  );
  const totalRedQuantity = data?.reduce(
    (total, stock) => total + stock.redeem_quantity,
    0
  );

  return (
    <div className="pb-10">
      <PageHeader title="Gift Stock" />

      <div className="flex justify-between">
        <div className="sm:w-[300px] w-full">
          <Autocomplete
            options={skuCodes}
            noOptionsText="No SKU Code Match"
            value={skuCodes?.find((i) => i.name === sku_code) || null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            onChange={(_, value: any) =>
              setParams({ sku_code: value?.name || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Search By SKU Code" />
            )}
          />
        </div>
        <Button
          disabled={!isSuccess}
          variant="contained"
          startIcon={<Download />}
          className="!text-sm !capitalize"
          onClick={() => downloadExcel("branchStock", "branch stock")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* error message */}
      {isSuccess && data?.length <= 0 && (
        <div className="!mt-5 shadow-lg">
          <Alert severity="error">
            <Typography variant="body1">Empty Stock</Typography>
          </Alert>
        </div>
      )}

      {isSuccess && data?.length > 0 && (
        <div className="mt-5">
          <Table id="branchStock">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                {/* <StyledTableCell>Name</StyledTableCell> */}
                <StyledTableCell>SKU Code</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Redeem</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((stock, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <strong>{index + 1}</strong>
                  </StyledTableCell>
                  {/* <StyledTableCell>{stock.name}</StyledTableCell> */}
                  <StyledTableCell>{stock.sku_code}</StyledTableCell>
                  <StyledTableCell>{stock.type}</StyledTableCell>
                  <StyledTableCell>{stock.quantity}</StyledTableCell>
                  <StyledTableCell>{stock.redeem_quantity}</StyledTableCell>
                </StyledTableRow>
              ))}
              <StyledTableRow>
                <StyledTableCell colSpan={4} className="!text-right">
                  <strong>Total</strong>
                </StyledTableCell>
                <StyledTableCell>{totalQuantity}</StyledTableCell>
                <StyledTableCell>{totalRedQuantity}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
