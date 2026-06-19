import { Navigate, useLocation } from "react-router-dom";
import Loading from "./Loading";

function ProtectedRoute({
  isLoggedInLoading,
  isLoggedIn,
  children,
}) {
  const location = useLocation();

  if (isLoggedInLoading) {
    return (
      <Loading
        fullScreen
        message="Loading please wait..."
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;