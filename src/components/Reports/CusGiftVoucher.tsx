import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { customerApi } from "../../api/customer";
import ReportDateForm from "../shared/ReportDateForm";
import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { downloadExcel } from "../../utility/utility";
import Loader from "../shared/Loader";

export default function CusGiftVoucher({
  customerId,
}: {
  customerId: string | undefined;
}) {
  // search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, from_date, to_date } = {
    page: searchParams.get("page") || "1",
    from_date: searchParams.get("from_date") || "",
    to_date: searchParams.get("to_date") || "",
  };

  // react-query
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["giftVoucherReport", page, from_date, to_date],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return { count: 0, reports: [] };
      }

      const addOneDay = moment(to_date).add(1, "days").format("y-MM-DD");
      const res = await customerApi.getGiftVoucherReport(
        page,
        from_date,
        addOneDay
      );
      return res.data;
    },
  });

  return (
    <>
      <div className="flex justify-between items-center gap-5">
        <ReportDateForm
          loading={isLoading}
          values={{ fromDate: from_date, toDate: to_date }}
          onSearch={(from_date, to_date) =>
            setSearchParams({ from_date, to_date, page: "1" })
          }
        />

        <Button
          variant="contained"
          startIcon={<Download />}
          className="!px-7 !text-sm !normal-case !py-3"
          disabled={Boolean(data?.data && data?.data?.length <= 0)}
          onClick={() =>
            downloadExcel("giftVoucherReport", "Gift Voucher Report")
          }
        >
          Export as Excel
        </Button>
      </div>

      {/* loading */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && from_date && to_date && <>{/* {data?.} */}</>}
    </>
  );
}
