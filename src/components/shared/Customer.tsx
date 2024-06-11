import { Table, TableBody } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "./MUITable";

interface CustomerProps {
  name: string;
  email: string;
  phoneNo: string;
  type: string;
  project: string;
  csc: string;
}

export default function Customer({ customer }: { customer: CustomerProps }) {
  return (
    <Table>
      <TableBody>
        <StyledTableRow>
          <StyledTableCell>
            <strong>Name</strong>
          </StyledTableCell>
          <StyledTableCell>{customer?.name}</StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell>
            <strong>Email</strong>
          </StyledTableCell>
          <StyledTableCell>{customer?.email}</StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell>
            <strong>Phone NO</strong>
          </StyledTableCell>
          <StyledTableCell>{customer?.phoneNo}</StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell>
            <strong>Type</strong>
          </StyledTableCell>
          <StyledTableCell>{customer?.type}</StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell>
            <strong>Project</strong>
          </StyledTableCell>
          <StyledTableCell>{customer?.project}</StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell>
            <strong>CSC</strong>
          </StyledTableCell>
          <StyledTableCell>{customer?.csc}</StyledTableCell>
        </StyledTableRow>
      </TableBody>
    </Table>
  );
}
