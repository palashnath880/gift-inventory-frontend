import { Link, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "../components/shared/SearchInput";
import { allocateApi } from "../api/allocate";
import Loader from "../components/shared/Loader";
import {
  Alert,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../components/shared/MUITable";
import moment from "moment";

interface AllocatedItem {
  created_at: string;
  creator_id: string;
  cus_email: string;
  cus_phone: string;
  cus_name: string;
  customer_id: string;
  end_date: string | null;
  gift_quantity: number;
  gift_sku_code: string;
  gift_type: string;
  id: number;
  redeem_by: "otp" | "manual";
  redeem_type: "gift" | "voucher";
  so: string;
  status: "open" | "rejected" | "closed";
  voucher_amount: number;
  voucher_code: string;
}

interface AllocatedQuery {
  count: number;
  data: AllocatedItem[];
}

export default function AllocatedItems() {
  // get params
  const { allocatedItem } = useParams<{ allocatedItem: "gift" | "voucher" }>();

  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search } = {
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || "",
  };

  // fetch allocated items
  const { data, isSuccess, isLoading } = useQuery<AllocatedQuery>({
    queryKey: ["allocatedItems", page, search, allocatedItem],
    queryFn: async () => {
      const res = await allocateApi.getAllocatedItems(
        allocatedItem,
        page,
        search
      );
      return res.data;
    },
  });

  return (
    <>
      <PageHeader
        title={
          allocatedItem === "gift" ? "Allocated Gifts" : "Allocated Vouchers"
        }
      />

      <div>
        <SearchInput
          label="Search Allocated Items"
          loading={isLoading}
          value={search}
          onSubmit={(value: string) => setSearchParams({ page, search: value })}
        />
      </div>

      {/* loader */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && (
        <>
          {data?.data?.length > 0 && (
            <Table className="!mt-8">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>SO</StyledTableCell>

                  {/* for gift  */}
                  {allocatedItem === "gift" && (
                    <>
                      <StyledTableCell>Gift Quantity</StyledTableCell>
                      <StyledTableCell>Gift SKU</StyledTableCell>
                      <StyledTableCell>Gift Type</StyledTableCell>
                    </>
                  )}

                  {/* for voucher */}
                  {allocatedItem === "voucher" && (
                    <>
                      <StyledTableCell>Voucher Amount</StyledTableCell>
                      <StyledTableCell>Voucher Code</StyledTableCell>
                    </>
                  )}

                  <StyledTableCell>Allocated At</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.map((item, index) => (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>
                      <strong>{item.cus_name}</strong>
                      <Divider className="!my-1" />
                      {item.cus_phone}
                      <br />
                      {item.cus_email}
                    </StyledTableCell>
                    <StyledTableCell>{item.so}</StyledTableCell>

                    {/* gift item  */}
                    {item.redeem_type === "gift" && (
                      <>
                        <StyledTableCell>{item.gift_quantity}</StyledTableCell>
                        <StyledTableCell>{item.gift_sku_code}</StyledTableCell>
                        <StyledTableCell>{item.gift_type}</StyledTableCell>
                      </>
                    )}

                    {/* voucher item */}
                    {item.redeem_type === "voucher" && (
                      <>
                        <StyledTableCell>{item.voucher_amount}</StyledTableCell>
                        <StyledTableCell>{item.voucher_code}</StyledTableCell>
                      </>
                    )}

                    <StyledTableCell>
                      {moment(item.created_at).format("lll")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.status === "open" ? (
                        <Chip color="primary" label="Allocated" />
                      ) : item.status === "rejected" ? (
                        <Chip label="Canceled" color="error" />
                      ) : (
                        <Chip label="Redeemed" color="success" />
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.status === "open" && (
                        <span className="flex justify-end gap-2">
                          <Link to={`${item.id}/redeem`}>
                            <Button variant="contained" color="success">
                              Redeem
                            </Button>
                          </Link>
                          <Button variant="contained" color="error">
                            Cancel
                          </Button>
                        </span>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* error message */}
          {data?.data?.length <= 0 && (
            <div className="!mt-5 shadow-md">
              <Alert severity="error">No Allocated Items</Alert>
            </div>
          )}
        </>
      )}
    </>
  );
}
