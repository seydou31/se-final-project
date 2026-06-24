import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEventManagerAuth } from "../hooks/useEventManagerAuth";
import Loading from "./Loading";

export default function RequireEventManagerAuth() {
  const { loading, isAuthenticated } = useEventManagerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Loading fullScreen message="Checking authentication..." />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/event-manager/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}