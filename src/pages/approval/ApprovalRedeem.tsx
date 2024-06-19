import React, { useEffect, useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import {
  Alert,
  Button,
  Divider,
  Popover,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/shared/MUITable";
import { useQuery } from "@tanstack/react-query";
import { approvalApi } from "../../api/approval";
import { useParams } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import type { ApprovalItem } from "../../types";
import moment from "moment";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import OTPInput from "react-otp-input";
import { Send } from "@mui/icons-material";
import { messageApi } from "../../api/message";
import toast from "react-hot-toast";
import { generateOTP } from "../../utility/utility";

const MyRow = ({ value, label }: { value: React.ReactNode; label: string }) => {
  return (
    <StyledTableRow>
      <StyledTableCell>{label}</StyledTableCell>
      <StyledTableCell>{value}</StyledTableCell>
    </StyledTableRow>
  );
};

export default function ApprovalRedeem() {
  // states
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sentOtp, setSentOtp] = useState("");
  const [sending, setSending] = useState<boolean>(false);

  // get param
  const { approvalId } = useParams<{ approvalId: string }>();

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<ApprovalItem>({
    queryKey: ["approval", approvalId],
    queryFn: async () => {
      const res = await approvalApi.getById(approvalId);
      return res.data;
    },
  });

  // redeem handler
  const redeemItem = async (type: "otp" | "manual") => {
    try {
      setLoading(true);
      await approvalApi.redeemApproval(approvalId, { type });
      toast.success(`Redeem Successfully.`);
      refetch();
    } catch (err) {
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // send otp
  const sendOtp = async () => {
    try {
      setSending(true);
      const genOtp = generateOTP();
      const message: string = `Dear Valued Customer, Use this OTP for redemption ${genOtp} to get a Discount on your current service.`;
      await messageApi.send(data?.customer_phone_no, message);
      toast.success("OTP sent successfully");
      setSentOtp(genOtp);
    } catch (err) {
      toast.error("OTP couldn't be sent");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (otp.length === 4 && otp === sentOtp) {
      (async () => {
        await redeemItem("otp");
      })();
    }
  }, [otp, sentOtp]);

  return (
    <>
      <PageHeader title="Approval Redeem" />

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {/* approval not found */}
      {isSuccess && !data && (
        <div className="shadow">
          <Alert severity="error">
            <Typography>Approval Not Found</Typography>
          </Alert>
        </div>
      )}

      {/* if approval has  */}
      {isSuccess && data && ["approved", "redeemed"].includes(data?.status) && (
        <div className="flex gap-5 items-start">
          <div className="flex-1 bg-white px-5 py-5 rounded-lg shadow-xl">
            <Typography variant="h6" className="!text-primary !font-semibold">
              Approval Details
            </Typography>
            <Divider className="!mt-2 !bg-primary" />
            <Table className="!mt-5">
              <TableBody>
                <MyRow label="Customer Name" value={data?.customer_name} />
                <MyRow label="Customer Phone" value={data?.customer_phone_no} />
                <MyRow label="Description" value={data?.description} />
                <MyRow label="Voucher Code" value={data?.voucher_code} />
                <MyRow label="Voucher Amount" value={data?.voucher_amount} />
                <MyRow label="Approver One" value={data?.approver_1_name} />
                <MyRow label="Approver Two" value={data?.approver_2_name} />
                <MyRow
                  label="Send Date"
                  value={moment(data?.created_at).format("ll")}
                />
                <MyRow
                  label="Approve Date"
                  value={moment(data?.appro_end_date).format("ll")}
                />
              </TableBody>
            </Table>
          </div>

          {/* redeem button */}
          <div className="flex-1 bg-white px-5 py-5 rounded-lg shadow-xl">
            {/* loader  */}
            {loading && <Loader dataLoading />}
            {data?.status === "redeemed" && (
              <div className="shadow-lg">
                <Alert>
                  <Typography>Approval Redeemed</Typography>
                </Alert>
              </div>
            )}

            {!loading && data.status === "approved" && (
              <>
                {!sentOtp && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className="!py-2.5 !px-7 !text-sm !capitalize"
                    endIcon={<Send />}
                    onClick={sendOtp}
                    disabled={sending}
                  >
                    Send OTP for Redeem
                  </Button>
                )}

                {sentOtp && (
                  <div className="flex items-center gap-3 flex-col">
                    <Typography
                      variant="h6"
                      className="!font-semibold !text-primary"
                    >
                      Verify OTP
                    </Typography>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      renderSeparator={<span>-</span>}
                      renderInput={(params) => (
                        <input
                          {...params}
                          className="!aspect-square !w-12 !border-primary !border-4 !outline-none !rounded-lg !text-2xl"
                        />
                      )}
                    />
                    {otp.length === 4 && otp !== sentOtp && (
                      <Typography className="text-red-500">
                        OTP does not matched
                      </Typography>
                    )}
                  </div>
                )}

                <Divider className="!my-5 !bg-primary" />
                <div className="">
                  <PopupState variant="popover">
                    {(popupState) => (
                      <>
                        <Button
                          {...bindTrigger(popupState)}
                          variant="contained"
                          className="flex-1 !py-3 !text-sm !capitalize"
                          color="success"
                        >
                          Redeem Manually
                        </Button>
                        <Popover {...bindPopover(popupState)}>
                          <div className="w-[200px] px-2 py-5">
                            <Typography className="!text-primary !font-semibold !text-center !text-sm">
                              Are you sure to redeem it manually?
                            </Typography>
                            <div className="flex justify-between gap-2 mt-3">
                              <Button
                                variant="contained"
                                color="error"
                                className="flex-1 !text-sm !capitalize !py-2"
                                onClick={popupState.close}
                              >
                                No
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                className="flex-1 !text-sm !capitalize !py-2"
                                onClick={() => {
                                  redeemItem("manual");
                                  popupState.close();
                                }}
                              >
                                Yes
                              </Button>
                            </div>
                          </div>
                        </Popover>
                      </>
                    )}
                  </PopupState>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
