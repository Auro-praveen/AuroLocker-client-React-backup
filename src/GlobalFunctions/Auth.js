import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [occupiedLocks, setOccupiedLocks] = useState([]);
  const [currentPosition, SetCurrentPosition] = useState({
    lat: "",
    long: ""
  });

  const [subscriptionType, setSubscriptionType] = useState("")

  const [isStrPostPay, setIsStrPostPay] = useState(false);
  
  // const [paymentSuccessTransit, setPaymentSuccessTransit] = useState({
  //   MobileNo:"",
  //   LockerNo:"",
  //   terminalID:""
  // })

  const [userSelectedLockNo, setUserSelectedLockNo] = useState("");

  const [existingUserBalanceAmount, setExistingUserBalanceAmount] = useState(null);

  const [passcode, setPasscode] = useState("");
  const [seatBookCount, setSeatBookCount] = useState(0)

  const [userDetails, setUserDetails] = useState({
    MobileNo: "",
    terminalID: "",
    TransactionId: "",
    itemstored:"",
    userName: "",
    AvailableLocker: [],
    dob: "",
    hours: [],
    GSTAmount:"",
    smallLockPriceMinute: "",
    mediumLockPriceMinute: "",
    largeLockPriceMinute: "",
    extraLargePriceMinute: "",
    smallLockPriceHours: [],
    largeLockPriceHours: [],
    mediumLockPriceHours: [],
    extraLargePriceHours: [],
  });

  // for counting the seat books
  const seatCountFun = (count) => {
    const totCount = seatBookCount+count;
    // alert("total count : "+totCount)
    setSeatBookCount(totCount);
  }

  const loginHandler = (val) => {
    setPhoneNumber(val);
  };

  const passcodeHandler = (val) => {
    setPasscode(val);
  }

  const logoutHandlerForSession = () => {
    setPhoneNumber(null)
    setUserDetails({})
  }


  const storePostPayHandler = () => {
    setIsStrPostPay(true)
  }



  // const paymentSuccessTransitHandler = (obj) => {
  //   setPaymentSuccessTransit({
  //     LockerNo:obj.lockno,
  //     MobileNo:obj.mobileno,
  //     terminalID:obj.terminalid
  //   })
  // }

  const handleExistingUserBalanceAmount = (amount) => {
    setExistingUserBalanceAmount(amount)
  }

  const subscritionTypeHandler = (type ) => {
    setSubscriptionType(type);
  }

  const logoutHandler = () => {
    // setOccupiedLocks([]);
    // setPhoneNumber(null);
    window.location.reload();
  };

  const existingUserHandler = (obj) => {
    setUserDetails({
      ...userDetails,
      ...obj,
    });

    // console.log("=======Auth======");
    // console.log(userDetails.GSTAmount);
  };

  const geoLocationHandler = (obj) => {
    SetCurrentPosition({
      ...currentPosition,
      lat: obj.lat,
      long:obj.long
    })
  }

  const busyLockerFunction = (lockName) => {
    // if (occupiedLocks !== null) {
    //   const locks = [...occupiedLocks, ...lockName];
    //   setOccupiedLocks(locks);
    // } else {
      
    // }
    setOccupiedLocks(arr => [...arr, lockName]);
  };

  const userSelectedLockHandler = (lock) => {
    const lockName = lock;
    console.log(lockName)
    setUserSelectedLockNo(lockName)
  }

  return (
    <AuthContext.Provider
      value={{
        loginHandler,
        logoutHandler,
        phoneNumber,
        existingUserHandler,
        userDetails,
        busyLockerFunction,
        occupiedLocks,
        currentPosition,
        geoLocationHandler,
        seatBookCount,
        seatCountFun,
        passcode,
        passcodeHandler,
        userSelectedLockHandler,
        userSelectedLockNo,
        existingUserBalanceAmount,
        logoutHandlerForSession,
        handleExistingUserBalanceAmount,
        storePostPayHandler,
        isStrPostPay,
        subscriptionType,
        subscritionTypeHandler
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
