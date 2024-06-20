import { useSearchParams } from "react-router-dom";
import ReportDateForm from "../../../components/shared/ReportDateForm";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../../../api/customer";
import moment from "moment";
import type { AllocateItem } from "../../../types";
import Loader from "../../../components/shared/Loader";
import {
  Alert,
  Button,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../../utility/utility";

export default function VoucherReports({
  customerId,
}: {
  customerId: string | undefined;
}) {
  // params
  const [params, setParams] = useSearchParams();
  const searchParams: any = {
    from_date: params.get("from_date") || "",
    to_date: params.get("to_date") || "",
    page: params.get("page") || "1",
  };
  const { from_date, to_date, page } = searchParams;

  // react query
  const { data, isLoading, isSuccess } = useQuery<{
    count: number;
    reports: AllocateItem[];
  }>({
    queryKey: ["customerGiftReport", from_date, to_date, page, customerId],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return { count: 0, reports: [] };
      }
      const addOneDay = moment(to_date).add("day", 1).format("y-MM-DD");

      const res = await customerApi.getCustomerReport(
        "voucher",
        customerId,
        page,
        from_date,
        addOneDay
      );

      return res.data;
    },
  });

  return (
    <>
      <div className="flex items-center justify-between py-3">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from, to) =>
            setParams({
              ...searchParams,
              from_date: from,
              to_date: to,
              page: "1",
            })
          }
        />
        <Button
          variant="contained"
          className="!text-sm !normal-case !py-3 !px-8"
          startIcon={<Download />}
          onClick={() => downloadExcel("gift_reports", `Customer Report`)}
          disabled={Boolean(data?.reports && data?.reports?.length <= 0)}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && from_date && to_date && (
        <>
          {/* error message */}
          {data?.reports?.length <= 0 && (
            <div className="!mt-5 shadow-lg">
              <Alert severity="error">
                <Typography>No Report Found</Typography>
              </Alert>
            </div>
          )}

          {data?.reports?.length > 0 && (
            <>
              <Table id="gift_reports">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Branch</StyledTableCell>
                    <StyledTableCell>Creator Name</StyledTableCell>
                    <StyledTableCell>SO</StyledTableCell>
                    <StyledTableCell>Voucher Code</StyledTableCell>
                    <StyledTableCell>Voucher Amount</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell>Redeemer Name</StyledTableCell>
                    <StyledTableCell>Redeemed / Rejected Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.reports?.map((report) => (
                    <StyledTableRow key={report.id}>
                      <StyledTableCell>{report.branch_name}</StyledTableCell>
                      <StyledTableCell>{report.creator_name}</StyledTableCell>
                      <StyledTableCell>{report.so}</StyledTableCell>
                      <StyledTableCell>{report.voucher_code}</StyledTableCell>
                      <StyledTableCell>{report.voucher_amount}</StyledTableCell>
                      <StyledTableCell>{report.status}</StyledTableCell>
                      <StyledTableCell>
                        {moment(report.created_at).format("ll")}
                      </StyledTableCell>
                      <StyledTableCell>{report.redeemer_name}</StyledTableCell>
                      <StyledTableCell>
                        {report.end_date &&
                          moment(report.end_date).format("ll")}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-5 flex justify-center">
                <Pagination
                  color="primary"
                  count={Math.ceil(data?.count / 50)}
                  page={parseInt(page)}
                  onChange={(_, val) =>
                    setParams({ ...searchParams, page: val.toString() })
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
