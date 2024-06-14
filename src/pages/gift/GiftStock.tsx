import PageHeader from "../../components/shared/PageHeader";
import {
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { Download } from "@mui/icons-material";

export default function GiftStock() {
  return (
    <div>
      <PageHeader title="Gift Stock" />
      <div className="flex justify-between">
        <div className="sm:w-[300px] w-full">
          <Autocomplete
            options={[]}
            noOptionsText="No SKU Code Match"
            renderInput={(params) => (
              <TextField {...params} label="Search By SKU Code" />
            )}
          />
        </div>
        <Button variant="contained" startIcon={<Download />}>
          Export as Excel
        </Button>
      </div>
      <div className="mt-5">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>SKU Code</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Redeem</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>
                <strong>1</strong>
              </StyledTableCell>
              <StyledTableCell>1234</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>10</StyledTableCell>
              <StyledTableCell>100</StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
