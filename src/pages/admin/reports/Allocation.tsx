import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PageHeader from "../../../components/shared/PageHeader";
import ReportDateForm from "../../../components/shared/ReportDateForm";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../../utility/utility";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Loader from "../../../components/shared/Loader";
import { allocateApi } from "../../../api/allocate";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";
import type { AllocatedItem } from "../../../types";

interface QueryReturnType {
  count: number;
  reports: AllocatedItem[];
}

export default function AllocationReport() {
  // params
  const [search, setSearch] = useSearchParams();
  const { from_date, to_date, page } = {
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
    page: search.get("page") || "1",
  };

  // report-react-query
  const { data, isLoading, isSuccess } = useQuery<QueryReturnType>({
    queryKey: ["allocationRedemptionReport", from_date, to_date, page],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return [];
      }
      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");
      const res = await allocateApi.getAdminAllReport(
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

      <div className="flex justify-between gap-2 items-center">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from_date, to_date) => setSearch({ from_date, to_date })}
        />

        <Button
          variant="contained"
          startIcon={<Download />}
          className="!px-7 !text-sm !normal-case !py-3"
          disabled={Boolean(data?.reports && data?.reports?.length <= 0)}
          onClick={() => downloadExcel("allocationReport", "Allocation Report")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* data display */}
      {isSuccess && from_date && to_date && (
        <>
          <TableContainer>
            <Table id="allocationReport">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Serial</StyledTableCell>
                  <StyledTableCell>CSC</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                  <StyledTableCell>SO</StyledTableCell>
                  <StyledTableCell>Comment</StyledTableCell>
                  <StyledTableCell>Gift Type</StyledTableCell>
                  <StyledTableCell>Gift SKU</StyledTableCell>
                  <StyledTableCell>Gift Quantity</StyledTableCell>
                  <StyledTableCell>Voucher Code</StyledTableCell>
                  <StyledTableCell>Voucher Amount</StyledTableCell>
                  <StyledTableCell>Allocation Date</StyledTableCell>
                  <StyledTableCell>Allocator</StyledTableCell>
                  <StyledTableCell>Redemption Date</StyledTableCell>
                  <StyledTableCell>Redeem Type</StyledTableCell>
                  <StyledTableCell>Manual Reason</StyledTableCell>
                  <StyledTableCell>Redeemer</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.reports?.map((report, index) => (
                  <StyledTableRow key={report.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{report.branch}</StyledTableCell>
                    <StyledTableCell>{report.cus_name}</StyledTableCell>
                    <StyledTableCell>{report.cus_email}</StyledTableCell>
                    <StyledTableCell>{report.cus_phone}</StyledTableCell>
                    <StyledTableCell>{report.so}</StyledTableCell>
                    <StyledTableCell>{report.comment}</StyledTableCell>
                    <StyledTableCell>{report.gift_type}</StyledTableCell>
                    <StyledTableCell>{report.gift_sku_code}</StyledTableCell>
                    <StyledTableCell>{report.gift_quantity}</StyledTableCell>
                    <StyledTableCell>{report.voucher_code}</StyledTableCell>
                    <StyledTableCell>{report.voucher_amount}</StyledTableCell>
                    <StyledTableCell>
                      {moment(report.created_at).format("DD-MM-y")}
                    </StyledTableCell>
                    <StyledTableCell>{report.allocated_by}</StyledTableCell>
                    <StyledTableCell>
                      {report.end_date &&
                        moment(report.end_date).format("DD-MM-y")}
                    </StyledTableCell>
                    <StyledTableCell>{report.redeem_by}</StyledTableCell>
                    <StyledTableCell>{report.manual_reason}</StyledTableCell>
                    <StyledTableCell>{report.redeemer_name}</StyledTableCell>
                    <StyledTableCell>
                      {report.status === "open"
                        ? "Open"
                        : report.status === "closed"
                        ? "Redeemed"
                        : "Rejected"}
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
    </div>
  );
}
