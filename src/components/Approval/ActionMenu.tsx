import { Close, MoreVert } from "@mui/icons-material";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import type { ApprovalItem } from "../../types";
import { useAppSelector } from "../../hooks";
import toast from "react-hot-toast";
import { useState } from "react";
import { approvalApi } from "../../api/approval";

interface ActionMenuProps {
  refetch: () => void;
  approval: ApprovalItem;
}

export default function ActionMenu({ approval, refetch }: ActionMenuProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [isOpen, setIsOpen] = useState<"reject" | "transfer" | null>();

  // react-deux
  const user = useAppSelector((state) => state.auth.user);
  const vouchers = useAppSelector((state) => state.inventory.voucherCodes);
  const isApproverOne = user?.id === approval.approver_1;
  const isAvailableBal = Boolean(
    user?.availableBal && user?.availableBal > approval.voucher_amount
  );
  const voucherCode = vouchers.find((i) => i.name === approval.voucher_code);
  const isHasPermission = Boolean(
    voucherCode?.allowedRoles?.find((i) => i === user?.role)
  );

  // update handler
  const update = async (action: "approve" | "reject" | "transfer") => {
    try {
      setLoading(true);
      let toastMsg;

      const data: any = {};
      if (action === "approve") {
        data.action = action;
      } else if (action === "reject") {
        data.action = action;
        data.reason = reason;
      } else {
        data.action = action;
        data.reason = reason;
      }

      await approvalApi.update(approval.id, data);
      if (action === "approve") {
        toastMsg = `Approval approved successfully`;
      } else if (action === "reject") {
        toastMsg = `Approval rejected successfully`;
        setReason("");
        setIsOpen(null);
      } else {
        toastMsg = `Approval transferred successfully`;
        setReason("");
        setIsOpen(null);
      }
      refetch();
      toast.success(toastMsg);
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (
    ["rejected", "approved", "redeemed"].includes(approval.status) ||
    (approval.transferred_date && isApproverOne)
  ) {
    return;
  }

  return (
    <>
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <IconButton {...bindTrigger(popupState)}>
              <MoreVert />
            </IconButton>

            <Popover {...bindPopover(popupState)}>
              <div className="flex flex-col gap-3 px-5 py-5 w-[200px]">
                <Button
                  color="success"
                  variant="contained"
                  className="!py-2.5 !text-sm !capitalize"
                  onClick={() => update("approve")}
                  disabled={loading || !isAvailableBal || !isHasPermission}
                >
                  Approved
                </Button>

                {approval.approver_2 && approval.approver_2 !== user?.id ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    className="!py-2.5 !text-sm !capitalize"
                    onClick={() => {
                      setIsOpen("transfer");
                      popupState.close();
                    }}
                  >
                    Transferred to {approval.approver_2_name}
                  </Button>
                ) : (
                  ""
                )}

                <Button
                  color="error"
                  variant="contained"
                  className="!py-2.5 !text-sm !capitalize"
                  onClick={() => {
                    setIsOpen("reject");
                    popupState.close();
                  }}
                >
                  Reject
                </Button>
              </div>
            </Popover>
          </>
        )}
      </PopupState>

      {/* reject dialog */}
      <Dialog open={Boolean(isOpen)} onClose={() => setIsOpen(null)}>
        <div className="!outline-none sm:w-[400px] max-sm:w-[95vw] bg-white rounded-lg px-4 py-5">
          <div className="flex justify-between items-center">
            <Typography className="!text-base !text-primary !font-semibold">
              {isOpen === "reject"
                ? "Write reject reason here"
                : "Write transfer reason here"}
            </Typography>
            <IconButton onClick={() => setIsOpen(null)}>
              <Close />
            </IconButton>
          </div>
          <Divider className="!mt-2 !mb-5 !bg-primary" />
          <TextField
            fullWidth
            multiline
            label="Reason"
            minRows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="success"
            className="!mt-5 !py-3 !font-medium !capitalize !text-sm"
            onClick={() => update(isOpen === "reject" ? "reject" : "transfer")}
            disabled={loading || !reason}
          >
            {isOpen === "reject"
              ? "Reject Approval"
              : `Transfer to ${approval.approver_2_name}`}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
