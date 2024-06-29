import { useParams } from "react-router-dom";
import PageHeader from "../components/shared/PageHeader";
import { Alert, Divider, Table, TableBody, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { allocateApi } from "../api/allocate";
import Loader from "../components/shared/Loader";
import { StyledTableCell, StyledTableRow } from "../components/shared/MUITable";
import moment from "moment";
import RedeemButtons from "../components/Redeem/RedeemButtons";
import type { AllocatedItem } from "../types";

const MyRow = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <StyledTableRow>
      <StyledTableCell>{label}</StyledTableCell>
      <StyledTableCell>{value}</StyledTableCell>
    </StyledTableRow>
  );
};

export default function Redeem() {
  // get params
  const { redeemItem, allocatedItemId } = useParams<{
    redeemItem: "gift" | "voucher";
    allocatedItemId: string;
  }>();

  // get allocated item
  const { data, isLoading, isSuccess, refetch } = useQuery<AllocatedItem>({
    queryKey: ["allocatedItem", allocatedItemId],
    queryFn: async () => {
      if (!allocatedItemId) {
        return;
      }
      const res = await allocateApi.getItemById(allocatedItemId);
      return res.data;
    },
  });

  const status =
    data?.status === "open"
      ? "Allocated"
      : data?.status === "rejected"
      ? "Rejected"
      : "Redeemed";

  return (
    <div className="pb-10">
      <PageHeader
        title={redeemItem === "gift" ? "Gift Redeem" : "Voucher Redeem"}
      />
      <div className="grid grid-cols-2 gap-7">
        <div className="bg-white px-5 py-7 rounded-lg shadow-md">
          <Typography variant="h6" className="!text-primary !font-semibold">
            Allocation Details
          </Typography>
          <Divider className="!mb-4 !mt-2 !bg-primary" />

          {/* loader */}
          {isLoading && <Loader dataLoading />}

          {/* error message  */}
          {isSuccess && !data && (
            <Alert severity="error">
              <Typography>Allocated Item Not Found</Typography>
            </Alert>
          )}

          {isSuccess && data && (
            <Table>
              <TableBody>
                <MyRow label="Name" value={data.cus_name} />
                <MyRow label="Phone" value={data.cus_phone} />
                <MyRow label="Email" value={data.cus_email} />

                {redeemItem === "gift" && (
                  <>
                    <MyRow label="Gift SKU" value={data.gift_sku_code} />
                    <MyRow label="Gift Type" value={data.gift_type} />
                    <MyRow label="Gift Quantity" value={data.gift_quantity} />
                  </>
                )}
                {redeemItem === "voucher" && (
                  <>
                    <MyRow label="Allocated By" value={data.allocated_by} />
                    <MyRow label="CSC" value={data.branch} />
                    <MyRow label="Voucher Code" value={data.voucher_code} />
                    <MyRow label="Voucher Amount" value={data.voucher_amount} />
                  </>
                )}

                <MyRow label="SO" value={data.so} />
                <MyRow label="Status" value={status} />
                <MyRow
                  label="Allocated At"
                  value={moment(data.created_at).format("lll")}
                />
                {data.status !== "open" && (
                  <MyRow
                    label={`${status} Date`}
                    value={moment(data.end_date).format("lll")}
                  />
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div>
          <div className="bg-white px-5 py-7 rounded-lg shadow-md sticky top-2">
            <RedeemButtons item={data} refetch={refetch} />
          </div>
        </div>
      </div>
    </div>
  );
}
