import {
  Alert,
  Button,
  Chip,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { stockApi } from "../../../api/stock";
import ReportDateForm from "../../shared/ReportDateForm";
import { Download, Refresh } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import Loader from "../../shared/Loader";
import { StyledTableCell, StyledTableRow } from "../../shared/MUITable";
import moment from "moment";
import { arrayToExcel } from "../../../utility/utility";
import toast from "react-hot-toast";

interface TransferListItem {
  name: string;
  sku_code: string;
  type: string;
  remarks: string;
  created_at: string;
  quantity: number;
  status: "open" | "received" | "rejected";
  receiver_branch_name: string;
}

export default function StockTransferList() {
  // search params
  const [search, setSearch] = useSearchParams();
  const { from_date, page, to_date } = {
    page: search.get("page") || "1",
    from_date: search.get("from_date") || "",
    to_date: search.get("to_date") || "",
  };

  // react-query
  const { data, isLoading, isSuccess, refetch } = useQuery<{
    count: number;
    data: TransferListItem[];
  }>({
    queryKey: ["stockTransferList", page, from_date, to_date],
    queryFn: async () => {
      const addOneDay = to_date
        ? moment(to_date).add(1, "days").format("y-MM-DD")
        : "";

      const res = await stockApi.adminTransferList(
        parseInt(page),
        from_date,
        addOneDay
      );
      return res.data;
    },
  });

  // report download handler
  const handleReport = async () => {
    const headerObj = {
      created_at: "Transfer Date",
      receiver_branch_name: "Transfer To",
      name: "Name",
      sku_code: "SKU Code",
      type: "Gift Type",
      quantity: "Quantity",
      remarks: "Remarks",
      status: "Status",
    };
    try {
      const res = await stockApi.downloadTransferReport(from_date, to_date);
      let data: any[] = res.data;
      if (Array.isArray(data)) {
        data = data.map((i: TransferListItem) => ({
          ...i,
          created_at: moment(i.created_at).format("ll"),
          status:
            i.status === "open"
              ? "Part In Transit"
              : i.status === "received"
              ? "Received"
              : "Rejected",
        }));

        arrayToExcel(headerObj, data, "Transfer Report");
      } else {
        toast.error("Sorry! No data available");
      }
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    }
  };

  return (
    <div className="mt-6 bg-white px-5 py-5 mb-10 shadow-xl rounded-xl">
      <Typography variant="h6" className="!text-primary !font-semibold">
        Stock Transfer List
      </Typography>
      <Divider className="!my-4 !bg-primary" />
      <div className="flex justify-between items-center">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from_date, to_date) =>
            setSearch({ page: "1", from_date, to_date })
          }
        />
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="secondary"
            className="!px-7 !py-3 !text-sm !capitalize"
            onClick={() => refetch()}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="!px-7 !py-3 !text-sm !capitalize"
            onClick={handleReport}
            startIcon={<Download />}
            disabled={Boolean(data?.data && data?.data?.length <= 0)}
          >
            export as excel
          </Button>
        </div>
      </div>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && (
        <>
          {/* error message */}
          {data?.data?.length <= 0 && (
            <div className="!mt-5">
              <Alert severity="error">
                <Typography>No Transfer List</Typography>
              </Alert>
            </div>
          )}

          {data?.data?.length > 0 && (
            <>
              <Table id="transferList">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Serial</StyledTableCell>
                    <StyledTableCell>Transfer Date</StyledTableCell>
                    <StyledTableCell>Transfer To</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>SKU Code</StyledTableCell>
                    <StyledTableCell>Gift Type</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Remarks</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.map((list, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>
                        {moment(list.created_at).format("ll")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {list.receiver_branch_name}
                      </StyledTableCell>
                      <StyledTableCell>{list.name}</StyledTableCell>
                      <StyledTableCell>{list.sku_code}</StyledTableCell>
                      <StyledTableCell>{list.type}</StyledTableCell>
                      <StyledTableCell>{list.quantity}</StyledTableCell>
                      <StyledTableCell>{list.remarks}</StyledTableCell>
                      <StyledTableCell>
                        {list.status === "open" ? (
                          <Chip label="Part In Transit" color="info" />
                        ) : list.status === "received" ? (
                          <Chip label="Received" color="success" />
                        ) : (
                          <Chip label="Rejected" color="error" />
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-5">
                <Pagination
                  count={Math.ceil(data?.count / 50)}
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
    </div>
  );
}
