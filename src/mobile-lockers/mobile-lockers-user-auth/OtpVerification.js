import React, { useEffect, useState } from "react";
import GenerateOtp from "./GenerateOtp";
import VerifyOtp from "./VerifyOtp";
import YLogo from "../../logos/logo_yellow.png";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";
import { useIdleTimer } from "react-idle-timer";
import { useAuth } from "../../GlobalFunctions/Auth";
import { commonPOSTapiForMobileLockersMainServer } from "../server-connectivity/ServerAPI";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const mobileLockerAuth = useMobileLockerAuth();
  const Auth = useAuth();

  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [mobileNo, setMobileNo] = useState("");
  const [Balance, setBalance] = useState(0);
  const [isBalancePending, setIsBalancePending] = useState(false);

  const [openPaySuccessDialog, setOpenPaySuccessDialog] = useState(false);

  const [locationDidntMatch, setLocationDidntMatch] = useState(false);
  const [deviceInactive, setDeviceInactive] = useState(false);
  const [appRestart, setAppRestart] = useState(false);
  const [lockBookLimitExceed, setLockBookLimitExceed] = useState(false);

  const [invalidTerminalId, setInvalidTerminalId] = useState(false);
  const [lockersFull, setLockersFull] = useState(false);

  const [activeError, setActiveError] = useState(false);

  const [lockPaymentSuccessObj, setLockerPaymentSuccessObj] = useState({
    lockerNo: "",
    terminalID: "",
  });

  const [isLockBookedAlready, setIsLockerBookedAlread] = useState(false);

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const onIdle = () => {
    mobileLockerAuth.logoutHandler();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const handleGenerateOtp = async (generate, mobNumber, noOfMobiles) => {
    if (generate) {
      const requestObject = {
        PacketType: "stgetotp",
        LocationID: mobileLockerAuth.mobileLockersObject.locationId,
        MobileNo: mobNumber,
        lat: Auth.currentPosition.lat,
        long: Auth.currentPosition.long,
        btype: mobileLockerAuth.mobileLockersObject.browserType,
        LockerType: mobileLockerAuth.mobileLockersObject.lockerType,
        NoOfMobile: noOfMobiles,
      };

      const resp = await commonPOSTapiForMobileLockersMainServer(
        requestObject
      ).catch((err) => console.log("some error occured : " + err));

      if (resp.status !== "resp=404") {
        if (resp.responseCode === "NOTNEARTERM-201") {
          setLocationDidntMatch(true);
        } else if (resp.responseCode === "INVALIDTERMID-202") {
          setInvalidTerminalId(true);
        } else if (resp.responseCode === "GENOTP-200") {
          console.log(resp.Balance === undefined ? true : false);

          const responsePayObject = {
            orderId: resp.orderId,
            totAmount: Number(resp.totAmount),
            gstAmount: resp.GSTAmount,
            otp: resp.otp,
            Balance: resp.Balance === undefined ? "0" : resp.Balance,
          };

          if (Number(resp.Balance) > 0) {
            setBalance(Number(resp.Balance) / 100);
          }

          const lockerObject = {
            lockerNo: resp.LockerNo,
            transactionId: resp.TransactionId,
            noOfMobiles: noOfMobiles,
            terminalID: resp.terminalID,
          };

          const lockerUserObject = {
            mobileNo: mobNumber,
          };

          mobileLockerAuth.handleMobileLockerPayObject(responsePayObject);
          mobileLockerAuth.handleMobileLockersObject(lockerObject);
          mobileLockerAuth.handleMobileLockerUsers(lockerUserObject);

          setIsOtpGenerated(generate);
        } else if (resp.responseCode === "DEVINACT-201") {
          setDeviceInactive(true);
        } else if (
          resp.responseCode === "LOCKAVS-200" ||
          resp.responseCode === "PAYSTUP-201"
        ) {
          const lockerObject = {
            lockerNo: resp.LockerNo,
            terminalID: resp.TerminalID,
          };

          mobileLockerAuth.handleMobileLockersObject(lockerObject);
          mobileLockerAuth.handleMobileLockerUsers({ mobileNo: mobNumber });

          setLockerPaymentSuccessObj({
            ...lockerObject,
          });

          setIsLockerBookedAlread(true);
          setIsOtpGenerated(generate);
          // setOpenPaySuccessDialog(true)
        } else if (resp.responseCode === "LOCMAXREAC-201") {
          setLockBookLimitExceed(true);
        } else if (resp.responseCode === "LOCKFULL-200") {
          setLockersFull(true);
        } else if (
          resp.responseCode === "DBUPFAIL-201" ||
          resp.responseCode === "LOCKAVF-201"
        ) {
          setAppRestart(true);
        } else {
          setActiveError(true);
          return false;
        }
      } else {
        alert("Server Error, Please Try Again Later");
      }

      setMobileNo(mobNumber);
    } else {
      setIsOtpGenerated(generate);
    }
  };

  const verifyOtpHandler = (enteredOtp) => {
    // console.log(enteredOtp + "    "+ mobileLockerAuth.mobileLockerPayObject.otp);

    // console.log(Number(enteredOtp) === Number(mobileLockerAuth.mobileLockerPayObject.otp));

    if (
      Number(enteredOtp) === Number(mobileLockerAuth.mobileLockerPayObject.otp)
    ) {
      if (isLockBookedAlready) {
        setOpenPaySuccessDialog(true);
        return "lockavs";
      } else {
        if (Number(Balance) > 0) {
          setIsBalancePending(true);
          return "lock-balance-200";
        } else {
          return "otp-200";
        }
      }
    } else {
      return "otp-404";
    }
  };

  const balancePendingProceedClick = () => {
    setIsBalancePending(false);
    location.pathname = "/lockers/user-details";
    navigate(location.pathname, { replace: true });
  };

  const paySuccessHandler = () => {
    location.pathname = "/lockers/verify-locker-open";
    navigate(location.pathname, { replace: true });
  };

  return (
    <div className="loginPage-container">
      <div className="mobile-locker-content">
        <Stack sx={{ width: "100%" }} spacing={2}>
          {activeError && (
            <Alert
              // variant="filled"
              severity="error"
              onClose={() => setActiveError(false)}
            >
              {/* {language.LoginOTP.OTPAlert} */}
              OTP Generation Failed, Try Again Later
            </Alert>
          )}
        </Stack>

        {deviceInactive ? (
          <>
            <div className="limit-exceed">
              <div>
                <h4 className="limit-exceed-header-one">
                  {language.LoginPage.deviceInactive}
                </h4>
              </div>

              <hr />
              <div className="limit-exceed-header-two">
                <h2>{language.LoginPage.deviceInactiveDesc}</h2>
              </div>
            </div>
          </>
        ) : invalidTerminalId ? (
          <>
            <div className="limit-exceed">
              <div>
                <h4 className="limit-exceed-header-one">
                  {language.MobileLockerStorage.notValidTerminalIDHead}
                </h4>
              </div>

              <hr />
              <div className="limit-exceed-header-two">
                <h2>{language.MobileLockerStorage.notValidTerminalIDDescr}</h2>
              </div>
            </div>
          </>
        ) : locationDidntMatch ? (
          <>
            <div className="limit-exceed">
              <div>
                <h4 className="limit-exceed-header-one">
                  {language.MobileLockerStorage.invalidLocationDetectedHeader}
                </h4>
              </div>

              <hr />
              <div className="limit-exceed-header-two">
                <h2>
                  {language.MobileLockerStorage.invalidLocationDetectedDescr}
                </h2>
              </div>
            </div>
          </>
        ) : appRestart ? (
          <>
            <div className="limit-exceed">
              <div>
                <h4 className="limit-exceed-header-one">
                  {language.MobileLockerStorage.appRestartHeader}
                </h4>
              </div>

              <hr />
              <div className="limit-exceed-header-two">
                <h2>{language.MobileLockerStorage.appRestartDescription}</h2>
              </div>
            </div>
          </>
        ) : lockBookLimitExceed ? (
          <>
            <div className="limit-exceed">
              <div>
                <h4 className="limit-exceed-header-one">
                  {language.MobileLockerStorage.lockBookLimitExceedHeader}
                </h4>
              </div>

              <hr />
              <div className="limit-exceed-header-two">
                <h2>
                  {
                    language.MobileLockerStorage
                      .lockerBookingLimitExceedDescription
                  }
                </h2>
              </div>
            </div>
          </>
        ) : (
          <>
            <img
              className="logo-container"
              src={YLogo}
              alt="img"
              width={100}
              style={{ marginTop: "-5px" }}
            />
            {isOtpGenerated ? (
              <VerifyOtp
                onGenerateClick={handleGenerateOtp.bind(this)}
                mobileNo={mobileNo}
                verifyOTP={verifyOtpHandler.bind(this)}
              />
            ) : (
              <GenerateOtp
                onGenerateClick={handleGenerateOtp.bind(this)}
                lockType={mobileLockerAuth.mobileLockersObject.lockerType}
              />
            )}
          </>
        )}

        <Dialog
          open={openPaySuccessDialog}
          // TransitionComponent={Transition}
          keepMounted
          //   onClose={() => closeOpenDialog()}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Your Payment Has Been Verified"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You Have Already Made The Payment In Your Previous Transaction For
              The Locker Number : {lockPaymentSuccessObj.lockerNo} From Terminal
              : {lockPaymentSuccessObj.terminalID}. You Have Already Generated
              The Passcode Use The Same While Retrieving, you Can Also Use DOB
              For Retrieving Your Items.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => paySuccessHandler()}>Open Locker</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isBalancePending}
          // TransitionComponent={Transition}
          keepMounted
          //   onClose={() => closeOpenDialog()}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            {"Your Payment Pending From Previous Booking"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <strong>{language.Customerdetails.note}</strong>
              {language.Customerdetails.pending}
              <strong> {"Rs " + Balance + ".00"}</strong>{" "}
              {language.Customerdetails.pendingTwo}
              {language.Customerdetails.existingUserBalanceAmount}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => balancePendingProceedClick()}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={lockersFull}
          // TransitionComponent={Transition}
          keepMounted
          //   onClose={() => closeOpenDialog()}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"No Lockers Available"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Currently All Lockers Have Been Occupied, Please Try Again Later
              Some time, Or Try Using Another Terminal Id By Scanning The QR
              Code On It. Thank You.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => window.location.reload()}>Close App</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default OtpVerification;
