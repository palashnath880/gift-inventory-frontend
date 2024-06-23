import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  // react-redux
  const { user } = useAppSelector((state) => state.auth);

  // if user is admin available
  if (user && user?.isAdmin) {
    return <Navigate to={"/admin"} replace />;
  }

  // if user is available
  if (user && !user?.isAdmin) {
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
}
