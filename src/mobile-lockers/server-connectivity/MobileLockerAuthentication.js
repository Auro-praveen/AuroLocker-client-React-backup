import { Navigate, useLocation } from "react-router-dom";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";



const MobileLockerAuthentication = ({ children }) => {
    const Auth = useMobileLockerAuth();
    const location = useLocation()
    if (!Auth.mobileLockersObject.locationId) {
        return (<Navigate to='/storeRetrieve' state={{ path: location.pathname }} replace={true} />)
    }
    return children;
}



export default MobileLockerAuthentication;


