import PageHeader from "../../components/shared/PageHeader";
import ApprovalForm from "../../components/Approval/ApprovalForm";
import { useState } from "react";
import {
  Alert,
  Button,
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

interface ApprovalItem {
  id: number;
  subject: string;
  reason: string;
  amount: number;
  sender_id: number;
  customer_id: number;
  approver_1: number;
  approver_2: number;
  appro_1_note: string;
  appro_2_note: string;
  status: "open" | "approved" | "rejected" | "transferred";
  transferred_date: string;
  end_by: number;
  end_date: string;
  creator_id: string;
}

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
    items: ApprovalItem[];
  }>({
    queryKey: ["myApproval", page, search],
    queryFn: async () => {
      // const res = await approvalApi.getAll(parseInt(page), search);
      // return res.data;
    },
  });

  return (
    <div>
      <PageHeader title="My Approval" />
      <div>
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

      {isSuccess && data?.items?.length > 0 && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow></StyledTableRow>
            </TableBody>
          </Table>

          {/* pagination  */}
          <div className="flex justify-center mt-5">
            <Pagination
              color="primary"
              count={Math.ceil(data?.count / 50)}
              page={parseInt(page)}
              onChange={(e, value) =>
                setParams({ search, page: value.toString() })
              }
            />
          </div>
        </>
      )}

      {/* error message  */}
      {isSuccess && data?.items?.length <= 0 && (
        <div className="!shadow-md">
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
