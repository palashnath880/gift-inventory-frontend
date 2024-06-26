import { Close, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { bindDialog, bindTrigger } from "material-ui-popup-state";
import type { ApprovalItem, Employee } from "../../types";
import { useAppSelector } from "../../hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { approvalApi } from "../../api/approval";
import { usePopupState } from "material-ui-popup-state/hooks";

interface ApproverTwoEditProps {
  approval: ApprovalItem;
  refetch: () => void;
  employees: Employee[];
}

export default function ApproverTwoEdit({
  approval,
  refetch,
  employees,
}: ApproverTwoEditProps) {
  // states
  const [approverTwo, setApproverTwo] = useState<undefined | Employee | null>(
    () => employees.find((em) => em.id === approval.approver_2)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const popupState = usePopupState({
    variant: "popover",
    popupId: "editApprover2",
  });

  // react-redux
  const user = useAppSelector((state) => state.auth.user);
  const approvers = employees.filter(
    (i) => i?.id !== user?.id && i?.id !== approval.sender_id
  );

  const isChanged = Boolean(
    approverTwo && approverTwo.id !== approval.approver_2
  );

  // update approver 2
  const updateApprover = async (close: () => void) => {
    try {
      setLoading(true);
      await approvalApi.update(approval.id, { approver_2: approverTwo?.id });
      toast.success("Approver Two Updated Successfully");
      refetch();
      close();
    } catch (err) {
      toast.error("Sorry! Approver Two Could Not Be Updated");
    } finally {
      setLoading(false);
    }
  };

  const initApproverTwo = () => {
    const findApproverTwo =
      approvers.find((i) => i.id === approval.approver_2) || null;
    setApproverTwo(findApproverTwo);
  };

  useEffect(() => {
    initApproverTwo();
  }, [popupState.isOpen]);

  return (
    <>
      <IconButton {...bindTrigger(popupState)}>
        <Edit />
      </IconButton>

      {/* edit dialog */}
      <Dialog {...bindDialog(popupState)}>
        <div className="px-3 pt-3 pb-5 sm:min-w-[400px]">
          <div className="flex justify-between items-center">
            <Typography variant="h6" className="!text-primary !font-semibold">
              {approval.approver_2 ? "Edit Approver Two" : "Add Approver Two"}
            </Typography>
            <IconButton onClick={popupState.close}>
              <Close />
            </IconButton>
          </div>

          <div className="!mt-5 flex flex-col gap-5">
            <Autocomplete
              options={approvers}
              value={approverTwo}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, val) => setApproverTwo(val)}
              noOptionsText="No approver match"
              renderOption={(props, option, state) => (
                <ListItem {...props} key={state.index}>
                  <span>
                    <strong>{option.name}</strong>
                    <br />
                    {option.role}
                  </span>
                </ListItem>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Approver Two" />
              )}
            />

            <Button
              fullWidth
              variant="contained"
              className="!py-3 !font-medium !capitalize !text-sm"
              disabled={!isChanged || loading}
              onClick={() => updateApprover(popupState.close)}
            >
              {approval.approver_2 ? "Edit Approver Two" : "Add Approver Two"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
