import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { customerApi } from "../../api/customer";
import ReportDateForm from "../shared/ReportDateForm";
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
import Loader from "../shared/Loader";
import type { AllocatedItem } from "../../types";
import { StyledTableCell, StyledTableRow } from "../shared/MUITable";

interface QueryType {
  count: number;
  reports: AllocatedItem[];
}

export default function CusGiftVoucher({
  customerId,
}: {
  customerId: string | undefined;
}) {
  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, from_date, to_date } = {
    page: searchParams.get("page") || "1",
    from_date: searchParams.get("from_date") || "",
    to_date: searchParams.get("to_date") || "",
  };

  // react-query
  const { data, isLoading, isSuccess } = useQuery<QueryType>({
    queryKey: ["giftVoucherReport", page, from_date, to_date, customerId],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");
      const res = await customerApi.getGiftVoucherReport(
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
      <div className="flex justify-between items-center gap-5">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from_date, to_date) =>
            setSearchParams({ from_date, to_date, page: "1" })
          }
        />

        <Button
          variant="contained"
          startIcon={<Download />}
          className="!px-7 !text-sm !normal-case !py-3"
          disabled={Boolean(data?.reports && data?.reports?.length <= 0)}
          onClick={() =>
            downloadExcel("customerGiftReport", "Gift Voucher Report")
          }
        >
          Export as Excel
        </Button>
      </div>

      {/* loading */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && from_date && to_date && (
        <>
          {data?.reports?.length <= 0 && (
            <div className="mt-5 shadow-xl">
              <Alert severity="error">
                <Typography>Report not found</Typography>
              </Alert>
            </div>
          )}

          {data?.reports?.length > 0 && (
            <>
              <TableContainer>
                <Table id="customerGiftReport">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Serial</StyledTableCell>
                      <StyledTableCell>SO</StyledTableCell>
                      <StyledTableCell>Comment</StyledTableCell>
                      <StyledTableCell>Gift Type</StyledTableCell>
                      <StyledTableCell>Gift SKU</StyledTableCell>
                      <StyledTableCell>Gift Quantity</StyledTableCell>
                      <StyledTableCell>Voucher Code</StyledTableCell>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Allocation Date</StyledTableCell>
                      <StyledTableCell>Allocator</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Redeemed Date</StyledTableCell>
                      <StyledTableCell>Redeemer</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.reports?.map((report, index) => (
                      <StyledTableRow key={report.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
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
                          {moment(report.created_at).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>{report.allocated_by}</StyledTableCell>
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
                        <StyledTableCell>
                          {report.redeemer_name}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* pagination */}
              <div className="flex justify-center !mt-5">
                <Pagination
                  color="primary"
                  count={Math.ceil(data?.count / 100)}
                  page={parseInt(page)}
                  onChange={(_, val) =>
                    setSearchParams({
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
