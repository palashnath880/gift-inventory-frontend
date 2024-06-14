import { Close, Done } from "@mui/icons-material";
import { Button, Link, Popover, Typography } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import toast from "react-hot-toast";
import { allocateApi } from "../../api/allocate";

export default function ActionButtons({
  itemId,
  itemType,
  refetch,
}: {
  itemId: number;
  refetch: () => void;
  itemType: string | undefined;
}) {
  // states
  const [loading, setLoading] = useState<boolean>(false);

  // item cancel handler
  const cancelHandler = async () => {
    try {
      setLoading(true);
      await allocateApi.redeemItem(itemId, { type: "cancel" });
      refetch();
      toast.success("Allocated item canceled successfully");
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="flex justify-end gap-2">
      <Button
        variant="contained"
        color="success"
        LinkComponent={Link}
        href={`/allocated/${itemType}/${itemId}/redeem`}
      >
        Redeem
      </Button>
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              color="error"
              {...bindTrigger(popupState)}
              disabled={loading}
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
                    className="!flex-1"
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
                    className="!flex-1"
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
