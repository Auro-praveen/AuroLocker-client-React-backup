import React, { useEffect, useRef, useState } from "react";
// import "./verifyLock.css";
import { Button } from "@mui/material";

import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import serverUrl from "../../GlobalVariable/serverUrl.json";
import EnglishLang from "../../Languages/English.json";
import KannadaLang from "../../Languages/Kannada.json";
import HindiLang from "../../Languages/Hindi.json";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useAuth } from "../../GlobalFunctions/Auth";
import { replace } from "formik";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";

function VerLockOpenRetrieve() {
  const [timeLeft, setTimeLeft] = useState(20);
  var time = 20;
  const interval = useRef(null);
  const [count, setCount] = useState(0);

  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const RetriveAuth = useRetriveAuth();

  const Auth = useAuth()
  

  const onIdle = () =>{
    RetriveAuth.sessionTimeoutLogout()
  }

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000*60*2
  })

  useEffect(() => {
    const interval = setInterval(() => {
        Math.ceil(getRemainingTime() / 1000)
      }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const verifyLockOpenObj = {
    PacketType: "wfLopenret",
    MobileNo: RetriveAuth.MobileNo,
    LockerNo: RetriveAuth.retrieveLockSelected,
    partialopen: RetriveAuth.isPartialRetrieve,
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
  };

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  useEffect(() => {
    // timeLeftFunction();
    checkLockOpenStatus();
  }, []);

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
    setIsError(false);
    const openLockObj = {
      ...verifyLockOpenObj,
      count: count,
    };
    console.log(openLockObj);

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
          if (RetriveAuth.retrievePacketType) {
            clearTimeIntervalFun();
            navigate("/retrieveSuccessPayLater", { replace: true });
          } else {
            clearTimeIntervalFun();
            navigate("/retrieveSuccess", { replace: true });
          }
        } else if (data.responseCode === "RALOPP-200") {
          clearTimeIntervalFun();
          navigate("/partialRetrieve", { replace: true });
        } else if (
          data.responseCode === "RELOP-201" ||
          data.responseCode === "RFLOPP-201"
        ) {
          setIsError(true);
          clearTimeIntervalFun();
        } else {
          setIsError(true);
          clearTimeIntervalFun();
        }
        setCount((count) => count + 1);
      })
      .catch((err) => {
        console.log("errr : " + err);
        setCount((count) => count + 1);
        clearTimeIntervalFun();
      });
    // alert(count)
    // console.log("count : "+count)
  };

  const timeLeftFunction = () => {
    interval.current = setInterval(() => {
      setTimeLeft(time);
      time = time - 1;
      console.log(time);
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

  const closeTheCurrentFunction = () => {
    Auth.logoutHandler();
    window.location.reload();
  }

  return (
    <div className="verify-lockopen-container">
      <div className="verify-lockopen-wind">
        {count < 3 ? (
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
                color="error"
                variant="contained"
                className="mui-btn-color-yellow"
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

            <Button
              color="error"
              variant="contained"
              className="mui-btn-color-yellow"
              onClick={() => closeTheCurrentFunction()}
              fullWidth
            >
              {" "}
              {language.VerifyingLockOpen.Cancel}
              {/* Cancel */}
            </Button>

            {/* <h2 className="man-override-header">
              ಏನೋ ತಪ್ಪಾಗಿದೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ದಯವಿಟ್ಟು ನಿರ್ವಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸಿ
            </h2> */}
          </>
        )}
      </div>
    </div>
  );
}

export default VerLockOpenRetrieve;
