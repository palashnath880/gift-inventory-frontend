import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { allocateApi } from "../../../api/allocate";
import Loader from "../../shared/Loader";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../shared/MUITable";
import type { Employee } from "../../../types";

type EmployeeGiftVouProps = {
  from_date: string;
  to_date: string;
  employees: Employee[];
};

interface ReportItemType {
  creator_id: number;
  allocate_gift: number;
  allocate_voucher: number;
  pending_gift: number;
  pending_voucher: number;
  reject_gift: number;
  reject_voucher: number;
  redeem_gift: number;
  redeem_voucher: number;
  expired_voucher: number;
  approval_amount: number;
  pending_approval: number;
  reject_approval: number;
  redeem_approval: number;
}

const ReportItem = ({
  employee,
  reports,
  index,
}: {
  employee: Employee;
  reports: ReportItemType[];
  index: number;
}) => {
  // get report
  const report =
    (Array.isArray(reports) &&
      reports.find((i) => i.creator_id === employee.id)) ||
    null;

  return (
    <StyledTableRow>
      <StyledTableCell>{index + 1}</StyledTableCell>
      <StyledTableCell>{employee.employeeId}</StyledTableCell>
      <StyledTableCell>{employee.name}</StyledTableCell>
      <StyledTableCell>{employee.email}</StyledTableCell>
      <StyledTableCell>{employee.role}</StyledTableCell>
      <StyledTableCell>{employee.branch}</StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.allocate_gift || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.redeem_gift || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.pending_gift || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.reject_gift || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.allocate_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.redeem_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.pending_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.reject_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.expired_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.approval_amount || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.pending_approval || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.reject_approval || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.redeem_approval || 0}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default function EmployeeGiftVou({
  from_date,
  to_date,
  employees,
}: EmployeeGiftVouProps) {
  // report-react-query
  const { data, isLoading, isSuccess } = useQuery<ReportItemType[]>({
    queryKey: ["allocationRedemptionReport", from_date, to_date],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return [];
      }
      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");
      const res = await allocateApi.getAdminAloRemReport(from_date, addOneDay);
      return res.data;
    },
  });

  return (
    <>
      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* data display */}
      {isSuccess && from_date && to_date && (
        <>
          <TableContainer>
            <Table id="report" className="!mt-5">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>Employee ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>CSC</StyledTableCell>
                  <StyledTableCell>Allocate Gift</StyledTableCell>
                  <StyledTableCell>Redeem Gift</StyledTableCell>
                  <StyledTableCell>Pending Gift</StyledTableCell>
                  <StyledTableCell>Reject Gift</StyledTableCell>
                  <StyledTableCell>Allocate Voucher</StyledTableCell>
                  <StyledTableCell>Redeem Voucher</StyledTableCell>
                  <StyledTableCell>Pending Voucher</StyledTableCell>
                  <StyledTableCell>Reject Voucher</StyledTableCell>
                  <StyledTableCell>Expired Voucher</StyledTableCell>
                  <StyledTableCell>Approval Amount</StyledTableCell>
                  <StyledTableCell>Pending Approval</StyledTableCell>
                  <StyledTableCell>Reject Approval</StyledTableCell>
                  <StyledTableCell>Redeem Approval</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee, index) => (
                  <ReportItem
                    key={employee.id}
                    employee={employee}
                    reports={data}
                    index={index}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
