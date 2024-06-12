import {
  Alert,
  Button,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../../api/customer";
import PageHeader from "../../components/shared/PageHeader";
import SearchInput from "../../components/shared/SearchInput";
import Loader from "../../components/shared/Loader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";

interface Customer {
  id: number;
  name: string;
  phoneNo: string;
  email: string;
  type: string;
  project: string;
  csc: string;
  remarks: string;
}

export default function Customers() {
  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search } = {
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || "",
  };

  // react-query
  const { data, isLoading, isSuccess } = useQuery<{
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
    <div className="pb-10">
      <PageHeader title="Customers" />
      <div className="mb-5">
        <SearchInput
          loading={isLoading}
          value={search}
          onSubmit={(value: string) =>
            setSearchParams({ page: "1", search: value })
          }
          label="Search Customers by Name or Phone NO"
        />
      </div>

      {/* loading  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && data?.data?.length > 0 && (
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
              {data?.data?.map(
                ({ id, csc, email, name, phoneNo, project, type }) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell>{name}</StyledTableCell>
                    <StyledTableCell>{email}</StyledTableCell>
                    <StyledTableCell>{phoneNo}</StyledTableCell>
                    <StyledTableCell>{type}</StyledTableCell>
                    <StyledTableCell>{project}</StyledTableCell>
                    <StyledTableCell>{csc}</StyledTableCell>
                    <StyledTableCell>
                      <span className="w-full flex justify-end gap-4">
                        <Link to={`allocate/${id}/gift`}>
                          <Button
                            variant="contained"
                            className="!py-2.5 !font-medium"
                          >
                            Gift Allocate
                          </Button>
                        </Link>
                        <Link to={`allocate/${id}/voucher`}>
                          <Button
                            variant="contained"
                            className="!py-2.5 !font-medium"
                          >
                            Voucher Allocate
                          </Button>
                        </Link>
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                )
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-5">
            <Pagination
              color="primary"
              count={Math.ceil(data?.count / 50)}
              page={parseInt(page)}
              onChange={(e, value) =>
                setSearchParams({ search, page: value.toString() })
              }
            />
          </div>
        </>
      )}

      {isSuccess && data?.data?.length <= 0 && (
        <div className="mt-5 shadow-lg">
          <Alert severity="error">Customer Not Found</Alert>
        </div>
      )}

      <div></div>
    </div>
  );
}
