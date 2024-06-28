import { BarChart } from "@mui/x-charts/BarChart";
import { useAppSelector } from "../../../hooks";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../shared/Loader";
import moment from "moment";
import { adminApi } from "../../../api/admin";
import { DatasetElementType } from "@mui/x-charts/internals";

interface QueryDataType {
  allocate_gift: number;
  allocate_voucher: number;
  branch_id: number;
  redeem_gift: number;
  redeem_voucher: number;
}

export default function GraphReport() {
  // states
  const [filter, setFilter] = useState<"today" | "7_days" | "30_days">("today");
  const [{ from_date, to_date }, setDate] = useState<{
    from_date: null | string;
    to_date: null | string;
  }>({
    from_date: moment().format("y-MM-DD"),
    to_date: moment().add(1, "days").format("y-MM-DD"),
  });
  const [data, setData] = useState<
    DatasetElementType<string | number>[] | undefined
  >([]);

  // redux
  const branches = useAppSelector((state) => state.assets.branches);
  const branchesData = branches.map((i) => i.name.slice(0, 3));

  // fetch graph report
  const {
    data: reports,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<QueryDataType[]>({
    queryKey: ["graphReport", from_date, to_date],
    queryFn: async () => {
      if (!from_date || !to_date) {
        return null;
      }

      const res = await adminApi.getGraphReport(from_date, to_date);
      return res.data;
    },
  });

  useEffect(() => {
    const arr: DatasetElementType<string | number>[] = [];

    if (Array.isArray(reports)) {
      for (const branch of branches) {
        const row = reports.find((i) => i.branch_id === parseInt(branch.id));
        if (row) {
          arr.push({
            allocate_gift: row.allocate_gift,
            allocate_voucher: row.allocate_voucher,
            redeem_gift: row.redeem_gift,
            redeem_voucher: row.redeem_voucher,
          });
        } else {
          arr.push({
            allocate_gift: 0,
            allocate_voucher: 0,
            redeem_gift: 0,
            redeem_voucher: 0,
          });
        }
      }
    }
    setData(arr);
  }, [branches, reports]);

  useEffect(() => {
    const date = {
      from_date: moment().format("y-MM-DD"),
      to_date: moment().add(1, "days").format("y-MM-DD"),
    };

    if (filter === "7_days") {
      const prevDate = moment().subtract(7, "days").format("y-MM-DD");
      date.from_date = prevDate;
    } else if (filter === "30_days") {
      const prevDate = moment().subtract(30, "days").format("y-MM-DD");
      date.from_date = prevDate;
    }

    setDate(date);
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <Typography variant="h5" className="!text-primary !font-semibold">
          Graph
        </Typography>
        <div className="flex gap-4">
          <Button
            onClick={() => refetch()}
            variant="outlined"
            className="!text-sm !py-2.5 !capitalize"
          >
            Refresh
          </Button>
          <PopupState variant="popover">
            {(popupState) => (
              <>
                <Button
                  {...bindTrigger(popupState)}
                  variant="contained"
                  className="!text-sm !py-2.5 !capitalize"
                >
                  {filter === "today"
                    ? "Today"
                    : filter === "7_days"
                    ? "Last 7 Days"
                    : "Last 30 Days"}
                </Button>
                <Menu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                >
                  <MenuItem
                    onClick={() => {
                      popupState.close();
                      setFilter("today");
                    }}
                  >
                    Today
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      popupState.close();
                      setFilter("7_days");
                    }}
                  >
                    Last 7 Days
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      popupState.close();
                      setFilter("30_days");
                    }}
                  >
                    Last 30 Days
                  </MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
        </div>
      </div>

      {/* loader */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && (
        <div className="aspect-[16/8] lg:aspect-[16/6]">
          <style>
            {`
            .css-1u0lry5-MuiChartsLegend-root {
                transform: translateY(-15px);
            }
        `}
          </style>
          <BarChart
            dataset={data}
            xAxis={[{ scaleType: "band", data: branchesData }]}
            series={[
              { dataKey: "allocate_gift", label: "Gift Allocation" },
              { dataKey: "redeem_gift", label: "Gift Redemption" },
              { dataKey: "allocate_voucher", label: "Voucher Allocation" },
              { dataKey: "redeem_voucher", label: "Voucher Redemption" },
              //   { dataKey: "approval_amount", label: "Approval Amount" },
            ]}
            sx={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
