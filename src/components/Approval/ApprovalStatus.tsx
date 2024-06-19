import { Chip } from "@mui/material";
import type { ApprovalItem } from "../../types";
import { useAppSelector } from "../../hooks";

export default function ApprovalStatus({
  approval,
}: {
  approval: ApprovalItem;
}) {
  // react-redux
  const user = useAppSelector((state) => state.auth.user);
  const isApproverOne = approval?.approver_1 === user?.id;
  const isApproverTwo = approval?.approver_2 === user?.id;

  // approval status
  const status = approval.status;

  // if approval is transferred
  if (isApproverOne && approval.transferred_date) {
    return <Chip color="info" label={`Transferred`} />;
  }

  if (isApproverTwo && status === "transferred") {
    return <Chip label="Open" color="warning" />;
  }

  return (
    <>
      {status === "open" ? (
        <Chip label="Open" color="warning" />
      ) : status === "approved" ? (
        <Chip label="Approved" color="success" />
      ) : status === "rejected" ? (
        <Chip label="Rejected" color="error" />
      ) : status === "transferred" ? (
        <Chip
          color="info"
          label={`Transferred to ${approval.approver_2_name}`}
        />
      ) : (
        <Chip color="secondary" label={`Approved`} />
      )}
    </>
  );
}
