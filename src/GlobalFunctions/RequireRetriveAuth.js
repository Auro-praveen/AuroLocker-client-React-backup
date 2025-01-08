import { Navigate, useLocation } from "react-router-dom";
import { useRetriveAuth } from "./RetriveAuth";

const RequireRetriveAuth = ({children}) => {
    const RetriveAuth = useRetriveAuth()
    const location = useLocation()
    if (!RetriveAuth.MobileNo) {
        return (<Navigate to='/storeRetrieve' state={{path:location.pathname}} replace={true} />)
    }
    return children;
}

export default RequireRetriveAuth;