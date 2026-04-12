import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggedInLoading, children, isLoggedIn }) {
  if (isLoggedInLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
