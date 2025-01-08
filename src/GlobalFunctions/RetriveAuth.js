import { createContext, useContext, useState } from "react";
import { useAuth } from "./Auth";

const RetriveAuthContext = createContext(null);

export const RetriveAuthProvider = ({ children }) => {

  const Auth = useAuth();
  const [MobileNo, setMobileNo] = useState("");

  const [retrieveLockSelected, setRetrieveLockSelected] = useState([]);
  // for partial lock open
  const [isPartialRetrieve, setIsPartialRetrieve] = useState(false);
  const [retriveLockContainer, setRetriveLockContainer] = useState({
    LOCKNO: [],
  });

  const [retrievePacketType, setRetrievePacketType] = useState("");

  const [CustomerName, SetCustomerName] = useState("");
  const [BalanceAmount, setBalanceAmount] = useState(0);

  const [excessUsageItems, setExcessUsageItems] = useState({
    eamount: "",
    EXHour: "",
  });

  const [postPayItem, setPostPayItems] = useState({
    amount: "",
    Hour: "",
  });

  const [postPayAndExcessUsage, setPostPayAndExcessUsage] = useState({
    amount: "",
    Hour: "",
    eamount: "",
    EXHour: "",
  });

  const retriveMobileNoHandler = (mobNo) => {
    const mobileNo = mobNo;
    setMobileNo(mobileNo);
  };

  const logoutHandler = () => {
    setMobileNo(null);
  };

  const setRetriveDet = (obj) => {
    const respObj = obj;
    console.log(respObj);
    setRetriveLockContainer({
      ...retriveLockContainer,
      // LOCKNO:respObj.LOCKNO,
      // terminalID:respObj.terminalID
      ...respObj,
    });
  };

  const CustomerNameHandler = (name) => {
    SetCustomerName(name);
  };
  //excess usage handler
  const excessUsageHandler = (obj) => {
    const myObj = obj;
    setExcessUsageItems({
      ...excessUsageItems,
      eamount: myObj.eamount,
      EXHour: myObj.EXHour,
    });
  };

  //for post pay handler
  const postPayHandler = (obj) => {
    const myObj = obj;
    setPostPayItems({
      ...postPayItem,
      amount: myObj.amount,
      Hour: myObj.Hour,
    });
  };

  const selectedLockersToRetrieve = (locks) => {
    setRetrieveLockSelected(locks);
  };

  //for post pay and excessUsage handler
  const postPayAndExcessUsageHandler = (obj) => {
    const myObj = obj;
    setPostPayAndExcessUsage({
      ...postPayAndExcessUsage,
      amount: myObj.amount,
      Hour: myObj.Hour,
      eamount: myObj.eamount,
      EXHour: myObj.EXHour,
    });
  };

  const retrievPacketTypeHandler = (packetType) => {
    setRetrievePacketType(packetType);
  };

  const sessionTimeoutLogout = () => {
    setMobileNo(null)
    Auth.logoutHandlerForSession();
  }

  // for the balance Amount

  const handleBalanceAmount = (amount) => {
    setBalanceAmount(amount);
  };

  const changePartialRetrieve = () => {
    setIsPartialRetrieve(true);
  };

  const noPartialRetrieveSelected = () => {
    setIsPartialRetrieve(false)
  }

  return (
    <RetriveAuthContext.Provider
      value={{
        MobileNo,
        retriveMobileNoHandler,
        logoutHandler,
        setRetriveDet,
        retriveLockContainer,
        excessUsageHandler,
        postPayHandler,
        postPayAndExcessUsageHandler,
        excessUsageItems,
        postPayItem,
        postPayAndExcessUsage,
        retrieveLockSelected,
        selectedLockersToRetrieve,
        CustomerNameHandler,
        CustomerName,
        handleBalanceAmount,
        BalanceAmount,
        retrievPacketTypeHandler,
        retrievePacketType,
        changePartialRetrieve,
        isPartialRetrieve,
        sessionTimeoutLogout,
        noPartialRetrieveSelected
      }}
    >
      {children}
    </RetriveAuthContext.Provider>
  );
};

export const useRetriveAuth = () => {
  return useContext(RetriveAuthContext);
};
