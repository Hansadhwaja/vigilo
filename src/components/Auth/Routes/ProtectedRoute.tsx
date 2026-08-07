import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useGetProfileQuery } from "@/store/apis/profileApi";
import Loader from "@/components/common/Loader";

const ProtectedRoute = () => {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { data, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  const profile = data?.data;

  if (profile && !profile.subscriptionStatus && location.pathname !== "/plan") {
    return <Navigate to="/plan" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
