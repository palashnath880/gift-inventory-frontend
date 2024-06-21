import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // react-redux
  const { user } = useAppSelector((state) => state.auth);

  // if user is not available
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
}

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // react-redux
  const { user } = useAppSelector((state) => state.auth);

  // if user is available
  if (!user?.isAdmin) {
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
};

export const EmployeeRoute = ({ children }: { children: React.ReactNode }) => {
  // react-redux
  const { user } = useAppSelector((state) => state.auth);

  // if user is admin
  if (user?.isAdmin) {
    return <Navigate to={"/admin"} replace />;
  }

  return <>{children}</>;
};
