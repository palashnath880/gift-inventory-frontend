import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import ReportDateForm from "../../components/shared/ReportDateForm";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { stockApi } from "../../api/stock";
import Loader from "../../components/shared/Loader";
import type { GiftReceivedReportItem } from "../../types";
import {
  Alert,
  Button,
  Chip,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../utility/utility";

export default function GiftReceiveReport() {
  // search params
  const [params, setParams] = useSearchParams();
  const { fromDate, toDate } = {
    fromDate: params.get("from_date") || "",
    toDate: params.get("to_date") || "",
  };

  const { data, isLoading, isSuccess } = useQuery<{
    count: number;
    reports: GiftReceivedReportItem[];
  }>({
    queryKey: ["GiftReceivedReports", fromDate, toDate],
    queryFn: async () => {
      if (!fromDate || !toDate) {
        return { count: 0, reports: [] };
      }
      const addOneDay = moment(toDate).add("day", 1).format("y-MM-DD");
      const res = await stockApi.getReceivedReports(fromDate, addOneDay);
      return res.data;
    },
  });

  console.log(data);

  return (
    <>
      <PageHeader title="Gift Received Report" />

      {/* report search form */}
      <ReportDateForm
        loading={isLoading}
        onSearch={(fDate, tDate) =>
          setParams({ from_date: fDate, to_date: tDate })
        }
        values={{ fromDate, toDate }}
      />

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* display reports */}
      {isSuccess && fromDate && toDate && (
        <>
          {data?.reports?.length > 0 && (
            <div className="mt-5">
              <Button
                variant="contained"
                startIcon={<Download />}
                className="!px-8 !py-3 !text-sm !normal-case"
                onClick={() =>
                  downloadExcel(
                    "receivedReports",
                    "Gift Stock Received Reports"
                  )
                }
              >
                Export as Excel
              </Button>
              <Table className="!mt-5" id="receivedReports">
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    {/* <StyledTableCell>Name</StyledTableCell> */}
                    <StyledTableCell>SKU Code</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Remarks</StyledTableCell>
                    <StyledTableCell>Send Date</StyledTableCell>
                    <StyledTableCell>Received / Rejected Date</StyledTableCell>
                    <StyledTableCell>Received</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.reports?.map((report, index) => (
                    <StyledTableRow key={report.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      {/* <StyledTableCell>{report.name}</StyledTableCell> */}
                      <StyledTableCell>{report.sku_code}</StyledTableCell>
                      <StyledTableCell>{report.type}</StyledTableCell>
                      <StyledTableCell>{report.quantity}</StyledTableCell>
                      <StyledTableCell>{report.remarks}</StyledTableCell>
                      <StyledTableCell>
                        {moment(report.created_at).format("ll")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {moment(report.end_date).format("ll")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {report?.status === "received" ? (
                          <Chip label="Yes" color="success" />
                        ) : (
                          <Chip label="No" color="error" />
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* error message  */}
          {data?.reports?.length <= 0 && (
            <div className="!mt-5 shadow-lg">
              <Alert severity="error">
                <Typography>There are no items within these date</Typography>
              </Alert>
            </div>
          )}
        </>
      )}
    </>
  );
}
