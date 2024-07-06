import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import type { Customer } from "../../types";
import { customerApi } from "../../api/customer";
import Loader from "../../components/shared/Loader";
import SearchInput from "../../components/shared/SearchInput";
import {
  Alert,
  Dialog,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { Edit, Visibility } from "@mui/icons-material";
import PageHeader from "../../components/shared/PageHeader";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import EditCustomer from "../../components/admin/Customers/EditCustomer";

export default function Customers() {
  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search } = {
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || "",
  };

  // get customers
  const { data, isLoading, isSuccess, refetch } = useQuery<{
    count: number;
    data: Customer[];
  }>({
    queryKey: ["customers", page, search],
    queryFn: async () => {
      const res = await customerApi.getAll(parseInt(page), search);
      return res.data;
    },
  });

  return (
    <>
      <PageHeader title="Customers" />
      <div className="!mb-5">
        <SearchInput
          label="Search Customers"
          loading={isLoading}
          value={search}
          onSubmit={(val) => setSearchParams({ page: "1", search: val })}
        />
      </div>

      {/* loader */}
      {isLoading && <Loader dataLoading />}

      {/* data display */}
      {isSuccess && (
        <>
          {/* error  */}
          {data?.data?.length <= 0 && (
            <div className="shadow-xl">
              <Alert severity="error">
                <Typography>Customer Not Available</Typography>
              </Alert>
            </div>
          )}

          {/* customer show */}
          {data?.data?.length > 0 && (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone NO</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Project</StyledTableCell>
                    <StyledTableCell>CSC</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.map((customer) => (
                    <StyledTableRow key={customer.id}>
                      <StyledTableCell>{customer.name}</StyledTableCell>
                      <StyledTableCell>{customer.email}</StyledTableCell>
                      <StyledTableCell>{customer.phoneNo}</StyledTableCell>
                      <StyledTableCell>{customer.type}</StyledTableCell>
                      <StyledTableCell>{customer.project}</StyledTableCell>
                      <StyledTableCell>{customer.csc}</StyledTableCell>
                      <StyledTableCell>
                        <span className="w-full flex justify-end gap-2">
                          <PopupState variant="popover">
                            {(popupState) => (
                              <>
                                <Tooltip title="Edit Customer">
                                  <IconButton
                                    color="primary"
                                    {...bindTrigger(popupState)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>

                                <Dialog {...bindDialog(popupState)}>
                                  <EditCustomer
                                    close={popupState.close}
                                    refetch={refetch}
                                    customer={customer}
                                  />
                                </Dialog>
                              </>
                            )}
                          </PopupState>
                          <IconButton
                            color="primary"
                            component={Link}
                            to={`reports/${customer.id}`}
                          >
                            <Visibility />
                          </IconButton>
                        </span>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-5">
                <Pagination
                  color="primary"
                  count={Math.ceil(data?.count / 50)}
                  page={parseInt(page)}
                  onChange={(_, value) =>
                    setSearchParams({ search, page: value.toString() })
                  }
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
