import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPass from "../pages/auth/ForgotPass";
import Home from "../pages/Home";
import Layout from "../layouts/Layout";
import AuthRoute from "./AuthRoute";
import ProtectedRoute, { AdminRoute, EmployeeRoute } from "./ProtectedRoute";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loader from "../components/shared/Loader";
import { useEffect } from "react";
import { loadingOff, verifyUser } from "../features/auth/authSlice";
import CreateCustomer from "../pages/customers/CreateCustomer";
import Customers from "../pages/customers/Customers";
import Allocate from "../pages/customers/Allocate";
import Redeem from "../pages/Redeem";
import Gallery from "../pages/Gallery";
import CSATPolicy from "../pages/CSATPolicy";
import GiftStock from "../pages/gift/GiftStock";
import GiftTransfer from "../pages/gift/GiftTransfer";
import GiftReceive from "../pages/gift/GiftReceive";
import MyApproval from "../pages/approval/MyApproval";
import ReceiveApproval from "../pages/approval/ReceiveApproval";
import AllocatedItems from "../pages/AllocatedItems";
import Cookies from "js-cookie";
import GiftReceiveReport from "../pages/gift/GiftReceiveReport";
import ApprovalRedeem from "../pages/approval/ApprovalRedeem";
import CustomerReport from "../pages/customers/CustomerReport";
import CustomersReport from "../pages/reports/CustomersReport";
import { Admin } from "../pages/admin";
import AllocationReport from "../pages/reports/AllocationReport";
import RedemptionReport from "../pages/reports/RedemptionReport";
import ApprovalReport from "../pages/reports/ApprovalReport";
import Employees from "../pages/reports/Employees";
import EmployeeReport from "../pages/reports/EmployeeReport";
import NotFound from "../pages/NotFound";

export default function Routes() {
  // react-redux
  const { loading, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // employee router
  const employeeRoutes = [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <EmployeeRoute>
            <Layout />
          </EmployeeRoute>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "create-customer",
          element: <CreateCustomer />,
        },
        {
          path: "customers",
          element: <Customers />,
        },
        {
          path: "customers/:customerId/report",
          element: <CustomerReport />,
        },
        {
          path: "customers/:customerId/report/:reportType",
          element: <CustomerReport />,
        },
        {
          path: "customers/allocate/:customerId/:allocateItem",
          element: <Allocate />,
        },
        {
          path: "allocated/:allocatedItem",
          element: <AllocatedItems />,
        },
        {
          path: "allocated/:redeemItem/:allocatedItemId/redeem",
          element: <Redeem />,
        },
        {
          path: "gift-stock",
          element: <GiftStock />,
        },
        {
          path: "gift-transfer",
          element: <GiftTransfer />,
        },
        {
          path: "gift-receive",
          element: <GiftReceive />,
        },
        {
          path: "gift-receive/report",
          element: <GiftReceiveReport />,
        },
        {
          path: "my-approval",
          element: <MyApproval />,
        },
        {
          path: "my-approval/:approvalId/redeem",
          element: <ApprovalRedeem />,
        },
        {
          path: "receive-approval",
          element: <ReceiveApproval />,
        },
        {
          path: "csat-policy",
          element: <CSATPolicy />,
        },
        {
          path: "gallery",
          element: <Gallery />,
        },
        {
          path: "customers-report",
          element: <CustomersReport />,
        },
        {
          path: "allocation-report",
          element: <AllocationReport />,
        },
        {
          path: "redemption-report",
          element: <RedemptionReport />,
        },
        {
          path: "approval-report",
          element: <ApprovalReport />,
        },
        {
          path: "employee-report",
          element: <Employees />,
        },
        {
          path: "employee-report/:employeeId/:reportFor?",
          element: <EmployeeReport />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <AuthRoute>
          <Login />
        </AuthRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <AuthRoute>
          <ForgotPass />
        </AuthRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  const adminRoutes = [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AdminRoute>
            <Layout />
          </AdminRoute>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Admin.Home />,
        },
        {
          path: "employees",
          element: <Admin.Employees />,
        },
        {
          path: "gift-sku-code",
          element: <Admin.GiftSKUCode />,
        },
        {
          path: "own-stock",
          element: <Admin.Stock />,
        },
        {
          path: "stock-entry",
          element: <Admin.StockEntry />,
        },
        {
          path: "stock-transfer",
          element: <Admin.StockTransfer />,
        },
        {
          path: "branch-stock",
          element: <Admin.BranchStock />,
        },
        {
          path: "reports/branch",
          element: <Admin.BranchReport />,
        },
        {
          path: "reports/customer",
          element: <Admin.Customers />,
        },
        {
          path: "reports/customer/:customerId/:reportType?",
          element: <Admin.CustomerReport />,
        },
        {
          path: "reports/allocation",
          element: <Admin.AllocationReport />,
        },
        {
          path: "reports/redemption",
          element: <Admin.RedemptionReport />,
        },
        {
          path: "reports/employee",
          element: <Admin.EmployeeReport />,
        },
        {
          path: "stock",
          element: <Admin.Stock />,
        },
        {
          path: "stock/entry",
          element: <Admin.StockEntry />,
        },
        {
          path: "stock/transfer",
          element: <Admin.StockTransfer />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  const routes = user?.isAdmin ? adminRoutes : employeeRoutes;
  const router = createBrowserRouter(routes);

  useEffect(() => {
    if (Cookies.get("auth_token")) {
      dispatch(verifyUser());
    } else {
      dispatch(loadingOff());
    }
  }, []);

  // loader
  if (loading) {
    return <Loader />;
  }

  return <RouterProvider router={router} />;
}
