import { Close, Send } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import toast from "react-hot-toast";
import { allocateApi } from "../../api/allocate";
import { messageApi } from "../../api/message";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { generateOTP } from "../../utility/utility";
import type { AllocatedItem } from "../../types";

export default function RedeemButtons({
  item,
  refetch,
}: {
  item: AllocatedItem | undefined;
  refetch: () => void;
}) {
  // states
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sentOtp, setSentOtp] = useState("");
  const [sending, setSending] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  // redeem handler
  const redeemItem = async (type: "otp" | "manual") => {
    try {
      setLoading(true);

      const data: any = {};

      data.type = type;
      data.redeemType = item?.redeem_type;
      if (type === "manual") {
        data.reason = value;
      }

      await allocateApi.redeemItem(item?.id, data);
      toast.success(`Redeem Successfully.`);
      refetch();
      setValue("");
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

      if (item?.redeem_type === "gift") {
        const message: string = `Hello Sir/Madam, \nThank you for being a valued customer. As a token of our appreciation, we have a special gift for you. Please collect your gift from our front executive. Thank you for your continued trust in us. \nBest wishes, \n1000FiX Services Limited`;
        await messageApi.send(item?.cus_phone, message);
        await redeemItem("otp");
        toast.success("Notification sent successfully");
      } else {
        const genOtp = generateOTP();
        const message: string = `Dear Valued Customer,\nUse this OTP for redemption ${genOtp} to get a Discount on your current service.`;
        await messageApi.send(item?.cus_phone, message);
        toast.success("OTP sent successfully");
        setSentOtp(genOtp);
      }
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

  //  if item status is not open
  if (item?.status == "rejected") {
    return (
      <Alert severity="error">
        <Typography>Allocated item is rejected</Typography>
      </Alert>
    );
  }

  if (item?.status == "closed") {
    return (
      <Alert severity="success">
        <Typography>Allocated item is closed</Typography>
      </Alert>
    );
  }

  return (
    <div className="relative">
      {/* loader  */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#f2f2f2] bg-opacity-10 backdrop-blur z-50 grid place-items-center">
          <div className="loader"></div>
        </div>
      )}

      <div className="mb-6">
        {/* otp function */}
        {item?.redeem_type === "voucher" && (
          <>
            {!sentOtp && (
              <Button
                variant="contained"
                color="secondary"
                className="!py-2.5 !px-7"
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
          </>
        )}

        {/* notification for gift */}
        {item?.redeem_type === "gift" && (
          <Button
            variant="contained"
            color="secondary"
            className="!py-2.5 !px-7 !capitalize !text-sm"
            endIcon={<Send />}
            onClick={sendOtp}
            disabled={sending}
          >
            Send Notification with Gift Redeem
          </Button>
        )}
      </div>

      <Divider className="!my-5 !bg-primary" />

      {item?.redeem_type === "voucher" && (
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

                <Dialog {...bindDialog(popupState)}>
                  <div className="w-[400px] px-5 py-4">
                    <div className="flex justify-between items-center">
                      <Typography
                        variant="h5"
                        className="!text-primary !font-semibold"
                      >
                        Redeem manually
                      </Typography>
                      <IconButton onClick={popupState.close}>
                        <Close />
                      </IconButton>
                    </div>
                    <div className="flex flex-col gap-5 mt-3">
                      <TextField
                        fullWidth
                        label="Reason"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="success"
                        className="flex-1 !py-3 !capitalize !text-sm"
                        disabled={!value}
                        onClick={() => {
                          redeemItem("manual");
                          popupState.close();
                        }}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                </Dialog>
              </>
            )}
          </PopupState>
        </div>
      )}
    </div>
  );
}
