import { useSearchParams } from "react-router-dom";
import ReportDateForm from "../../components/shared/ReportDateForm";
import PageHeader from "../../components/shared/PageHeader";
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
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../utility/utility";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Loader from "../../components/shared/Loader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { allocateApi } from "../../api/allocate";
import type { AllocatedItem } from "../../types";

export default function AllocationReport() {
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
    data: AllocatedItem[];
  }>({
    queryKey: ["allocationReport", page, from_date, to_date],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");

      const res = await allocateApi.getAllocationReport(
        page,
        from_date,
        addOneDay
      );
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="Allocation Report" />

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
          disabled={Boolean(data?.data && data?.data?.length <= 0)}
          onClick={() => downloadExcel("allocationReport", "Allocation Report")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && from_date && to_date && (
        <>
          {data?.data?.length <= 0 && (
            <div className="shadow-lg">
              <Alert severity="error">
                <Typography>Allocation Not Found</Typography>
              </Alert>
            </div>
          )}

          {data?.data?.length > 0 && (
            <>
              <TableContainer>
                <Table id="allocationReport">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Serial</StyledTableCell>
                      <StyledTableCell>Customer Name</StyledTableCell>
                      <StyledTableCell>Customer Email</StyledTableCell>
                      <StyledTableCell>Customer Phone</StyledTableCell>
                      <StyledTableCell>SO</StyledTableCell>
                      <StyledTableCell>Comment</StyledTableCell>
                      <StyledTableCell>Gift Type</StyledTableCell>
                      <StyledTableCell>Gift SKU</StyledTableCell>
                      <StyledTableCell>Gift Quantity</StyledTableCell>
                      <StyledTableCell>Voucher Code</StyledTableCell>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Allocation Date</StyledTableCell>
                      <StyledTableCell>Allocator</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data?.map((report, index) => (
                      <StyledTableRow key={report.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{report.cus_name}</StyledTableCell>
                        <StyledTableCell>{report.cus_email}</StyledTableCell>
                        <StyledTableCell>{report.cus_phone}</StyledTableCell>
                        <StyledTableCell>{report.so}</StyledTableCell>
                        <StyledTableCell>{report.comment}</StyledTableCell>
                        <StyledTableCell>{report.gift_type}</StyledTableCell>
                        <StyledTableCell>
                          {report.gift_sku_code}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.gift_quantity}
                        </StyledTableCell>
                        <StyledTableCell>{report.voucher_code}</StyledTableCell>
                        <StyledTableCell>
                          {report.voucher_amount}
                        </StyledTableCell>
                        <StyledTableCell>
                          {moment(report.created_at).format("ll")}
                        </StyledTableCell>
                        <StyledTableCell>{report.allocated_by}</StyledTableCell>
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
    </div>
  );
}
