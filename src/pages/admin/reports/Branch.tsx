import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material";
import PageHeader from "../../../components/shared/PageHeader";
import { useAppSelector } from "../../../hooks";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/shared/MUITable";
import type { AssetsType } from "../../../types";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { allocateApi } from "../../../api/allocate";
import ReportDateForm from "../../../components/shared/ReportDateForm";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../../utility/utility";
import Loader from "../../../components/shared/Loader";

interface ReportItemType {
  branch_id: number;
  allocate_gift: number;
  allocate_voucher: number;
  pending_voucher: number;
  redeem_gift: number;
  redeem_voucher: number;
  pending_gift: number;
  reject_voucher: number;
  reject_gift: number;
}

const ReportItem = ({
  branch,
  index,
  reports,
}: {
  branch: AssetsType;
  index: number;
  reports: ReportItemType[];
}) => {
  // get report
  const report =
    (Array.isArray(reports) &&
      reports.find((i) => i.branch_id === parseInt(branch.id))) ||
    null;

  return (
    <StyledTableRow>
      <StyledTableCell>{index + 1}</StyledTableCell>
      <StyledTableCell>{branch.name}</StyledTableCell>
      <StyledTableCell>{report?.allocate_gift || 0}</StyledTableCell>
      <StyledTableCell>{report?.redeem_gift || 0}</StyledTableCell>
      <StyledTableCell>{report?.pending_gift || 0}</StyledTableCell>
      <StyledTableCell>{report?.reject_gift || 0}</StyledTableCell>
      <StyledTableCell>{report?.allocate_voucher || 0}</StyledTableCell>
      <StyledTableCell>{report?.redeem_voucher || 0}</StyledTableCell>
      <StyledTableCell>{report?.pending_voucher || 0}</StyledTableCell>
      <StyledTableCell>{report?.reject_voucher || 0}</StyledTableCell>
    </StyledTableRow>
  );
};

export default function Branch() {
  // params
  const [search, setSearch] = useSearchParams();
  const { from_date, to_date } = {
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
  };

  // branches
  const branches = useAppSelector((state) => state.assets.branches);

  // report-react-query
  const { data, isLoading, isSuccess } = useQuery<ReportItemType[]>({
    queryKey: ["allocationRedemptionReport", from_date, to_date],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return [];
      }
      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");
      const res = await allocateApi.getAloRemReportByBranch(
        from_date,
        addOneDay
      );
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="CSC Report" />

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
          onClick={() => downloadExcel("branchReport", "Branch Report")}
        >
          Export as Excel
        </Button>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* data display */}
      {isSuccess && from_date && to_date && (
        <>
          <Table id="branchReport" className="!mt-5">
            <TableHead>
              <TableRow>
                <StyledTableCell>Serial</StyledTableCell>
                <StyledTableCell>CSC Name</StyledTableCell>
                <StyledTableCell>Allocate Gift</StyledTableCell>
                <StyledTableCell>Redeem Gift</StyledTableCell>
                <StyledTableCell>Pending Gift</StyledTableCell>
                <StyledTableCell>Reject Gift</StyledTableCell>
                <StyledTableCell>Allocate Voucher</StyledTableCell>
                <StyledTableCell>Redeem Voucher</StyledTableCell>
                <StyledTableCell>Pending Voucher</StyledTableCell>
                <StyledTableCell>Reject Voucher</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch, index) => (
                <ReportItem index={index} branch={branch} reports={data} />
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
