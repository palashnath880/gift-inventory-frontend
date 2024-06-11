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
import { verifyUser } from "../features/auth/authSlice";
import CreateCustomer from "../pages/CreateCustomer";
import Customers from "../pages/Customers";
import Allocate from "../pages/Allocate";
import Redeem from "../pages/Redeem";
import Gallery from "../pages/Gallery";

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
          path: "customers/allocate/:customerId/:allocateItem",
          element: <Allocate />,
        },
        {
          path: "redeem/:redeemItem",
          element: <Redeem />,
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
    dispatch(verifyUser());
  }, []);

  // loader
  if (loading) {
    return <Loader />;
  }

  return <RouterProvider router={router} />;
}
