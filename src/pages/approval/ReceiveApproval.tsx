import {
  Alert,
  Divider,
  Pagination,
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
import SearchInput from "../../components/shared/SearchInput";
import ActionMenu from "../../components/Approval/ActionMenu";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/shared/Loader";
import { useSearchParams } from "react-router-dom";
import { approvalApi } from "../../api/approval";
import type { ApprovalItem } from "../../types";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ApproverTwoEdit from "../../components/Approval/ApproverTwoEdit";
import ApprovalStatus from "../../components/Approval/ApprovalStatus";
import { fetchEmployees } from "../../features/employees/employeesSlice";
import { useEffect } from "react";

export default function ReceiveApproval() {
  // react-redux
  const user = useAppSelector((state) => state.auth.user);
  const employees = useAppSelector((state) => state.employees.employees);
  const dispatch = useAppDispatch();

  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search } = {
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || "",
  };

  // react-query
  const { data, isLoading, refetch, isSuccess } = useQuery<{
    count: number;
    approvals: ApprovalItem[];
  }>({
    queryKey: ["receiveApproval", page, search],
    queryFn: async () => {
      const res = await approvalApi.getReceiveApproval(parseInt(page), search);
      return res.data;
    },
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <div>
      <PageHeader title="Receive Approval" />
      <div className="flex justify-between items-center">
        <SearchInput
          value={search}
          label="Search Approvals"
          loading={isLoading}
          onSubmit={(value) => {
            setSearchParams({ page: "1", search: value });
          }}
        />
      </div>

      <div className="mt-5">
        {/* loader */}
        {isLoading && <Loader dataLoading />}

        {/* approval display table */}
        {isSuccess && data?.approvals?.length > 0 && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>Created At</StyledTableCell>
                  <StyledTableCell>Sender</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Voucher</StyledTableCell>
                  <StyledTableCell>Approver One</StyledTableCell>
                  <StyledTableCell>Approver Two</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.approvals?.map((approval, index) => (
                  <StyledTableRow key={approval.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>
                      {moment(approval.created_at).format("ll")}
                    </StyledTableCell>
                    <StyledTableCell>
                      <b>{approval.sender_name}</b>
                      <Divider className="!my-1 bg-primary" />
                      {approval.branch_name}
                    </StyledTableCell>
                    <StyledTableCell>{approval.description}</StyledTableCell>
                    <StyledTableCell>
                      <b>Code: </b>
                      {approval.voucher_code}
                      <Divider className="!my-1 !bg-primary" />
                      <b>Amount: </b>
                      {approval.voucher_amount}
                    </StyledTableCell>
                    <StyledTableCell>
                      {approval.approver_1 === user?.id
                        ? "Me"
                        : approval.approver_1_name}
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className="flex justify-between gap-2 items-center">
                        {/* approver 2 name show */}
                        {approval.approver_2 === user?.id ? (
                          <span className="flex flex-col">
                            <Typography className="max-w-[300px]">
                              <strong>Transfer Reason: </strong>
                              {approval.appro_1_note || "N/A"}
                            </Typography>
                            <Divider className="!my-2 !bg-primary" />
                            <Typography>Me</Typography>
                          </span>
                        ) : (
                          approval.approver_2_name || "N/A"
                        )}

                        {/* approver 2 edit popup */}
                        {approval.approver_1 === user?.id &&
                          approval.status === "open" &&
                          !approval.transferred_date && (
                            <ApproverTwoEdit
                              refetch={refetch}
                              approval={approval}
                              employees={employees}
                            />
                          )}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <ApprovalStatus approval={approval} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <ActionMenu approval={approval} refetch={refetch} />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>

            {/* pagination */}
            <div className="flex justify-center !mt-5">
              <Pagination
                color="primary"
                count={Math.ceil(data?.count / 50)}
                page={parseInt(page)}
                onChange={(_, val) =>
                  setSearchParams({ search, page: val.toString() })
                }
              />
            </div>
          </>
        )}

        {/* error message */}
        {isSuccess && data?.approvals?.length <= 0 && (
          <div className="!bg-white !shadow-md !mt-5">
            <Alert severity="error">
              <Typography>Approval Not Found</Typography>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
