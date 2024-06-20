import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPass from "../pages/auth/ForgotPass";
import Home from "../pages/Home";
import Layout from "../Layout";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
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

export default function Routes() {
  // react-redux
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // create router
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
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
  ]);

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
