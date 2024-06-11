import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";

export default function GiftReceive() {
  return (
    <div>
      <PageHeader title="Gift Receive" />
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Branch Name</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>SKU Code</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>
              <strong>1</strong>
            </StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>1234</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>10</StyledTableCell>
            <StyledTableCell>
              <span className="flex items-center gap-4 justify-end">
                <Button variant="contained" color="success">
                  Accept
                </Button>
                <Button variant="contained" color="error">
                  Reject
                </Button>
              </span>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </div>
  );
}
