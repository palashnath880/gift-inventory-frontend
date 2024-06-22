import { Close, Done } from "@mui/icons-material";
import { Alert, Button, Popover, Typography } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import toast from "react-hot-toast";
import { allocateApi } from "../../api/allocate";
import { Link } from "react-router-dom";
import { verifyVoucherCode } from "../../utility/utility";
import type { AllocatedItem } from "../../types";
import { useAppSelector } from "../../hooks";

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

  // voucher code
  const voucherCodes = useAppSelector((state) => state.inventory.voucherCodes);
  const getVoucher = voucherCodes.find(
    (i) => i.voucher_code === item?.voucher_code
  );

  const isValid = verifyVoucherCode(
    item?.created_at,
    getVoucher?.exp_days || 0
  );

  // item cancel handler
  const cancelHandler = async () => {
    try {
      setLoading(true);
      await allocateApi.redeemItem(item?.id, { type: "cancel" });
      refetch();
      toast.success("Allocated item canceled successfully");
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isValid && itemType === "voucher") {
    return (
      <Alert severity="error" icon={false}>
        <Typography className="!text-center">
          Voucher code is expired
        </Typography>
      </Alert>
    );
  }

  console.log(isValid);

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

      {/* cancel */}
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              color="error"
              {...bindTrigger(popupState)}
              disabled={loading}
              className="!px-6 !py-2.5 !text-sm !capitalize"
            >
              Cancel
            </Button>
            <Popover {...bindPopover(popupState)}>
              <div className="w-[220px] bg-white px-3 py-3">
                <Typography className="!text-base !font-medium !text-center !text-primary">
                  Are you sure to cancel this item?
                </Typography>
                <div className="flex justify-between !gap-2 mt-2">
                  <Button
                    variant="contained"
                    className="!px-6 !py-2.5 !text-sm !capitalize !flex-1"
                    color="success"
                    startIcon={<Done />}
                    onClick={() => {
                      popupState.close();
                      cancelHandler();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="contained"
                    className="!px-6 !py-2.5 !text-sm !capitalize !flex-1"
                    color="error"
                    startIcon={<Close />}
                    onClick={popupState.close}
                  >
                    No
                  </Button>
                </div>
              </div>
            </Popover>
          </>
        )}
      </PopupState>
    </span>
  );
}
