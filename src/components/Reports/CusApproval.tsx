import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type { ApprovalItem } from "../../types";
import moment from "moment";
import Loader from "../shared/Loader";
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
import { StyledTableCell, StyledTableRow } from "../shared/MUITable";
import { customerApi } from "../../api/customer";
import ReportDateForm from "../shared/ReportDateForm";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../utility/utility";

export default function CusApproval({
  customerId,
}: {
  customerId: string | undefined;
}) {
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
    reports: ApprovalItem[];
  }>({
    queryKey: ["approvalReport", page, from_date, to_date, customerId],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");

      const res = await customerApi.getApprovalReport(
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
          onClick={() => downloadExcel("approvalReport", "Approval Report")}
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
                <Typography>Approval Not Found</Typography>
              </Alert>
            </div>
          )}

          {data?.reports?.length > 0 && (
            <>
              <TableContainer>
                <Table id="approvalReport">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Serial</StyledTableCell>
                      <StyledTableCell>Created At</StyledTableCell>
                      <StyledTableCell>Sender</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell>Voucher Code</StyledTableCell>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Approver 1</StyledTableCell>
                      <StyledTableCell>Approver 1 Comment</StyledTableCell>
                      <StyledTableCell>Approver 2</StyledTableCell>
                      <StyledTableCell>Approver 2 Comment</StyledTableCell>
                      <StyledTableCell>Transferred Date</StyledTableCell>
                      <StyledTableCell>Approver / Rejector</StyledTableCell>
                      <StyledTableCell>Approve / Reject Date</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Redeemer</StyledTableCell>
                      <StyledTableCell>Redeemed Date</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.reports?.map((report, index) => (
                      <StyledTableRow key={report.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {moment(report.created_at).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>{report.sender_name}</StyledTableCell>
                        <StyledTableCell>{report.description}</StyledTableCell>
                        <StyledTableCell>{report.voucher_code}</StyledTableCell>
                        <StyledTableCell>
                          {report.voucher_amount}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.approver_1_name}
                        </StyledTableCell>
                        <StyledTableCell>{report.appro_1_note}</StyledTableCell>
                        <StyledTableCell>
                          {report.approver_2_name}
                        </StyledTableCell>
                        <StyledTableCell>{report.appro_2_note}</StyledTableCell>
                        <StyledTableCell>
                          {report.transferred_date &&
                            moment(report.transferred_date).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.appro_ender_name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.appro_end_date &&
                            moment(report.appro_end_date).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>{report.status}</StyledTableCell>
                        <StyledTableCell>
                          {report.redeemer_name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.redeemed_date &&
                            moment(report.redeemed_date).format("DD-MM-y")}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="pb-10 !mt-5 flex justify-center">
                <Pagination
                  count={Math.ceil(data?.count / 100)}
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
