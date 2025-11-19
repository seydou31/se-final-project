import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../context/AppContext";

function ProtectedRoute({ isLoggedInLoading, children, isLoggedIn }) {
  if (isLoggedInLoading) {
    return "Loading...";
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
