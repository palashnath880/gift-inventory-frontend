import { Close, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  Divider,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import type { ApprovalItem, Employee } from "../../types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect, useState } from "react";
import { fetchEmployees } from "../../features/employees/employeesSlice";
import toast from "react-hot-toast";
import { approvalApi } from "../../api/approval";

interface ApproverTwoEditProps {
  approval: ApprovalItem;
  refetch: () => void;
}

export default function ApproverTwoEdit({
  approval,
  refetch,
}: ApproverTwoEditProps) {
  // states
  const [approverTwo, setApproverTwo] = useState<undefined | Employee | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  // react-redux
  const user = useAppSelector((state) => state.auth.user);
  let approvers = useAppSelector((state) => state.employees.employees);
  approvers = approvers.filter(
    (i) => i?.id !== user?.id && i?.id !== approval.sender_id
  );
  const dispatch = useAppDispatch();

  const isApproverOne = user?.id === approval.approver_1;
  const isApproverTwo = user?.id === approval.approver_2;

  // update approver 2
  const updateApprover = async (close: () => void) => {
    if (approval?.approver_2 === approverTwo?.id) {
      return;
    }

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

  useEffect(() => {
    if (approval.approver_2) {
      const findApproverTwo = approvers.find(
        (i) => i.id === approval.approver_2
      );
      setApproverTwo(findApproverTwo);
    }
  }, [approvers, approval.approver_2]);

  useEffect(() => {
    if (isApproverOne) {
      dispatch(fetchEmployees());
    }
  }, [isApproverOne]);

  if (isApproverTwo) {
    return (
      <span className="flex flex-col">
        <Typography className="max-w-[300px]">
          <strong>Transfer Reason: </strong>
          {approval.appro_1_note || "N/A"}
        </Typography>
        <Divider className="!my-2 !bg-primary" />
        <Typography>Me</Typography>
      </span>
    );
  }

  return (
    <PopupState variant="popover">
      {(popupState) => (
        <>
          <span className="flex justify-between items-center">
            {approval.approver_2 === user?.id
              ? "Me"
              : approval.approver_2_name || "N/A"}

            {!approval.transferred_date &&
              approval.status === "open" &&
              isApproverOne && (
                <IconButton {...bindTrigger(popupState)}>
                  <Edit />
                </IconButton>
              )}
          </span>

          <Dialog {...bindDialog(popupState)}>
            <div className="px-3 pt-3 pb-5 sm:min-w-[400px]">
              <div className="flex justify-between items-center">
                <Typography
                  variant="h6"
                  className="!text-primary !font-semibold"
                >
                  {approval.approver_2
                    ? "Edit Approver Two"
                    : "Add Approver Two"}
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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
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
                  className="!py-3 !font-medium !capitalize"
                  disabled={!approverTwo || loading}
                  onClick={() => updateApprover(popupState.close)}
                >
                  {approval.approver_2
                    ? "Edit Approver Two"
                    : "Add Approver Two"}
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </PopupState>
  );
}
