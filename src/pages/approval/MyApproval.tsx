import PageHeader from "../../components/shared/PageHeader";
import ApprovalForm from "../../components/Approval/ApprovalForm";
import { useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Divider,
  Link,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { approvalApi } from "../../api/approval";
import Loader from "../../components/shared/Loader";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import type { ApprovalItem } from "../../types";
import SearchInput from "../../components/shared/SearchInput";

export default function MyApproval() {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // search params
  const [params, setParams] = useSearchParams();
  const { page, search } = {
    page: params.get("page") || "1",
    search: params.get("search") || "",
  };

  // react-query
  const { data, isLoading, isSuccess, refetch } = useQuery<{
    count: number;
    approvals: ApprovalItem[];
  }>({
    queryKey: ["myApproval", page, search],
    queryFn: async () => {
      const res = await approvalApi.getAll(parseInt(page), search);
      return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="My Approval" />
      <div className="flex justify-between">
        <div className="w-[400px]">
          <SearchInput
            loading={isLoading}
            value={search}
            label="Search my approvals"
            onSubmit={(val: string) => setParams({ page, search: val })}
          />
        </div>
        <Button
          variant="contained"
          className="!px-7 !py-2.5"
          startIcon={<Add />}
          onClick={() => setIsOpen(true)}
        >
          Create Approval
        </Button>
      </div>

      {/* loader */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && data?.approvals?.length > 0 && (
        <>
          <Table className="!mt-5">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Customer</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Voucher</StyledTableCell>
                <StyledTableCell>Approver One</StyledTableCell>
                <StyledTableCell>Approver Two</StyledTableCell>
                <StyledTableCell>Redeemer</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.approvals?.map((approval, index) => (
                <StyledTableRow key={approval.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    <b>{approval.customer_name}</b>
                    <Divider className="!my-1 !bg-primary" />
                    {approval.customer_phone_no}
                  </StyledTableCell>
                  <StyledTableCell>{approval.description}</StyledTableCell>
                  <StyledTableCell>
                    <b>Code: </b>
                    {approval.voucher_code}
                    <Divider className="!my-1 !bg-primary" />
                    <b>Amount: </b>
                    {approval.voucher_amount}
                  </StyledTableCell>
                  <StyledTableCell>{approval.approver_1_name}</StyledTableCell>
                  <StyledTableCell>
                    {approval.approver_2_name || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {approval.redeemer_name || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {approval.status === "open" ? (
                      <Chip label="Open" color="warning" />
                    ) : approval.status === "approved" ? (
                      <Chip label="Approved" color="success" />
                    ) : approval.status === "rejected" ? (
                      <Chip label="Rejected" color="error" />
                    ) : approval.status === "transferred" ? (
                      <Chip
                        color="info"
                        label={`Transferred to ${approval.approver_2_name}`}
                      />
                    ) : (
                      <Chip color="secondary" label={`Redeemed`} />
                    )}
                  </StyledTableCell>

                  <StyledTableCell>
                    {approval.status === "approved" && (
                      <Button
                        variant="contained"
                        LinkComponent={Link}
                        href={`/my-approval/${approval.id}/redeem`}
                      >
                        Redeem
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          {/* pagination  */}
          <div className="flex justify-center !mt-5">
            <Pagination
              color="primary"
              count={Math.ceil(data?.count / 50)}
              page={parseInt(page)}
              onChange={(_, value) =>
                setParams({ search, page: value.toString() })
              }
            />
          </div>
        </>
      )}

      {/* error message  */}
      {isSuccess && data?.approvals?.length <= 0 && (
        <div className="!shadow-md !mt-5">
          <Alert severity="error">
            <Typography>Approval Item Not Found</Typography>
          </Alert>
        </div>
      )}

      {/* approval form  */}
      <ApprovalForm
        open={isOpen}
        close={() => setIsOpen(false)}
        refetch={refetch}
      />
    </div>
  );
}
