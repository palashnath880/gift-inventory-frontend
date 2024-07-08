import {
  Alert,
  Autocomplete,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { ApprovalItem, Employee } from "../../../types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { approvalApi } from "../../../api/approval";
import moment from "moment";
import Loader from "../../shared/Loader";
import { StyledTableCell, StyledTableRow } from "../../shared/MUITable";

type EmployeeApprovalProps = {
  from_date: string;
  to_date: string;
  page: string;
  filter: string;
  onPageChange: (page: string) => void;
  onFilterChange: (id: string) => void;
  employees: Employee[];
};

type QueryReturnProps = {
  count: number;
  reports: ApprovalItem[];
};

export default function EmployeeApproval({
  employees,
  from_date,
  to_date,
  page,
  filter,
  onPageChange,
  onFilterChange,
}: EmployeeApprovalProps) {
  // state
  const [selectedEm, setSelectedEm] = useState<Employee | null>(null);

  // react -query
  const { data, isLoading, isSuccess } = useQuery<QueryReturnProps>({
    queryKey: ["approvalReport", from_date, to_date, page, filter],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return [];
      }
      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");

      const res = await approvalApi.getApprovalReport(
        page,
        from_date,
        addOneDay,
        parseInt(filter) ? filter : ""
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (parseInt(filter)) {
      const employee = employees.find((i) => i.id === parseInt(filter));
      employee && setSelectedEm(employee);
    } else {
      setSelectedEm(null);
    }
  }, [filter, employees]);

  return (
    <>
      <div className="">
        <Autocomplete
          className="!w-56"
          options={employees}
          value={selectedEm}
          onChange={(_, val) => onFilterChange(val?.id?.toString() || "0")}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Employee" />
          )}
        />
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* data display */}
      {isSuccess && from_date && to_date && (
        <>
          {data?.reports?.length <= 0 && (
            <div className="!mt-5 shadow-xl">
              <Alert severity="error">
                <Typography>Approval Not Found</Typography>
              </Alert>
            </div>
          )}

          {data?.reports?.length > 0 && (
            <>
              <TableContainer className="!mt-5">
                <Table id="report">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Serial</StyledTableCell>
                      <StyledTableCell>Created At</StyledTableCell>
                      <StyledTableCell>Creator</StyledTableCell>
                      <StyledTableCell>Customer Name</StyledTableCell>
                      <StyledTableCell>Customer Phone</StyledTableCell>
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
                        <StyledTableCell>
                          {report.customer_name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {report.customer_phone_no}
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
                  onChange={(_, val) => onPageChange(val.toString())}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
