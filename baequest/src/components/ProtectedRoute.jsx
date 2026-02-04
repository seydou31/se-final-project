import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../context/AppContext";
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
