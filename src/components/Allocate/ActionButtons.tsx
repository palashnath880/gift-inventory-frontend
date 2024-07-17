import { Close } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import toast from "react-hot-toast";
import { allocateApi } from "../../api/allocate";
import { Link } from "react-router-dom";
import { verifyVoucherCode } from "../../utility/utility";
import type { AllocatedItem } from "../../types";
import { useAppSelector } from "../../hooks";
import { bindDialog, usePopupState } from "material-ui-popup-state/hooks";

export default function ActionButtons({
  item,
  itemType,
  refetch,
}: {
  item: AllocatedItem;
  refetch: () => void;
  itemType: string | undefined;
}) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  // cancel dialog
  const cancelPopup = usePopupState({
    variant: "popover",
    popupId: "cancelPopup",
  });

  // voucher code
  const voucherCodes = useAppSelector((state) => state.inventory.voucherCodes);
  const getVoucher = voucherCodes.find((i) => i.name === item?.voucher_code);

  const isValid = verifyVoucherCode(item?.created_at, getVoucher?.expDays || 0);

  // item cancel handler
  const cancelHandler = async () => {
    try {
      setLoading(true);
      await allocateApi.redeemItem(item?.id, { type: "cancel", reason });
      refetch();
      toast.success("Allocated item canceled successfully");
      // close dialog popup
      typeof cancelPopup.close === "function" && cancelPopup.close();
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isValid && itemType === "voucher") {
    return <Chip label={<Typography>Expired</Typography>} color="error" />;
  }

  return (
    <span className="flex justify-end gap-2">
      <Button
        variant="contained"
        color="success"
        component={Link}
        to={`/allocated/${itemType}/${item?.id}/redeem`}
        className="!px-6 !py-2.5 !text-sm !capitalize"
      >
        Redeem
      </Button>

      {/* cancel button  */}
      <Button
        variant="contained"
        color="error"
        {...bindTrigger(cancelPopup)}
        disabled={loading}
        className="!px-6 !py-2.5 !text-sm !capitalize"
      >
        Cancel
      </Button>

      {/* cancel reason dialog */}
      <Dialog {...bindDialog(cancelPopup)}>
        <div className="pt-3 pb-5 max-sm:w-[95%] sm:w-[420px]">
          <div className="px-5 flex justify-between items-center gap-4 border-b border-primary pb-2">
            <Typography variant="h6" className="!font-bold !text-primary">
              Cancel Reason
            </Typography>
            <IconButton onClick={cancelPopup.close}>
              <Close />
            </IconButton>
          </div>
          <div className="px-5 pt-4">
            <div className="flex flex-col gap-5">
              <TextField
                label="Cancel Reason"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="error"
                className="!py-2.5 !text-sm !capitalize"
                disabled={loading || !reason}
                onClick={cancelHandler}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </span>
  );
}
