import {
  Alert,
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import ReportDateForm from "../../components/shared/ReportDateForm";
import { Download } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../../api/customer";
import moment from "moment";
import Loader from "../../components/shared/Loader";
import type { CustomerReports } from "../../types";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { downloadExcel } from "../../utility/utility";

export default function CustomersReport() {
  // search params
  const [search, setSearch] = useSearchParams();
  const { from_date, page, to_date } = {
    page: search.get("page") || "1",
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
  };

  // react query
  const { data, isLoading, isSuccess } = useQuery<{
    count: number;
    reports: CustomerReports[];
  }>({
    queryKey: ["customersReport", page, from_date, to_date],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");

      const res = await customerApi.getCustomersReport(
        page,
        from_date,
        addOneDay
      );
      return res.data;
    },
  });

  return (
    <>
      <PageHeader title="Customers Report" />

      <div className="flex justify-between items-center">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from, to) =>
            setSearch({ page: "1", from_date: from, to_date: to })
          }
        />
        <Button
          variant="contained"
          startIcon={<Download />}
          className="!px-7 !text-sm !normal-case !py-3"
          disabled={Boolean(data?.reports && data?.reports?.length <= 0)}
          onClick={() => downloadExcel("customers_report", "Customers Report")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && from_date && to_date && (
        <>
          {data?.reports?.length <= 0 && (
            <div className="shadow-lg">
              <Alert severity="error">
                <Typography>Customer Not Found</Typography>
              </Alert>
            </div>
          )}

          {data?.reports?.length > 0 && (
            <>
              <TableContainer>
                <Table id="customers_report">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Serial</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Phone</StyledTableCell>
                      <StyledTableCell>Branch</StyledTableCell>
                      <StyledTableCell>Project</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Remarks</StyledTableCell>
                      <StyledTableCell>Gift Quantity</StyledTableCell>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Approval Amount</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.reports?.map((report, index) => (
                      <StyledTableRow key={report.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{report.name}</StyledTableCell>
                        <StyledTableCell>{report.email}</StyledTableCell>
                        <StyledTableCell>{report.phone_no}</StyledTableCell>
                        <StyledTableCell>{report.branch_name}</StyledTableCell>
                        <StyledTableCell>{report.project_name}</StyledTableCell>
                        <StyledTableCell>{report.type_name}</StyledTableCell>
                        <StyledTableCell className="!min-w-[300px]">
                          {report.remarks}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.gift_quantity}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.voucher_amount}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.approval_amount}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="pb-10 !mt-5 flex justify-center">
                <Pagination
                  count={Math.ceil(data?.count / 50)}
                  page={parseInt(page)}
                  color="primary"
                  onChange={(_, val) =>
                    setSearch({ from_date, to_date, page: val.toString() })
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
