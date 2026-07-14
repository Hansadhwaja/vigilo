import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const GuestRoute = () => {
  const { token } = useAppSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
