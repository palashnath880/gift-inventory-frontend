import { Divider, Typography } from "@mui/material";

export default function VoucherCode() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="!text-primary !font-semibold">
          Voucher Code
          <span className="!ml-2 !text-black">(20)</span>
        </Typography>
      </div>
      <Divider className="!bg-primary !my-3" />
    </div>
  );
}
