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
import ReportDateForm from "../shared/ReportDateForm";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { allocateApi } from "../../api/allocate";
import moment from "moment";
import Loader from "../shared/Loader";
import { StyledTableCell, StyledTableRow } from "../shared/MUITable";
import type { AllocatedItem } from "../../types";
import { downloadExcel } from "../../utility/utility";

interface QueryType {
  count: number;
  reports: AllocatedItem[];
}

export default function GiftVoucherReport({
  userId,
}: {
  userId: number | undefined;
}) {
  // params
  const [search, setSearch] = useSearchParams();
  const { from_date, to_date, page } = {
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
    page: search.get("page") || "1",
  };

  // search
  const { data, isLoading, isSuccess } = useQuery<QueryType>({
    queryKey: ["giftVoucherReport", from_date, to_date, page, userId],
    queryFn: async () => {
      if (!from_date || !to_date || !userId) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");

      const res = await allocateApi.getByEmployee(
        userId,
        page,
        from_date,
        addOneDay
      );
      return res.data;
    },
  });

  return (
    <>
      <div className="flex justify-between gap-5 items-center">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from_date, to_date) =>
            setSearch({ page: "1", from_date, to_date })
          }
        />
        <Button
          variant="contained"
          onClick={() =>
            downloadExcel("employeeReport", `Employee-${userId}-report`)
          }
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* display data  */}
      {isSuccess && from_date && to_date && (
        <>
          {/* error message show  */}
          {data?.reports?.length <= 0 && (
            <div className="mt-5 shadow-lg">
              <Alert severity="error">
                <Typography>Report Not Found</Typography>
              </Alert>
            </div>
          )}

          {/* data show */}
          {data?.reports?.length > 0 && (
            <>
              <TableContainer>
                <Table id="employeeReport">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Phone</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Allocate Date</StyledTableCell>
                      <StyledTableCell>SO</StyledTableCell>
                      <StyledTableCell>Comment</StyledTableCell>
                      <StyledTableCell>SKU Code</StyledTableCell>
                      <StyledTableCell>Gift Type</StyledTableCell>
                      <StyledTableCell>Gift Quantity</StyledTableCell>
                      <StyledTableCell>Voucher Code</StyledTableCell>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Redeem / Reject Date</StyledTableCell>
                      <StyledTableCell>Redeem Type</StyledTableCell>
                      <StyledTableCell>Manual Reason</StyledTableCell>
                      <StyledTableCell>Cancel Reason</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.reports?.map((report, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{report.cus_name}</StyledTableCell>
                        <StyledTableCell>{report.cus_phone}</StyledTableCell>
                        <StyledTableCell>{report.cus_email}</StyledTableCell>
                        <StyledTableCell>
                          {moment(report.created_at).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>{report.so}</StyledTableCell>
                        <StyledTableCell>{report.comment}</StyledTableCell>
                        <StyledTableCell>
                          {report.gift_sku_code}
                        </StyledTableCell>
                        <StyledTableCell>{report.gift_type}</StyledTableCell>
                        <StyledTableCell>
                          {report.gift_quantity}
                        </StyledTableCell>
                        <StyledTableCell>{report.voucher_code}</StyledTableCell>
                        <StyledTableCell>
                          {report.voucher_amount}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.status === "open"
                            ? "Open"
                            : report.status === "closed"
                            ? "Redeemed"
                            : "Reject"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.end_date &&
                            moment(report.end_date).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>{report.redeem_by}</StyledTableCell>
                        <StyledTableCell>
                          {report.manual_reason}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.cancel_reason}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="pb-10 pt-5 flex justify-center">
                <Pagination
                  color="primary"
                  count={Math.ceil(data?.count / 100)}
                  page={parseInt(page)}
                  onChange={(_, val) =>
                    setSearch({
                      from_date,
                      to_date,
                      page: val.toString(),
                    })
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
