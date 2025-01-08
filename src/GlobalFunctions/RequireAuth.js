import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";

const RequireAuth = ({ children }) => {
  const Auth = useAuth();
  const location = useLocation();
  if (!Auth.phoneNumber || !Auth.userDetails.terminalID) {
    return (
      <Navigate
        to="/storeRetrieve"
        state={{ path: location.pathname }}
        replace={true}
      />
    );
  }
  return children;
};

export default RequireAuth;
