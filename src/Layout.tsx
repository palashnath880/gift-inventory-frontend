import { Outlet } from "react-router-dom";
import Sidebar from "./components/shared/Sidebar";
import Topbar from "./components/shared/Topbar";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { fetchMetaData } from "./features/inventory/inventorySlice";

export default function Layout() {
  // react-redux
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMetaData());
  }, []);

  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-y-auto pr-5">
            <div className="pl-5 py-5">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
