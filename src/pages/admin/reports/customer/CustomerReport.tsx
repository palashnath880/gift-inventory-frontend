import { Link, useParams } from "react-router-dom";
import type { Customer } from "../../../../types";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../../../../api/customer";
import Loader from "../../../../components/shared/Loader";
import { Alert, Button, Typography } from "@mui/material";
import PageHeader from "../../../../components/shared/PageHeader";
import CusApproval from "../../../../components/Reports/CusApproval";
import CusGiftVoucher from "../../../../components/Reports/CusGiftVoucher";

export default function CustomerReport() {
  // get customer id params
  const { customerId, reportType } = useParams<{
    customerId: string;
    reportType: "gift-voucher" | "approval";
  }>();

  // react query
  const { data, isLoading } = useQuery<Customer>({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      if (!customerId) {
        return null;
      }

      const res = await customerApi.getCustomerById(customerId);
      return res.data;
    },
  });

  // loading
  if (isLoading) {
    return <Loader dataLoading />;
  }

  if (!data) {
    return (
      <div className="shadow-lg !mt-5">
        <Alert severity="error">
          <Typography>Customer not available</Typography>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={`${data?.name} Report`} />

      <div className="flex gap-4 ">
        <Button
          variant={`${
            reportType === "gift-voucher" || !reportType
              ? "contained"
              : "outlined"
          }`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/reports/customer/${customerId}/gift-voucher`}
        >
          Gift-Voucher Report
        </Button>
        <Button
          variant={`${reportType === "approval" ? "contained" : "outlined"}`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/reports/customer/${customerId}/approval`}
        >
          Approval Report
        </Button>
      </div>

      <div className="mt-5">
        {reportType === "approval" ? (
          <CusApproval customerId={customerId} />
        ) : (
          <CusGiftVoucher customerId={customerId} />
        )}
      </div>
    </>
  );
}
