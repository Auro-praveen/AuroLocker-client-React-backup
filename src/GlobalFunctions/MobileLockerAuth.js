import { createContext, useContext, useState } from "react";
import { useAuth } from "./Auth";

const MobileAuthContextProvider = createContext(null);

export const MobileLockerAuthProvider = ({ children }) => {
  const Auth = useAuth();

  const [mobileLockersObject, setMobileLockersObject] = useState({
    terminalID: "",
    locationId: "",
    lockerType: "",
    // lockerAmount: "",
    lockerNo: "",
    browserType: "",
    gst: "",
    noOfMobiles: "",
    transactionId: "",
  });

  const [mobileLockerPayObject, setMobileLockerPayObject] = useState({
    orderId: "",
    totAmount: "",
    otp: "",
    Balance: "",
    gstAmount: "",
  });

  const [userPhoteAuthentication, setUserPhotoAuthentication] = useState(
    "fasdfasdfasddfgswaerfg"
  );

  const [mobileLockerUser, setMobileLockerUser] = useState({
    username: "",
    userDOB: "",
    mobileNo: "",
    passcode: "",
  });

  const handleMobileLockersObject = (mobLockerObj) => {
    setMobileLockersObject({
      ...mobileLockersObject,
      ...mobLockerObj,
    });
  };

  const handleMobileLockerPayObject = (payObject) => {
    setMobileLockerPayObject({
      ...mobileLockerPayObject,
      ...payObject,
    });
  };

  const handleMobileLockerUsers = (user) => {
    setMobileLockerUser({
      ...mobileLockerUser,
      ...user,
    });
  };

  const handleUserPhotoAuthentication = async (userPhoto) => {
    setUserPhotoAuthentication(userPhoto);
  };

  const logoutHandler = () => {
    setMobileLockersObject({
      ...mobileLockersObject,
      locationId: "",
    });

    Auth.geoLocationHandler({ lat: "", long: "" });
    Auth.logoutHandlerForSession();
  };

  return (
    <MobileAuthContextProvider.Provider
      value={{
        mobileLockersObject,
        mobileLockerUser,
        handleMobileLockersObject,
        handleMobileLockerUsers,
        userPhoteAuthentication,
        handleUserPhotoAuthentication,
        logoutHandler,
        mobileLockerPayObject,
        handleMobileLockerPayObject,
      }}
    >
      {children}
    </MobileAuthContextProvider.Provider>
  );
};

export const useMobileLockerAuth = () => {
  return useContext(MobileAuthContextProvider);
};
