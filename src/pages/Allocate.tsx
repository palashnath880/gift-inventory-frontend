import { Divider, Typography } from "@mui/material";
import PageHeader from "../components/shared/PageHeader";

import Customer from "../components/shared/Customer";
import AllocateForm from "../components/shared/AllocateForm";
import { useParams } from "react-router-dom";

export default function Allocate() {
  // get params
  const { allocateItem } = useParams<{
    allocateItem: "gift" | "voucher" | undefined;
  }>();

  return (
    <div>
      <PageHeader title="Gift Allocate" />
      <div className="grid grid-cols-2 gap-7">
        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Customer
          </Typography>
          <Divider className="!mb-4 !mt-2 !bg-primary" />
          <Customer />
        </div>
        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <AllocateForm allocate={allocateItem} />
        </div>
      </div>
    </div>
  );
}
