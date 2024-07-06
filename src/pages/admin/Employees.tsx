import {
  Alert,
  Button,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import Loader from "../../components/shared/Loader";
import PageHeader from "../../components/shared/PageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { fetchEmployees } from "../../features/employees/employeesSlice";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { Edit, PersonAdd } from "@mui/icons-material";
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import AddEmployee from "../../components/admin/Employees/AddEmployee";
import EditEmployee from "../../components/admin/Employees/EditEmployee";
import PopupState from "material-ui-popup-state";

export default function Employees() {
  // popup state
  const addPopupState = usePopupState({
    variant: "popover",
    popupId: "addEmployee",
  });

  // redux
  const { employees, loading } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <div>
      <PageHeader title="Employees" />

      <Button
        variant="contained"
        className="!text-sm !capitalize !py-3 !px-7"
        startIcon={<PersonAdd />}
        {...bindTrigger(addPopupState)}
      >
        Add Employee
      </Button>

      {/* loader  */}
      {loading && <Loader dataLoading />}

      {!loading && (
        <>
          {employees?.length <= 0 && (
            <div className="mt-5 shadow-xl">
              <Alert severity="error">Employees Not Found</Alert>
            </div>
          )}

          {employees?.length > 0 && (
            <>
              <Table className="!mt-5">
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Employee ID</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell>CSC</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees?.map((employee, index) => (
                    <StyledTableRow key={employee.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{employee.name}</StyledTableCell>
                      <StyledTableCell>{employee.employeeId}</StyledTableCell>
                      <StyledTableCell>{employee.email}</StyledTableCell>
                      <StyledTableCell>{employee.role}</StyledTableCell>
                      <StyledTableCell>{employee.branch}</StyledTableCell>
                      <StyledTableCell>
                        <PopupState variant="popover">
                          {(popupState) => (
                            <>
                              <Tooltip title={`Edit ${employee.name}`}>
                                <IconButton
                                  color="primary"
                                  {...bindTrigger(popupState)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>

                              {/* edit employee dialog */}
                              <Dialog {...bindDialog(popupState)}>
                                <EditEmployee
                                  close={popupState.close}
                                  employee={employee}
                                  refetch={() => dispatch(fetchEmployees())}
                                />
                              </Dialog>
                            </>
                          )}
                        </PopupState>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </>
      )}

      {/* add employee dialog */}
      <Dialog {...bindDialog(addPopupState)}>
        <AddEmployee close={addPopupState.close} />
      </Dialog>
    </div>
  );
}
