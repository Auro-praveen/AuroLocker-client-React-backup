import React, { useEffect, useRef, useState } from "react";
import YLogo from "../../logos/logo_yellow.png";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { commonPOSTapiForMobileLockersMainServer } from "../server-connectivity/ServerAPI";
import "./templeLockerConfirmation.css";
import { useIdleTimer } from "react-idle-timer";
import { useLocation, useNavigate } from "react-router-dom";

const LockerOpenVerification = () => {
  const mobileLockerAuth = useMobileLockerAuth();

  const [lockerDescriptinObject, setLockerDescriptionObject] = useState({
    PacketType: "wfLopenstore",
    LockerNo: mobileLockerAuth.mobileLockersObject.lockerNo,
    lockerType: mobileLockerAuth.mobileLockersObject.lockerType,
    LocationID: mobileLockerAuth.mobileLockersObject.locationId,
    terminalID: mobileLockerAuth.mobileLockersObject.terminalID,
    MobileNo: mobileLockerAuth.mobileLockerUser.mobileNo,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [lockerOpenRequestCount, setLockerOpenRequestCount] = useState(0);
  const [timeCount, setTimeCount] = useState(15);
  const count = useRef();
  const [openErrorAlert, setOpenErrorAlert] = useState(false);

  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const onIdle = () => {
    mobileLockerAuth.logoutHandler();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (count.current !== null) {
      clearInterval(count.current);
      setTimeCount(15);
    }

    verifyLockerOpen();
  }, []);

  const closeOpenDialog = () => {
    setOpenInfoDialog(false);
  };

  const verifyLockerOpen = async () => {
    loadLockOpenTimeCount();

    const verifyLockOpenObj = {
      ...lockerDescriptinObject,
      count: lockerOpenRequestCount,
    };

    const resp = await commonPOSTapiForMobileLockersMainServer(
      verifyLockOpenObj
    ).catch((err) => {
      clearTimeIntervalFun();
      console.log("error occured is : " + err);
    });

    if (resp.status === "resp-200") {
      if (resp.responseCode === "RALOP-200") {
        clearTimeIntervalFun();
        location.pathname = "/lockers/booking-confirm";
        navigate(location.pathname, { replace: true });
      } else {
        setOpenErrorAlert(true);
        clearTimeIntervalFun();
      }
    } else {
      clearTimeIntervalFun();
      setOpenErrorAlert(true);
    }
  };

  const loadLockOpenTimeCount = () => {
    setLockerOpenRequestCount((count) => count + 1);

    count.current = setInterval(() => {
      setTimeCount((prevVal) => {
        console.log(prevVal);
        if (prevVal <= 0) {
          clearTimeIntervalFun();

          if (lockerOpenRequestCount > 1) {
            setOpenInfoDialog(true);
          }

          return 0;
        } else {
          return prevVal - 1;
        }
      });
    }, 1000);
  };

  const clearTimeIntervalFun = () => {
    setTimeCount(0);
    clearInterval(count.current);
  };

  const closeAllAlerts = () => {
    setOpenErrorAlert(false);
  };

  const handleLockeropenOperantion = () => {
    setTimeCount(15);
    verifyLockerOpen();
  };

  return (
    <div className="loginPage-container">
      <div className="mobile-locker-content">
        <Snackbar
          open={openErrorAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={6000}
          onClose={closeAllAlerts}
        >
          <Alert
            onClose={closeAllAlerts}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Something Went Wrong Please Try Again!
          </Alert>
        </Snackbar>

        <img
          className="logo-container"
          src={YLogo}
          alt="img"
          width={100}
          style={{ marginTop: "-5px" }}
        />

        <hr />

        <h2 className="mobile-locker-header">Verify Locker Open</h2>

        <div className="verifyLocker-open-container">
          <h6>
            Your Locker Number{" "}
            <b style={{ color: "red" }}>{lockerDescriptinObject.LockerNo}</b>{" "}
            from location Id{" "}
            <b style={{ color: "red" }}>{lockerDescriptinObject.LocationID}</b>{" "}
            And terminal Id{" "}
            <b style={{ color: "red" }}>{lockerDescriptinObject.terminalID}</b>{" "}
            will be opening in ....
          </h6>

          <div className="mobile-locker-countdown">
            <h2
              style={{
                fontWeight: "600",
                color: "#1E367B",
                fontSize: "45px",
                marginTop: "5px",
              }}
            >
              <b>{timeCount}</b>
            </h2>
          </div>
        </div>

        <div className="mob-lock-btn-container">
          {timeCount < 1 ? (
            <Button
              variant="contained"
              className={"mob-locker-btn"}
              onClick={() => handleLockeropenOperantion()}
              fullWidth
            >
              Open Locker
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled
              fullWidth
              sx={{
                mb: 2,
              }}
            >
              Locker Opening
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={openInfoDialog}
        // TransitionComponent={Transition}
        keepMounted
        // onClose={() => closeOpenDialog()}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            textAlign: "center",
            color: "#1E367B",
            backgroundColor: "#df8549",
          }}
        >
          <b>{"Failed To Open Locker"}</b>
        </DialogTitle>
        <DialogContent>
          <div className="temple-lockers-paysuccess">
            <img
              src={"/logos/lockerfailed2.png"}
              alt="payment-success"
              width={180}
              height={150}
            />
            <h6
              style={{
                color: "crimson",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Something Went Wrong And Failed To Open The locker, Please Contact
              The Admin or Try Again
            </h6>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={() => closeOpenDialog()}
          >
            Close
          </Button>
          {/* <Button onClick={() => closeOpenDialog()}>Re-Enter Passcode</Button>
                    <Button onClick={() => ProceedToVerifyDetails()}>Proceed</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LockerOpenVerification;
