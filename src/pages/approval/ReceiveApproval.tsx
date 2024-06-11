import { Alert, Table, TableBody, TableHead, TableRow } from "@mui/material";
import PageHeader from "../../components/shared/PageHeader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import SearchInput from "../../components/shared/SearchInput";
import ActionMenu from "../../components/Approval/ActionMenu";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/shared/Loader";
import { useSearchParams } from "react-router-dom";

export type Approval = {
  id: number | string;
  branch: string;
  subject: string;
  reason: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  amount: number;
};

export default function ReceiveApproval() {
  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search } = {
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || "",
  };

  // react-query
  const { data, isLoading, refetch, isSuccess } = useQuery<Approval[]>({
    queryKey: ["receiveApproval", page, search],
    queryFn: async () => {
      return [];
    },
  });

  return (
    <div>
      <PageHeader title="Receive Approval" />
      <div>
        <SearchInput
          value={search}
          label="Search Approvals"
          loading={isLoading}
          onSubmit={(value) => {
            setSearchParams({ page, search: value });
          }}
        />
      </div>
      <div className="mt-5">
        {/* loader */}
        {isLoading && <Loader dataLoading />}

        {/* approval display table */}
        {isSuccess && data?.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Sender</StyledTableCell>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Reason</StyledTableCell>
                <StyledTableCell>Item Name</StyledTableCell>
                <StyledTableCell>Item Code</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((approval, index) => (
                <StyledTableRow key={approval.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    <strong>{approval.branch}</strong>
                    {approval.branch}
                  </StyledTableCell>
                  <StyledTableCell>{approval.subject}</StyledTableCell>
                  <StyledTableCell>{approval.reason}</StyledTableCell>
                  <StyledTableCell>{approval.itemName}</StyledTableCell>
                  <StyledTableCell>{approval.itemCode}</StyledTableCell>
                  <StyledTableCell>{approval.quantity}</StyledTableCell>
                  <StyledTableCell>{approval.amount}</StyledTableCell>
                  <StyledTableCell>
                    <ActionMenu approval={approval} refetch={refetch} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* error message */}
        {isSuccess && data?.length <= 0 && (
          <div className="!bg-white !shadow-md">
            <Alert severity="error">Approval Not Found </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
