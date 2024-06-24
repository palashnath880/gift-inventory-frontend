import { useQuery } from "@tanstack/react-query";
import type { Employee } from "../../types";
import { Alert, Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { employeeApi } from "../../api/employee";
import PageHeader from "../../components/shared/PageHeader";
import Loader from "../../components/shared/Loader";
import EmployeeApprovalReport from "../../components/Reports/EmployeeApprovalReport";
import GiftVoucherReport from "../../components/Reports/GiftVoucherReport";

export default function EmployeeReport() {
  // get params
  const { employeeId, reportFor } = useParams<{
    employeeId: string;
    reportFor: undefined | "gift-voucher" | "approval";
  }>();

  // get employee
  const { data: employee, isLoading } = useQuery<Employee | null>({
    queryKey: ["employeeReport", employeeId],
    queryFn: async () => {
      const res = await employeeApi.getEmployeeById(employeeId);
      return res.data;
    },
  });

  // loader
  if (isLoading) {
    return <Loader dataLoading />;
  }

  if (!employee) {
    return (
      <div className="shadow-lg">
        <Alert severity="error">
          <Typography>
            Employee Not Found
            <Link
              to="/employee-report"
              className="!text-red-500 !ml-2 !underline"
            >
              Back
            </Link>
          </Typography>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`${employee?.name} Report`} />

      <div className="flex gap-4">
        <Button
          variant={`${
            reportFor === "gift-voucher" || !reportFor
              ? "contained"
              : "outlined"
          }`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/employee-report/${employeeId}/gift-voucher`}
        >
          Gift-Voucher Report
        </Button>
        <Button
          variant={`${reportFor === "approval" ? "contained" : "outlined"}`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/employee-report/${employeeId}/approval`}
        >
          Approval Report
        </Button>
      </div>

      <div className="mt-5">
        {reportFor === "approval" ? (
          <EmployeeApprovalReport userId={employee?.id} />
        ) : (
          <GiftVoucherReport userId={employee?.id} />
        )}
      </div>
    </div>
  );
}
