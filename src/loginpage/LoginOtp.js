import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../GlobalFunctions/Auth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Button from "@mui/material/Button";
// import { Link } from "react-router-dom";
import serverUrl from "../GlobalVariable/serverUrl.json";
import ThumbsDownIcon from "@mui/icons-material/ThumbDown";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { Link } from "react-router-dom";
import YLogo from "../logos/logo_yellow.png";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import VerifyLockOpen from "../verifyLockOpen/VerifyLockOpen";
import PinIcon from "@mui/icons-material/Pin";
import VpnKeyOffIcon from "@mui/icons-material/VpnKeyOff";
import RecommendIcon from "@mui/icons-material/Recommend";
import AppFiles from "../GlobalVariable/otherImp.json";

/*
  @Auther :- Praveen
  TODO :: Verifying otp for login purpose 
    Implemented Whatsapp Otp Verification For Mall and Extending time of otp incase of whatsapp verification for Whatsapp

    27/10/2023  Praveen
    Removed Whatsapp Otp Verification 

*/
function LoginOtp() {
  const Auth = useAuth();

  const [enteredOtp, setEnteredOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    Auth.userDetails.terminalID === "G2112" ? 90 : 60
  ); // time counter
  // const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const clientRequest = {
    terminalID: Auth.userDetails.terminalID,
    // currentTime: "",
    MobileNo: Auth.phoneNumber,
  };

  // const testValue = 3393939;

  const [activeError, setActiveError] = useState(false);
  const [activeSuccess, setActiveSuccess] = useState(false);
  const [activeInfo, setActiveInfo] = useState(false);

  const [lockersFull, setLockersFull] = useState(false);
  const [lockerTimeOver, setLockerTimeOver] = useState(false);

  useEffect(() => {
    countDownTime();

    // if (!Auth.publicFileRead) {
    //   Auth.fetchFromFileLocalPublicFile();
    // }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });

  const navigate = useNavigate();
  const location = useLocation();
  // const redirectPath = location.pathname?.path || "/exitstingUserAuth";

  const getCurrentTimeFun = () => {
    const date = new Date();
    console.log(
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    );
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  // const alertInterval = useRef();
  // var alertTime = 3;

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  // const verifyOtpUrl = "http://192.168.0.198:8080/AuroAutoLocker/ConfirmOtp";
  // const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";
  // time limit for otp

  var time = Auth.userDetails.terminalID === "G2112" ? 90 : 60;
  // var time = 60 ;
  // var interval;
  const interval = useRef();
  // for the countDown of Time to get otp
  const countDownTime = () => {
    interval.current = setInterval(() => {
      time = time - 1;
      // console.log(time);
      if (time < 0) {
        // setTime(30)
        clearIntervalFun();
      } else {
        setTimeLeft(time);
      }
    }, 1000);
  };

  const clearIntervalFun = () => {
    clearInterval(interval.current);
    setTimeLeft(0);
  };

  const verifyOtpFunction = (e) => {
    e.preventDefault();
    const afterEnteredOtpData = {
      ...clientRequest,
      otp: enteredOtp,
      PacketType: "stverotp",
      time: getCurrentTimeFun(),
    };

    // console.log(afterEnteredOtpData)

    if (enteredOtp.length === 4) {
      setIsLoading(true);
      fetch(/* verifyOtpUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(afterEnteredOtpData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("from databases : ");
          console.log(data);

          // prk changed here august 27 2024

          if (data.responseCode === "VEROTPN-200") {
            setActiveSuccess(true);
            respnseHandlerFun(data);
            navigate("/userAuth", { replace: true });
          } else if (data.responseCode === "VEROTPE-200") {
            respnseHandlerFun(data);
            clearIntervalFun();
            navigate("/exitstingUserAuth", { replace: true });
          } else if (data.responseCode === "VEROTPEB-200") {
            Auth.handleExistingUserBalanceAmount(
              Number(Math.round(data.Balance / 100))
            );
            respnseHandlerFun(data);
            clearIntervalFun();
            navigate("/exitstingUserAuth", { replace: true });
          } else if (data.responseCode === "VEROTPW-203") {
            setActiveError(true);
            // clearIntervalFun();
          } else if (data.responseCode === "STRANPCNF-200") {
            const respObj = {
              MobileNo: data.MobileNo,
              terminalID: data.terminalID,
            };
            Auth.userSelectedLockHandler(data.LockerNo);
            Auth.existingUserHandler(respObj);
            navigate("/verOpenLock", { replace: true });
          } else if (data.responseCode === "LOCKERFULL-200") {
            setLockersFull(true);
          } else if (data.responseCode === "SERTIMEOVER-200") {
            setLockerTimeOver(true);
          } else {
            setActiveError(true);
            // clearIntervalFun();
          }
          Auth.subscritionTypeHandler(data.Subscriptiontype);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err " + err);
        });
    } else {
      setActiveInfo(true);
    }
  };

  const respnseHandlerFun = (data) => {
    Auth.loginHandler(clientRequest.MobileNo);

    let smallLockAmnt;
    let mediumLockAmnt;
    let largeLockAmnt;
    let extraLargeAmnt;

    if (data.Small) {
      if (AppFiles.priceInPaise) {
        smallLockAmnt = data.Small.map((amount) => amount / 100);
      } else {
        smallLockAmnt = data.Small;
      }
    } else {
      smallLockAmnt = [0, 0, 0];
    }

    if (data.Medium) {
      if (AppFiles.priceInPaise) {
        mediumLockAmnt = data.Medium.map((amount) => amount / 100);
      } else {
        mediumLockAmnt = data.Medium;
      }
    } else {
      mediumLockAmnt = [0, 0, 0];
    }

    if (data.Large) {
      if (AppFiles.priceInPaise) {
        largeLockAmnt = data.Large.map((amount) => amount / 100);
      } else {
        largeLockAmnt = data.Large;
      }
    } else {
      largeLockAmnt = [0, 0, 0];
    }

    if (data.eLarge) {
      if (AppFiles.priceInPaise) {
        extraLargeAmnt = data.eLarge.map((amount) => amount / 100);
      } else {
        extraLargeAmnt = data.eLarge;
      }
    } else {
      extraLargeAmnt = [0, 0, 0];
    }

    const existingUSerDetails = {
      MobileNo: clientRequest.MobileNo,
      TransactionId: data.TransactionId,
      userName: data.cname,
      AvailableLocker: data.AvailableLocker,
      dob: data.dob,
      hours: data.hourslot,
      GSTAmount: data.GSTAmount,
      smallLockPriceMinute: smallLockAmnt[0],
      mediumLockPriceMinute: mediumLockAmnt[0],
      largeLockPriceMinute: largeLockAmnt[0],
      extraLargePriceMinute: extraLargeAmnt[0],
      smallLockPriceHours: smallLockAmnt.slice(1), //first element in the array is for minute so assigning that to minute side we slice here that amount and take remaining
      largeLockPriceHours: largeLockAmnt.slice(1),
      mediumLockPriceHours: mediumLockAmnt.slice(1),
      extraLargePriceHours: extraLargeAmnt.slice(1),
    };

    console.log("----details here -----");
    console.log(existingUSerDetails);

    Auth.existingUserHandler(existingUSerDetails);
  };

  const resendOtpFun = (e) => {
    setTimeLeft(60);
    e.preventDefault();
    setEnteredOtp("");
    navigate("/login");
    clearIntervalFun();
  };

  const otpHandlerEvent = (e) => {
    if (e.target.value.length < 5) {
      setEnteredOtp(e.target.value);
    }
  };

  // const hideAlertWindow = (value) => {
  //   alertInterval.current = setInterval(() => {
  //     alertTime = alertTime - 1;
  //     console.log(value+"  "+alertTime)
  //     if (alertTime < 0) {
  //       if (value === "error") {
  //         setActiveError(false);

  //       } else if (value === "success") {
  //         setActiveSuccess(false);

  //       } else if (value === "info") {
  //         setActiveInfo(false);

  //       } else {
  //         setActiveError(false);
  //         setActiveSuccess(false);

  //       }
  //       clearAlertIntervalFun();
  //     }
  //   }, 1000);
  // };

  // const clearAlertIntervalFun = () => {
  //   clearInterval(alertInterval.current);
  // }

  // if (activeError) {
  //   hideAlertWindow("error");
  // } else if (activeSuccess) {
  //   hideAlertWindow("success");
  // } else if (activeInfo) {
  //   hideAlertWindow("info");
  // }

  const hideErrorAlert = () => {
    setActiveError(false);
    // hideAlertWindow("error");
  };
  const hideSuccessAlert = () => {
    setActiveSuccess(false);
    // hideAlertWindow("success");
  };

  const hideInfoAlert = () => {
    setActiveInfo(false);
    // hideAlertWindow("info");
  };

  return (
    <div className="otp-page-container">
      {lockersFull ? (
        <>
          <div className="limit-exceed">
            <div className="limit-exceed-header-one">
              <h4>{language.AdditionalAlerts.lockersFullTitle}</h4>
            </div>

            <div className="limit-exceed-header-two">
              <h2>{language.AdditionalAlerts.lockersFullDesc}</h2>
            </div>

            <Link to="/storeRetrieve">
              <Button variant="contained" color="primary">
                {language.AdditionalAlerts.lockersFullBtn}
              </Button>
            </Link>
          </div>
        </>
      ) : lockerTimeOver ? (
        <>
          <div className="limit-exceed">
            <div className="limit-exceed-header-one">
              <h4>{language.AdditionalAlerts.lockersTimeLimitTitle}</h4>
            </div>

            <div className="limit-exceed-header-two">
              <h2>{language.AdditionalAlerts.lockersTimeLimitDesc1}</h2>
            </div>

            <Link to="/storeRetrieve">
              <Button variant="contained" color="primary">
                {language.AdditionalAlerts.lockersFullBtn}
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="otp-form-container">
          <img className="logo-container" src={YLogo} alt="logo" width={100} />
          {/* <div className="welcomepage-logo-container-others">
              <img
                className="welcome-page-logo-others"
                src={YLogo}
                alt="img"
                width={160}
              />
            </div> */}
          <Stack sx={{ width: "100%" }} spacing={2}>
            {activeError && (
              <Alert
                variant="filled"
                severity="error"
                onClose={() => hideErrorAlert()}
              >
                {language.LoginOTP.OTPAlert}
                {/* OTP did not match */}
              </Alert>
            )}

            {activeSuccess && (
              <Alert
                variant="filled"
                severity="success"
                onClose={() => hideSuccessAlert()}
              >
                otp verified
              </Alert>
            )}

            {activeInfo && (
              <Alert
                variant="filled"
                severity="info"
                onClose={() => hideInfoAlert()}
              >
                {language.LoginOTP.ValidOTPAlert}
                {/* Please Enter Valid OTP */}
              </Alert>
            )}
          </Stack>
          <Box
            component="form"
            // sx={{
            //   // "& .MuiTextField-root": { m: 1, width: "30ch" },
            //   "& .MuiTextField-root": { m: 1 },
            // }}
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
          >
            <div className=" form-container">
              <div>
                <h5 className="otp-header">{language.LoginOTP.otpTitle}</h5>
                <div
                  className={
                    timeLeft > 0
                      ? "time-countdown-container"
                      : "time-countdown-container-timeout"
                  }
                >
                  <h1 className="otp-countdown">{timeLeft}</h1>{" "}
                </div>
              </div>
              <div className="form-container">
                <TextField
                  label={language.LoginOTP.otpTxt}
                  type="number"
                  name="otp"
                  variant="outlined"
                  color="warning"
                  value={enteredOtp}
                  onChange={(e) => otpHandlerEvent(e)}
                  fullWidth
                  focused
                />
              </div>
              <div>
                <Button
                  variant="text"
                  color="primary"
                  onClick={(e) => resendOtpFun(e)}
                  sx={{
                    marginTop: "-10px",
                  }}
                >
                  {" "}
                  {language.LoginOTP.resendOTP}{" "}
                </Button>
              </div>
              <div className="form-container">
                {timeLeft > 0 ? (
                  isLoading ? (
                    <div className="btn-container">
                      <LoadingButton
                        loading
                        loadingPosition="end"
                        endIcon={<SaveIcon />}
                        variant="contained"
                        fullWidth
                      >
                        verifying otp..
                      </LoadingButton>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      className="mui-btn-color"
                      type="button"
                      endIcon={<RecommendIcon />}
                      onClick={(e) => verifyOtpFunction(e)}
                      size="large"
                      fullWidth
                    >
                      {language.LoginOTP.otpConfirmBtn} &nbsp;&nbsp;&nbsp;
                    </Button>
                  )
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    endIcon={<VpnKeyOffIcon />}
                    disabled
                    fullWidth
                  >
                    {language.LoginOTP.timeup}&nbsp;&nbsp;&nbsp;
                    {/* time up &nbsp;&nbsp;&nbsp; */}
                  </Button>
                )}
              </div>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
}

export default LoginOtp;
