import { useQuery } from "@tanstack/react-query";
import PageHeader from "../../components/shared/PageHeader";
import type { Employee } from "../../types";
import Loader from "../../components/shared/Loader";
import {
  Alert,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { employeeApi } from "../../api/employee";
import { Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Employees() {
  // get employees
  const { data, isLoading, isSuccess } = useQuery<Employee[]>({
    queryKey: ["myEmployees"],
    queryFn: async () => {
      const res = await employeeApi.getMyBranchEmployees();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="Employees Report" />

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* data show  */}
      {isSuccess && data && (
        <>
          {/* error  */}

          {data?.length <= 0 && (
            <div className="mt-5 shadow-lg">
              <Alert severity="error">
                <Typography>Employees are not available</Typography>
              </Alert>
            </div>
          )}

          {data?.length > 0 && (
            <Table className="!mt-5">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>Employee ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((employee, index) => (
                  <StyledTableRow key={employee.employeeId}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{employee.employeeId}</StyledTableCell>
                    <StyledTableCell>{employee.name}</StyledTableCell>
                    <StyledTableCell>{employee.email}</StyledTableCell>
                    <StyledTableCell>{employee.role}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={employee.employeeId}
                      >
                        <Visibility />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}
