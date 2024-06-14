import { Send } from "@mui/icons-material";
import { Alert, Button, Divider, Popover, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import type { AllocatedItem } from "../../pages/AllocatedItems";
import toast from "react-hot-toast";
import { allocateApi } from "../../api/allocate";
import { messageApi } from "../../api/message";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

const generateOTP = (length = 4) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
};

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

  // redeem handler
  const redeemItem = async (type: "otp" | "manual") => {
    try {
      setLoading(true);

      const data: any = {};

      data.type = type;
      data.redeemType = item?.redeem_type;

      await allocateApi.redeemItem(item?.id, data);
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

      if (item?.redeem_type === "gift") {
        const message: string = `Hello Sir/Madam, 
                  Thank you for being a valued customer. As a token of our appreciation, we have a special gift for you. Please collect our gift from our front executive. Thank you for your continued trust in us.
                  Best wishes,
                  1000FiX Services Limited`;
        await messageApi.send(item?.cus_phone, message);
        await redeemItem("otp");
        toast.success("Notification sent successfully");
      } else {
        const genOtp = generateOTP();
        const message: string = `Dear Valued Customer,
                                  Use this OTP for redemption ${genOtp} to get a Discount on your current service.`;
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
            className="!py-2.5 !px-7"
            endIcon={<Send />}
            onClick={sendOtp}
            disabled={sending}
          >
            Send Notification with Gift Redeem
          </Button>
        )}
      </div>

      <Divider className="!my-5 !bg-primary" />
      <div className="">
        <PopupState variant="popover">
          {(popupState) => (
            <>
              <Button
                {...bindTrigger(popupState)}
                variant="contained"
                className="flex-1 !py-3"
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
                      className="flex-1"
                      onClick={popupState.close}
                    >
                      No
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      className="flex-1"
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
    </div>
  );
}
