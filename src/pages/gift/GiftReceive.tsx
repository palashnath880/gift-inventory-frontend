import {
  Alert,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { useQuery } from "@tanstack/react-query";
import { stockApi } from "../../api/stock";
import Loader from "../../components/shared/Loader";
import type { StockType } from "../../types";
import moment from "moment";
import StockReceiveAction from "../../components/Gift/StockReceiveAction";
import { Link } from "react-router-dom";

export default function GiftReceive() {
  // react-query
  const { data, isLoading, isSuccess, refetch } = useQuery<StockType[]>({
    queryKey: ["receiveStocks"],
    queryFn: async () => {
      const res = await stockApi.getReceiveStocks();
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="Gift Receive" />

      <Button
        variant="contained"
        className="!text-sm !font-medium !capitalize !px-8 !py-3"
        component={Link}
        to="report"
      >
        Received Report
      </Button>

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* error message */}
      {isSuccess && data?.length <= 0 && (
        <div className="!mt-5 shadow-md">
          <Alert severity="error">
            <Typography variant="body1">
              No stock available to received
            </Typography>
          </Alert>
        </div>
      )}

      {/* display data */}
      {isSuccess && data?.length > 0 && (
        <Table className="!mt-5">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Branch Name</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>SKU Code</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Remarks</StyledTableCell>
              <StyledTableCell>Send Date</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((stock, index) => (
              <StyledTableRow key={stock.id}>
                <StyledTableCell>
                  <strong>{index + 1}</strong>
                </StyledTableCell>
                <StyledTableCell>{stock.sender_branch_name}</StyledTableCell>
                <StyledTableCell>{stock.name}</StyledTableCell>
                <StyledTableCell>{stock.sku_code}</StyledTableCell>
                <StyledTableCell>{stock.type}</StyledTableCell>
                <StyledTableCell>{stock.quantity}</StyledTableCell>
                <StyledTableCell>{stock.remarks}</StyledTableCell>
                <StyledTableCell>
                  {moment(stock.created_at).format("ll")}
                </StyledTableCell>
                <StyledTableCell>
                  <StockReceiveAction refetch={refetch} stock={stock} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
