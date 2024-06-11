import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // react-redux
  const { user } = useAppSelector((state) => state.auth);

  // if user is available
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
}
