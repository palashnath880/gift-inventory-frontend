import { useState } from "react";
import { StockType } from "../../types";
import { Button, Dialog, Divider, TextField, Typography } from "@mui/material";
import { Close, Done } from "@mui/icons-material";
import toast from "react-hot-toast";
import { stockApi } from "../../api/stock";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";

export default function StockReceiveAction({
  refetch,
  stock,
}: {
  refetch: () => void;
  stock: StockType;
}) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  // status update handler
  const actionHandler = async (
    status: "rejected" | "received",
    close?: () => void
  ) => {
    try {
      setLoading(true);
      await stockApi.stockStatusUpdate(stock.id, { status, reason });
      if (status === "received") {
        toast.success("Stock receive successfully.");
      } else {
        setReason("");
        typeof close === "function" && close();
        toast.success("Stock rejected.");
      }

      refetch();
    } catch (err) {
      setLoading(false);
      toast.error("Sorry! Something went wrong");
    }
  };

  if (stock.status !== "open") {
    return <></>;
  }

  return (
    <span className="flex items-center gap-4 justify-end">
      <Button
        variant="contained"
        className="!py-2.5 !px-6 !text-sm !capitalize"
        color="success"
        startIcon={<Done />}
        disabled={loading}
        onClick={() => actionHandler("received")}
      >
        Accept
      </Button>
      <PopupState variant="popover" popupId="rejectStock">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              className="!py-2.5 !px-6 !text-sm !capitalize"
              color="error"
              startIcon={<Close />}
              {...bindTrigger(popupState)}
            >
              Reject
            </Button>

            <Dialog {...bindDialog(popupState)}>
              <div className="sm:w-[450px] px-5 py-4">
                <Typography
                  variant="h6"
                  className="!font-semibold !text-primary"
                >
                  Reject Reason
                </Typography>
                <Divider className="!my-2" />
                <div className="mb-5 mt-5">
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Reject Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <Button
                    variant="contained"
                    className="!py-2.5 !px-6 !text-sm !capitalize flex-1"
                    color="error"
                    disabled={loading || !reason}
                    onClick={() => actionHandler("rejected", popupState.close)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    className="!py-2.5 !px-6 !text-sm !capitalize flex-1"
                    onClick={() => {
                      popupState.close();
                      setReason("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Dialog>
          </>
        )}
      </PopupState>
    </span>
  );
}
