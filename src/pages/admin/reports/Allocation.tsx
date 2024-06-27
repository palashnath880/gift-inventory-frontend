import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material";
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
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchEmployees } from "../../../features/employees/employeesSlice";
import { useEffect } from "react";
import type { Employee } from "../../../types";

interface ReportItemType {
  creator_id: number;
  allocate_gift: number;
  allocate_voucher: number;
  redeem_gift: number;
  redeem_voucher: number;
  approval_amount: number;
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
        {report?.allocate_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.redeem_voucher || 0}
      </StyledTableCell>
      <StyledTableCell className="!text-center">
        {report?.approval_amount || 0}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default function AllocationRedemption() {
  // params
  const [search, setSearch] = useSearchParams();
  const { from_date, to_date } = {
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
  };

  // redux
  const { employees } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <div>
      <PageHeader title="Employee Wise Report" />

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
          // disabled={Boolean(data?.data && data?.data?.length <= 0)}
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
          <Table id="allocationReport" className="!mt-5">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Employee ID</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Branch</StyledTableCell>
                <StyledTableCell>Allocate Gift</StyledTableCell>
                <StyledTableCell>Redeem Gift</StyledTableCell>
                <StyledTableCell>Allocate Voucher</StyledTableCell>
                <StyledTableCell>Redeem Voucher</StyledTableCell>
                <StyledTableCell>Approval Amount</StyledTableCell>
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
        </>
      )}
    </div>
  );
}
