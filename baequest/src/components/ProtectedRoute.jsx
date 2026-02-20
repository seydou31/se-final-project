import { Navigate } from "react-router-dom";
import Loading from "./Loading";

function ProtectedRoute({ isLoggedInLoading, children, isLoggedIn }) {
  if (isLoggedInLoading) {
    return <Loading fullScreen={true} message="Authenticating..." />;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
