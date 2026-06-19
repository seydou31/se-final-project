import { Navigate } from "react-router-dom";

export default function AuthRedirectRoute({
  isLoggedIn,
  redirectTo,
  children,
}) {
  if (isLoggedIn) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return children;
}