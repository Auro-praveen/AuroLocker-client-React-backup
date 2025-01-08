import React, { useEffect, useRef, useState } from "react";
import "./verifyLock.css";
import { Button } from "@mui/material";

import { useAuth } from "../GlobalFunctions/Auth";
import serverUrl from "../GlobalVariable/serverUrl.json";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";

/*

Auther Praveenkumar
  verifies the lock open status here
  verifies wheather lock is open or not within 20sec
  if lock open fails for 3 times, then there is really something wrong with the locker or contact the admin page 
  to try manual override or unconditional lock open

*/

function VerifyLockOpen() {
  const [timeLeft, setTimeLeft] = useState(20);
  var time = 20;
  const interval = useRef(null);
  const [totCount, setTotCount] = useState(0);
  const [isError, setIsError] = useState(false);
  

  const navigate = useNavigate();
  const Auth = useAuth();

  const isStrPostPaySelected = Auth.isStrPostPay;
  const verifyLockOpenObj = {
    PacketType: "wfLopenstore",
    MobileNo: Auth.userDetails.MobileNo,
    LockerNo: Auth.userSelectedLockNo,
    terminalID: Auth.userDetails.terminalID,
  };

  const onIdle = () => {
    Auth.logoutHandlerForSession();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    checkLockOpenStatus();
  }, []);

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });

  // const verifyLockUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/VerifyLockOpenStatus";

  const checkLockOpenStatus = () => {
    timeLeftFunction();

    const openLockObj = {
      ...verifyLockOpenObj,
      count: totCount,
    };

    console.log(openLockObj);
    console.log(totCount);
    fetch(serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(openLockObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "RALOP-200") {
          clearTimeIntervalFun();
          if (isStrPostPaySelected) {
            navigate("/postpay", { replace: true });
          } else {
            navigate("/success", { replace: true });
          }
          
        } else if (data.responseCode === "RELOP-201") {
          setIsError(true);
          setTotCount((totCount) => totCount + 1);
          clearTimeIntervalFun();
        } else {
          setIsError(true);
          clearTimeIntervalFun();
          setTotCount((totCount) => totCount + 1);
        }
      })
      .catch((err) => {
        console.log("errr : " + err);
        setTotCount((totCount) => totCount + 1);
      });

    // alert(count)
    // console.log("count : "+count)
  };

  const timeLeftFunction = () => {
    interval.current = setInterval(() => {
      setTimeLeft(time);
      time = time - 1;
      if (time === 0) {
        clearTimeIntervalFun();
      }
    }, 1000);
  };

  const clearTimeIntervalFun = () => {
    clearInterval(interval.current);
    setTimeLeft(0);
  };

  const closeErrorAlert = () => {
    setIsError(false);
  };

  return (
    <div className="verify-lockopen-container">
      <div className="verify-lockopen-wind">
        {totCount < 3 ? (
          <div className="container-header">
            <Collapse in={isError}>
              <Alert
                variant="standard"
                severity="error"
                onClose={() => closeErrorAlert()}
              >
                {language.VerifyingLockOpen.LockOpenFailedAlertMsg}
                {/* Lock Failed To Open Please Try Again */}
              </Alert>
            </Collapse>
            <h3>{language.VerifyingLockOpen.VerifyingLockOpenMsg}</h3>
            {/* <h3>Verifying Lock Open In</h3> */}
            <div
              className={
                timeLeft === 0 ? "time-left-wind-danger" : "time-left-wind"
              }
            >
              <h1 className="countDown-text">{timeLeft}</h1>
            </div>
            {timeLeft > 0 ? (
              <Button color="error" variant="contained" disabled fullWidth>
                {" "}
                {language.VerifyingLockOpen.Retry}
                {/* Retry */}
              </Button>
            ) : (
              <Button
                className="mui-btn-color"
                variant="contained"
                onClick={() => checkLockOpenStatus()}
                fullWidth
              >
                {" "}
                {language.VerifyingLockOpen.Retry}
                {/* Retry */}
              </Button>
            )}
          </div>
        ) : (
          <>
            <h2 className="man-override-header">
              {language.VerifyingLockOpen.SomethingAlertMsg}
              {/* Something went Wrong please contact the admin for further info */}
            </h2>
            {/* <h2 className="man-override-header">
            ಏನೋ ತಪ್ಪಾಗಿದೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ದಯವಿಟ್ಟು ನಿರ್ವಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸಿ
          </h2> */}
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyLockOpen;
