import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { customerApi } from "../../api/customer";
import Loader from "../../components/shared/Loader";
import { Alert, Button, Typography } from "@mui/material";
import type { Customer } from "../../types";
import PageHeader from "../../components/shared/PageHeader";
import ApprovalReports from "./reports/ApprovalReports";
import VoucherReports from "./reports/VoucherReports";
import GiftReports from "./reports/GiftReports";

export default function CustomerReport() {
  // get customer id params
  const { customerId, reportType } = useParams<{
    customerId: string;
    reportType: "gift" | "voucher" | "approval";
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

      <Typography className="!text-primary !text-base">
        <strong>Name: </strong>
        {data?.name}
      </Typography>
      <Typography className="!text-primary !text-base">
        <strong>Email: </strong>
        {data?.email}
      </Typography>
      <Typography className="!text-primary !text-base">
        <strong>Phone No: </strong>
        {data?.phoneNo}
      </Typography>
      <div className="flex gap-4 mt-5">
        <Button
          variant={`${
            reportType === "gift" || !reportType ? "contained" : "outlined"
          }`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/customers/${customerId}/report/gift`}
        >
          Gift Report
        </Button>
        <Button
          variant={`${reportType === "voucher" ? "contained" : "outlined"}`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/customers/${customerId}/report/voucher`}
        >
          Voucher Report
        </Button>
        <Button
          variant={`${reportType === "approval" ? "contained" : "outlined"}`}
          className="!py-2.5 !px-7 !font-medium !text-sm !capitalize "
          component={Link}
          to={`/customers/${customerId}/report/approval`}
        >
          Approval Report
        </Button>
      </div>
      <div className="!mt-5">
        {reportType === "approval" ? (
          <ApprovalReports customerId={customerId} />
        ) : reportType === "voucher" ? (
          <VoucherReports customerId={customerId} />
        ) : (
          <GiftReports customerId={customerId} />
        )}
      </div>
    </>
  );
}
