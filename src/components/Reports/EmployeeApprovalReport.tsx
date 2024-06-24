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
import moment from "moment";
import Loader from "../shared/Loader";
import { StyledTableCell, StyledTableRow } from "../shared/MUITable";
import type { ApprovalItem } from "../../types";
import { downloadExcel } from "../../utility/utility";
import { approvalApi } from "../../api/approval";

interface QueryType {
  count: number;
  reports: ApprovalItem[];
}

export default function EmployeeApprovalReport({
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
    queryKey: ["EmployeeApprovalReport", from_date, to_date, page, userId],
    queryFn: async () => {
      if (!from_date || !to_date || !userId) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");

      const res = await approvalApi.getByEmployee(
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
                      <StyledTableCell>Created At</StyledTableCell>
                      <StyledTableCell>Desc</StyledTableCell>
                      <StyledTableCell>Voucher Code</StyledTableCell>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Approver 1</StyledTableCell>
                      <StyledTableCell>Approver 1 Comment</StyledTableCell>
                      <StyledTableCell>Approver 2</StyledTableCell>
                      <StyledTableCell>Approver 2 Comment</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Transferred Date</StyledTableCell>
                      <StyledTableCell>Approve / Reject Date</StyledTableCell>
                      <StyledTableCell>Redeemer</StyledTableCell>
                      <StyledTableCell>Redeemed Date</StyledTableCell>
                      <StyledTableCell>Redeem Type</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.reports?.map((report, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {report.customer_name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.customer_phone_no}
                        </StyledTableCell>
                        <StyledTableCell>
                          {moment(report.created_at).format("DD-MM-y")}
                        </StyledTableCell>
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
                          {report.status === "open"
                            ? "Open"
                            : report.status === "approved"
                            ? "Approved"
                            : report?.status === "rejected"
                            ? "Reject"
                            : report.status === "redeemed"
                            ? "Redeemed"
                            : "Transferred"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.transferred_date &&
                            moment(report.transferred_date).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.appro_end_date &&
                            moment(report.appro_end_date).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.redeemer_name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.redeemed_date &&
                            moment(report.redeemed_date).format("DD-MM-y")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.redeemed_type}
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
