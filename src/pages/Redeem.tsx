import { useParams } from "react-router-dom";
import PageHeader from "../components/shared/PageHeader";
import { Button, Divider, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import OTPInput from "react-otp-input";
import { useState } from "react";

export default function Redeem() {
  // states
  const [otp, setOtp] = useState("");

  // get redeem item
  const { redeemItem } = useParams<{ redeemItem: "gift" | "voucher" }>();

  return (
    <div>
      <PageHeader
        title={redeemItem === "gift" ? "Gift Redeem" : "Voucher Redeem"}
      />
      <div className="grid grid-cols-2 gap-7">
        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Allocation Details
          </Typography>
          <Divider className="!mb-4 !mt-2 !bg-primary" />
        </div>
        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <div className="mb-6">
            <Button
              variant="outlined"
              color="secondary"
              className="!py-2.5 !px-7"
              endIcon={<Send />}
            >
              Send OTP
            </Button>
            <Typography>Verify OTP</Typography>
            <Divider className="!mb-2" />
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
          </div>
          <div className="flex gap-5 justify-between">
            <Button variant="contained" className="flex-1 !py-3">
              Redeem With OTP
            </Button>
            <Button
              variant="contained"
              className="flex-1 !py-3"
              color="success"
            >
              Redeem Manually
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
