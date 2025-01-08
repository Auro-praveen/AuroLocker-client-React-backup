import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbsDownIcon from "@mui/icons-material/ThumbDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import serverUrl from "../GlobalVariable/serverUrl.json";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import "./retrive.css";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

/*
  @Auther Praveenkumar 
  otp confirmation if in case user forgot the passcode
  Some payment infoermation is collected here
*/

function ConfirmOtp() {
  const [enteredOtp, setEnteredOtp] = useState();
  const [timeOut, setTimeOut] = useState(60);

  const RetriveAuth = useRetriveAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  var time = 60;

  // var interval;
  const interval = useRef();

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  useEffect(() => {
    // window.location.reload(false);
    countDowninterval();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });

  const clearIntervalFun = () => {
    clearInterval(interval.current);
    setTimeOut(0);
  };

  const countDowninterval = () => {
    interval.current = setInterval(() => {
      // console.log(time)
      if (time < 0) {
        clearIntervalFun();
      } else {
        setTimeOut(time);
      }
      time = time - 1;
      console.log(time)
    }, 1000);
  };

  const otpHandlerEvent = (e) => {
    if (e.target.value.length > 4) {
    } else {
      setEnteredOtp(e.target.value);
    }
  };

  const resendOtpFun = () => {
    clearIntervalFun()
    setEnteredOtp("");
  };

  const redirectPath = location.pathname?.path || "/retrieveLock";

  const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  const verifyPasscodeUrl =
    "http://192.168.0.198:8080/AuroAutoLocker/PasscodeHandler";

  const verifyOtpFunction = () => {

    if (enteredOtp.length < 4) {
      alert("OTP is Incorrect");
    } else {
      setIsLoading(true);
      
      const obj = {
        terminalID:RetriveAuth.retriveLockContainer.terminalID,
        // terminalID: "G21",
        MobileNo: RetriveAuth.MobileNo,
        otp: enteredOtp,
        PacketType: "retropenlocotpconf",
      };
      console.log(obj);
      fetch(/* verifyPasscodeUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "RESUC-200") {
            setIsLoading(false);
            clearIntervalFun()
            if (data.partialopen === "true") {
              RetriveAuth.changePartialRetrieve()
            }
            
            if (data.postpay) {
              const retriveItmes = {
                LOCKNO: data.LOCKNO,
                orderId: data.orderId,
                amount: Number(data.orderAmount),
                GSTAmount: Number(data.GSTAmount)
              };
              RetriveAuth.setRetriveDet(retriveItmes);
            } else {
              const retriveItmes = {
                LOCKNO: data.LOCKNO,
                amount:0
              };
              RetriveAuth.setRetriveDet(retriveItmes);
            }

            navigate(redirectPath, { replace: true });
          } else if (data.responseCode === "INPAC-201") {
            setIsLoading(false);
            alert(language.RetrievePage.ValidPasscodeAlert);
            // alert("invalid passcode");
          } else if (data.responseCode === "INMNO-201") {
            setIsLoading(false);
            alert(language.RetrievePage.ValidMobNoAlert);
          //   alert("invalid passcode");
          // } else if (data.responseCode === "INMNO-201") {
          //   setIsLoading(false);
          //   alert("invalid phone number");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err : " + err);
        });
    }
  };

  return (
    <>
      <div className="verify-otp-container">
        <div className="verify-otp-wind">
        <h3>{language.RetrievePage.VerifyingOTP}</h3>
          {/* <h3>verify otp here</h3> */}
          <Box
            component="form"
            sx={{
              // "& .MuiTextField-root": { m: 1, width: "30ch" },
              "& .MuiTextField-root": { m: 1 },
            }}
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
          >
            <h2 className="timout">{timeOut}</h2>
            <div className="form-container">
              <TextField
                label={language.RetrievePage.otp}
                type="number"
                name="otp"
                variant="outlined"
                color="primary"
                focused
                required
                fullWidth
                value={enteredOtp}
                onChange={(e) => otpHandlerEvent(e)}
              />
            </div>
            <div className="form-container">
              <Link to="/forgotPass">
                <Button
                  variant="text"
                  color="primary"
                  onClick={(e) => resendOtpFun(e)}
                  fullWidth
                >
                  {" "}
                  {language.RetrievePage.resendOTP}{" "}
                  {/* resend otp?{" "} */}
                </Button>
              </Link>
            </div>
            <div className="form-container">
              {timeOut !== 0 ? (
                isLoading ? (
                  <div className="btn-container">
                    <LoadingButton
                      loading
                      loadingPosition="end"
                      endIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {language.RetrievePage.Generating}
                      {/* generating */}
                    </LoadingButton>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    className="mui-btn-color-yellow"
                    endIcon={<ThumbUpIcon />}
                    onClick={(e) => verifyOtpFunction(e)}
                    fullWidth
                  >
                    {language.RetrievePage.VerifyOTP} &nbsp;&nbsp;&nbsp;
                    {/* Verify OTP &nbsp;&nbsp;&nbsp; */}
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  endIcon={<ThumbsDownIcon />}
                  fullWidth
                  disabled
                >
                  {language.RetrievePage.timesup} &nbsp;&nbsp;&nbsp;
                  {/* time up &nbsp;&nbsp;&nbsp; */}
                </Button>
              )}
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default ConfirmOtp;
