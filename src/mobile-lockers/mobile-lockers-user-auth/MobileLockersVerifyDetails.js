import React, { useEffect, useState } from "react";
import WebCamAuthentication from "./WebCamAuthentication";
import MobileLockerUserDetails from "./MobileLockerUserDetails";
import { useIdleTimer } from "react-idle-timer";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";
import { useLocation, useNavigate } from "react-router-dom";

const MobileLockersVerifyDetails = () => {

  const [openSelfiePage, setOpenSelfiePage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenSelfiePage = (openSelfie) => {

    // setOpenSelfiePage(openSelfie);
    if (openSelfie) {
      location.pathname = "/lockers/locker-payment";
      navigate(location.pathname, { replace: true })
    }



  };

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const mobileLockerAuth = useMobileLockerAuth();


  const onIdle = () => {
    mobileLockerAuth.logoutHandler();
}

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2
})



  useEffect(() => {
    const interval = setInterval(() => {
        Math.ceil(getRemainingTime() / 1000)
    }, 1000)

    return () => {
        clearInterval(interval)
    }
}, [])







  return (
    <div>
      {/* MobileLockerUserDetails */}
      {openSelfiePage ? (
        <WebCamAuthentication
          handleSwitchPage={handleOpenSelfiePage.bind(this)}
        />
      ) : (
        <MobileLockerUserDetails
          handleSwitchPage={handleOpenSelfiePage.bind(this)}
        />
      )}
    </div>
  );
};

export default MobileLockersVerifyDetails;
