import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../../components/shared/PageHeader";
import Loader from "../../../components/shared/Loader";
import { Download } from "@mui/icons-material";
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
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { stockApi } from "../../../api/stock";
import type { AdminStock } from "../../../types";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";
import { downloadExcel } from "../../../utility/utility";

export default function Stock() {
  // search params
  const [search, setSearch] = useSearchParams();
  const skuCode = search.get("sku") || "";

  // sku
  const skuCodes = useAppSelector((state) => state.skuCodes);

  // react-query
  const { data, isLoading, isSuccess } = useQuery<AdminStock[]>({
    queryKey: ["adminStock", skuCode],
    queryFn: async () => {
      const res = await stockApi.adminStock(skuCode);
      return res.data;
    },
  });

  // total quantity
  const total = data
    ? data?.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <div>
      <PageHeader title="Admin Stock" />

      <div className="flex justify-between items-center">
        <Autocomplete
          options={skuCodes}
          value={skuCodes.find((i) => i.name === skuCode) || null}
          sx={{ width: 260 }}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          onChange={(_, value) => setSearch({ sku: value?.name || "" })}
          noOptionsText="No SKU Code Here"
          renderInput={(params) => (
            <TextField {...params} label="Search By SKU Code" />
          )}
        />
        <Button
          variant="contained"
          className="!text-sm !capitalize !py-3 !px-7"
          startIcon={<Download />}
          disabled={!data || data?.length <= 0}
          onClick={() => downloadExcel("adminStock", "Admin Stock")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* display show */}
      {isSuccess && (
        <>
          {data?.length <= 0 && (
            <div className="!mt-5 shadow-lg">
              <Alert severity="error">
                <Typography>Stock Not Available</Typography>
              </Alert>
            </div>
          )}

          {data?.length > 0 && (
            <Table className="mt-5" id="adminStock">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Serial</StyledTableCell>
                  <StyledTableCell>SKU Code</StyledTableCell>
                  <StyledTableCell>Gift Type</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((stock, index) => (
                  <StyledTableRow key={stock.sku_code}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{stock.sku_code}</StyledTableCell>
                    <StyledTableCell>{stock.type}</StyledTableCell>
                    <StyledTableCell>{stock.quantity}</StyledTableCell>
                  </StyledTableRow>
                ))}
                <StyledTableRow>
                  <StyledTableCell colSpan={3} className="!text-end">
                    <strong>Total</strong>
                  </StyledTableCell>
                  <StyledTableCell>{total}</StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}
