import { Alert, Table, TableBody } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "./MUITable";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../../api/customer";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import { AxiosError } from "axios";

interface Customer {
  name: string;
  email: string;
  phoneNo: string;
  type: string;
  project: string;
  csc: string;
}

export default function Customer() {
  // get params
  const { customerId } = useParams<{ customerId: string }>();

  const {
    data: customer,
    isLoading,
    isSuccess,
    error,
  } = useQuery<Customer>({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const res = await customerApi.getCustomerById(customerId);
      return res.data;
    },
  });

  // loader
  if (isLoading) {
    return <Loader dataLoading />;
  }

  // error message
  if (!isSuccess && error instanceof AxiosError) {
    return <Alert severity="error">{error?.response?.data?.message}</Alert>;
  }

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
