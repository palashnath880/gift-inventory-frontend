import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import Topbar from "../components/shared/Topbar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchMetaData } from "../features/inventory/inventorySlice";
import { Toaster } from "react-hot-toast";
import { fetchRoles } from "../features/employee-role/employeeRoleSlice";
import { fetchVouchers } from "../features/voucher/voucherSlice";
import { fetchAssets } from "../features/admin/adminSlice";

export default function Layout() {
  // react-redux
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.isAdmin) {
      dispatch(fetchRoles());
      dispatch(fetchVouchers());
      dispatch(fetchAssets());
    } else {
      dispatch(fetchMetaData());
    }
  }, [user]);

  return (
    <>
      <div className="w-screen h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {!user?.isAdmin && <Topbar />}

          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-y-auto pr-5">
              <div className="pl-5 py-5">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* toaster */}
      <style>
        {`
        .myToast div {
          justify-content: left !important;
          font-size: 0.85rem !important;
        }
        `}
      </style>
      <Toaster
        containerClassName="toastContainer"
        position="top-right"
        toastOptions={{
          success: {
            icon: null,
            duration: 3000,
            className:
              "!bg-primary !rounded-md !min-w-[200px] !text-white !justify-left myToast",
          },
          error: {
            icon: null,
            duration: 3000,
            className:
              "!bg-red-500 !rounded-md !min-w-[200px] !text-white !justify-left myToast",
          },
        }}
      />
    </>
  );
}
