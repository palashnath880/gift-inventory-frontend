import { MoreVert } from "@mui/icons-material";
import { Button, IconButton, Popover } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import type { Approval } from "../../pages/approval/ReceiveApproval";

interface ActionMenuProps {
  refetch: () => void;
  approval: Approval;
}

export default function ActionMenu({ approval }: ActionMenuProps) {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <>
          <IconButton {...bindTrigger(popupState)}>
            <MoreVert />
          </IconButton>
          <Popover {...bindPopover(popupState)}>
            <div className="flex flex-col gap-3 px-5 py-5 w-[200px]">
              <Button color="success" variant="contained" className="!py-2.5">
                Allocate
              </Button>
              <Button color="error" variant="contained" className="!py-2.5">
                Reject
              </Button>
            </div>
          </Popover>
        </>
      )}
    </PopupState>
  );
}
