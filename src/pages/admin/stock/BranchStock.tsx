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
import PageHeader from "../../../components/shared/PageHeader";
import { useAppSelector } from "../../../hooks";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../../utility/utility";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/shared/Loader";
import { stockApi } from "../../../api/stock";
import type { AssetsType, BranchStock } from "../../../types";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";

const StockItem = ({
  stock,
  branches,
}: {
  stock: BranchStock;
  branches: AssetsType[];
}) => {
  const getBranch = branches.find((i) => parseInt(i.id) === stock.branch_id);

  return (
    <StyledTableRow>
      <StyledTableCell>{getBranch?.name}</StyledTableCell>
      <StyledTableCell>{stock.sku_code}</StyledTableCell>
      <StyledTableCell>{stock.type}</StyledTableCell>
      <StyledTableCell>{stock.name}</StyledTableCell>
      <StyledTableCell>{stock.quantity}</StyledTableCell>
      <StyledTableCell>{stock.redeem_quantity}</StyledTableCell>
    </StyledTableRow>
  );
};

export default function BranchStock() {
  // redux
  const branches = useAppSelector((state) => state.assets.branches);
  const skuCodes = useAppSelector((state) => state.skuCodes);

  // search
  const [search, setSearch] = useSearchParams();
  const { branch, sku } = {
    branch: search.get("branch") || "",
    sku: search.get("sku") || "",
  };

  // react - query
  const { data, isLoading, isSuccess } = useQuery<BranchStock[]>({
    queryKey: ["branchStock", branch, sku],
    queryFn: async () => {
      const res = await stockApi.branchStockByAdmin(branch, sku);
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="CSC Stock" />

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Autocomplete
            options={branches}
            value={branches.find((i) => i.id == branch) || null}
            sx={{ width: 200 }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            onChange={(_, value) => setSearch({ sku, branch: value?.id || "" })}
            noOptionsText="No CSC Here"
            renderInput={(params) => (
              <TextField {...params} label="Search By CSC" />
            )}
          />
          <Autocomplete
            options={skuCodes}
            value={skuCodes.find((i) => i.name === sku) || null}
            sx={{ width: 210 }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            onChange={(_, value) =>
              setSearch({ branch, sku: value?.name || "" })
            }
            noOptionsText="No SKU Code Here"
            renderInput={(params) => (
              <TextField {...params} label="Search By SKU Code" />
            )}
          />
        </div>

        <Button
          variant="contained"
          className="!text-sm !capitalize !py-3 !px-7"
          startIcon={<Download />}
          disabled={!data || data?.length <= 0}
          onClick={() => downloadExcel("branchStock", "Branch Stock")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader */}
      {isLoading && <Loader dataLoading />}

      {/* data display */}
      {isSuccess && data?.length > 0 && (
        <>
          <Table id="branchStock" className="!mt-5">
            <TableHead>
              <TableRow>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>SKU Code</StyledTableCell>
                <StyledTableCell>Gift Type</StyledTableCell>
                <StyledTableCell>Item Name</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Redeem Quantity</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((stock) => (
                <StockItem stock={stock} branches={branches} />
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {isSuccess && data?.length <= 0 && (
        <div className="!mt-5 shadow-xl">
          <Alert severity="error">
            <Typography>Empty Stock</Typography>
          </Alert>
        </div>
      )}
    </div>
  );
}
