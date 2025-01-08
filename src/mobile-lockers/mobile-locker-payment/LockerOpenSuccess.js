import React, { useEffect } from "react";
import "./templeLockerConfirmation.css";
import YLogo from "../../logos/logo_blue.png";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";
import { Button } from "@mui/material";
import { useIdleTimer } from "react-idle-timer";

const LockerOpenSuccess = () => {
  const MobileLockerAuth = useMobileLockerAuth();

  const lockerOpenObject = {
    userName: MobileLockerAuth.mobileLockerUser.username,
    terminalId: MobileLockerAuth.mobileLockersObject.terminalID,
    locationId: MobileLockerAuth.mobileLockersObject.locationId,
    lockerNo: MobileLockerAuth.mobileLockersObject.lockerNo,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const onIdle = () => {
    MobileLockerAuth.logoutHandler();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  return (
    <div className="loginPage-container">
      <div className="mobile-locker-content">
        <div className="mobilelocker-bookingSuccess-container">
          <img
            className="logo-container"
            src={YLogo}
            alt="img"
            width={120}
            style={{ marginTop: "-15px" }}
          />
        </div>

        {/* <hr /> */}

        <div className="mobileLocker-success-continer">
          <h2 className="mobile-locker-header"> Locker Booking Success </h2>

          <img
            src={"/logos/locker-open3.png"}
            alt="payment-success"
            width={180}
            height={150}
          />

          <h6
            style={{ color: "#1E367B", textAlign: "center", marginTop: "20px" }}
          >
            Thank you For Using Tuckit.in Locker Services
          </h6>

          <h6
            style={{ color: "green", textAlign: "center", marginTop: "20px" }}
          >
            Locker No :{" "}
            <b style={{ color: "red" }}>{lockerOpenObject.lockerNo}</b> In
            Terminal Id :{" "}
            <b style={{ color: "red" }}>{lockerOpenObject.terminalId}</b> Is
            Open. Now You Can Store The Items And Retrieve Using Our Device
            Later
          </h6>
        </div>

        <div className="mob-lock-btn-container">
          <Button
            variant="contained"
            className={"mob-locker-btn"}
            // onClick={() => handleLockeropenOperantion()}
            onClick={() => MobileLockerAuth.logoutHandler()}
            fullWidth
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LockerOpenSuccess;
