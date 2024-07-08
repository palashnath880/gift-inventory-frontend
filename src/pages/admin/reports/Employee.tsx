import { Button } from "@mui/material";
import PageHeader from "../../../components/shared/PageHeader";
import ReportDateForm from "../../../components/shared/ReportDateForm";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../../utility/utility";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchEmployees } from "../../../features/employees/employeesSlice";
import { useEffect } from "react";
import EmployeeApproval from "../../../components/admin/Reports/EmployeeApproval";
import EmployeeGiftVou from "../../../components/admin/Reports/EmployeeGiftVou";

export default function EmployeeReport() {
  const { reportOf } = useParams<{ reportOf: "gift-voucher" | "approval" }>();
  // params
  const [search, setSearch] = useSearchParams();
  const { from_date, to_date, page, filter } = {
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
    page: search.get("page") || "1",
    filter: search.get("filter") || "0",
  };

  // redux
  const { employees } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <div>
      <PageHeader title="Employee Wise Report" />

      <div className="flex items-center gap-4 mb-5">
        <Button
          variant={reportOf !== "approval" ? "contained" : "outlined"}
          className="!px-7 !text-sm !normal-case !py-3"
          component={Link}
          to={`/reports/employee/gift-voucher`}
        >
          Gift & Voucher
        </Button>
        <Button
          variant={reportOf === "approval" ? "contained" : "outlined"}
          className="!px-7 !text-sm !normal-case !py-3"
          component={Link}
          to={`/reports/employee/approval`}
        >
          Approval
        </Button>
      </div>

      <div className="flex justify-between gap-2 items-center">
        <ReportDateForm
          loading={false}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from_date, to_date) => setSearch({ from_date, to_date })}
        />

        <Button
          variant="contained"
          startIcon={<Download />}
          className="!px-7 !text-sm !normal-case !py-3"
          onClick={() =>
            downloadExcel(
              "report",
              reportOf === "approval" ? "Employee Approval" : "Gift Voucher"
            )
          }
        >
          Export as Excel
        </Button>
      </div>

      {reportOf === "approval" ? (
        <EmployeeApproval
          from_date={from_date}
          to_date={to_date}
          page={page}
          filter={filter}
          employees={employees}
          onFilterChange={(id) =>
            setSearch({ from_date, to_date, page: "1", filter: id })
          }
          onPageChange={(newPage) =>
            setSearch({ from_date, to_date, page: newPage })
          }
        />
      ) : (
        <EmployeeGiftVou
          from_date={from_date}
          to_date={to_date}
          employees={employees}
        />
      )}
    </div>
  );
}
