import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./retrive.css";
import { useState } from "react";
import { Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import serverUrl from "../GlobalVariable/serverUrl.json";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import { useAuth } from "../GlobalFunctions/Auth";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { isSafari } from "react-device-detect";
import AppFiles from "../GlobalVariable/otherImp.json";

import Collapse from "@mui/material/Collapse";

import BLogo from "../logos/logo_yellow.png";

/*
  @Auther Praveenkumar
  For Retrieving the locker
  some information is collected here
  if the passcode is wrong page will be redirected to otp confirmation
*/

function RetrivePage() {
  const Auth = useAuth();
  const RetriveAuth = useRetriveAuth();

  const [retriveItems, setRetriveItems] = useState({
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
    PacketType: "retropenloc",
    MobileNo: "",
    passcode: "",
    lat: Auth.currentPosition.lat,
    long: Auth.currentPosition.long,
    btype: isSafari ? "Safari" : "Other",
  });

  const [invalidNumber, setInvalidNumber] = useState(false);
  const [invalidPasscode, setInvalidPasscode] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDeviceInactive, setIsDeviceInactive] = useState(false);

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  useEffect(() => {
    RetriveAuth.setRetriveDet({ LOCKNO: [] });
    RetriveAuth.excessUsageHandler({ eamount: "", EXHour: "" });
    RetriveAuth.postPayHandler({ amount: "", Hour: "" });
    RetriveAuth.postPayAndExcessUsageHandler({
      amount: "",
      Hour: "",
      eamount: "",
      EXHour: "",
    });
    RetriveAuth.retriveMobileNoHandler("");
  }, []);

  const navigate = useNavigate();

  const eventHandler = (e) => {
    if (e.target.name === "MobileNo") {
      if (e.target.value.length <= 10) {
        setRetriveItems({
          ...retriveItems,
          MobileNo: e.target.value,
        });
      }
    } else if (e.target.name === "passcode") {
      if (e.target.value.length > 4) {
        const passVal = e.target.value.slice(1, 6);
        setRetriveItems({
          ...retriveItems,
          passcode: passVal,
        });
      } else {
        setRetriveItems({
          ...retriveItems,
          passcode: e.target.value,
        });
      }
    }
  };

  const verifyPasscode = () => {
    if (retriveItems.passcode.length < 4) {
      setIsWarning(true);
    } else if (retriveItems.MobileNo.length < 10) {
      setIsWarning(true);
    } else {
      setIsActive(true);
      RetriveAuth.retriveMobileNoHandler(retriveItems.MobileNo);
      console.log(retriveItems);
      fetch(/* verifyPasscodeUrl */ serverUrl.path, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(retriveItems),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("======== Retrieve verify user with passcode ======");
          console.log(retriveItems);
          console.log(data);
          console.log("--------------end here------------------");

          if (data.responseCode === "RESUC-200") {
            // partial open lock

            if (data.partialopen === "true") {
              RetriveAuth.changePartialRetrieve();
            }

            if (data.postpay) {
              const retriveItmes = {
                LOCKNO: data.LOCKNO,
                orderId: data.orderId,
                // amount: Number(data.orderAmount),
                // amount: Number(data.orderAmount) / 100,
                amount: AppFiles.priceInPaise
                  ? Number(data.orderAmount) / 100
                  : Number(data.orderAmount),
                GSTAmount: Number(data.GSTAmount),
                balance: Number(data.balance),
              };
              RetriveAuth.setRetriveDet(retriveItmes);
            } else {
              const retriveItmes = {
                LOCKNO: data.LOCKNO,
                amount: 0,
              };
              RetriveAuth.setRetriveDet(retriveItmes);
            }

            // RetriveAuth.retriveLockHandler(data.LOCKNO);
            navigate("/retrieveLock", { replace: true });
          } else if (data.responseCode === "INMNO-201") {
            setInvalidNumber(true);
          } else if (data.responseCode === "INPAC-201") {
            setInvalidPasscode(true);
          } else if (data.responseCode === "DEVINACTIVE-201") {
            setIsDeviceInactive(true);
          }
          setIsActive(false);
        })
        .catch((err) => {
          setIsActive(false);
          console.log("err : " + err);
        });
    }
  };

  const closeWarningAlert = () => {
    setIsWarning(false);
  };

  const closeInvalidNumber = () => {
    setInvalidNumber(false);
  };

  const closeInvalidPasscode = () => {
    setInvalidPasscode(false);
  };

  return (
    <>
      <div className="retrive-page-container">
        <div className="passcode-wind">
          <img className="logo-container" src={BLogo} alt="img" width={100} />
          <Collapse in={isWarning}>
            <Alert
              variant="standard"
              severity="warning"
              onClose={() => closeWarningAlert()}
            >
              {language.RetrievePage.RetreiveAlert}
              {/* Please Provide The Valid Details ! */}
            </Alert>
          </Collapse>

          <Collapse in={invalidNumber}>
            <Alert
              variant="standard"
              severity="error"
              onClose={() => closeInvalidNumber()}
            >
              {language.RetrievePage.ValidMobNoAlert}
              {/* Invalid Mobile Number ! */}
            </Alert>
          </Collapse>

          <Collapse in={invalidPasscode}>
            <Alert
              variant="standard"
              severity="error"
              onClose={() => closeInvalidPasscode()}
            >
              {language.RetrievePage.ValidPasscodeAlert}
              {/* Invalid Passcode ! */}
            </Alert>
          </Collapse>

          {isDeviceInactive ? (
            <>
              {" "}
              <hr />
              <div className="inactive-device">
                <h2 className="inactive-device-header">
                  {language.NewUpdatedText.inactiveDeviceHeader}
                </h2>

                <h4 className="inactive-device-text">
                  {language.NewUpdatedText.inactiveDeviceDesc}
                  {/* Device is Inactive at the moment, you can still pick-up your
                  items by using the touch screen device, You can contact our
                  customer care for help. */}
                </h4>
              </div>
            </>
          ) : (
            <Box
              component="form"
              // sx={{
              //   "& .MuiTextField-root": { m: 1 },
              // }}
              noValidate
              autoComplete="off"
            >
              <div className="passcode-window" id="passcode-wind-id">
                <div className="passcode-header">
                  <h2>{language.RetrievePage.PasscodeTitle}</h2>
                  {/* <h2>Enter Details To Retrieve Your items</h2> */}
                </div>
                <div className="form-container">
                  <TextField
                    type="number"
                    label={language.RetrievePage.mobileNo}
                    maxLength={10}
                    name="MobileNo"
                    variant="outlined"
                    color="primary"
                    value={retriveItems.MobileNo}
                    onChange={(e) => eventHandler(e)}
                    required
                    focused
                    fullWidth
                  />
                </div>
                <div className="form-container">
                  <TextField
                    type="number"
                    label={language.RetrievePage.passcodeLabel}
                    maxLength={4}
                    name="passcode"
                    variant="outlined"
                    color="primary"
                    value={retriveItems.passcode}
                    onChange={(e) => eventHandler(e)}
                    required
                    fullWidth
                    focused
                  />
                </div>
                {isActive ? (
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
                  <div className="form-container">
                    <Button
                      variant="contained"
                      className="mui-btn-color-yellow"
                      endIcon={<ThumbUpIcon />}
                      onClick={() => verifyPasscode()}
                      fullWidth
                    >
                      {language.RetrievePage.Confirm}
                      {/* confirm */}
                    </Button>
                  </div>
                )}

                <div>
                  <Link to="/forgotPass">
                    <p className="forgot-passcode">
                      {language.RetrievePage.forgotPasscodeBtn}
                      {/* forgot passcode? */}
                    </p>
                  </Link>
                </div>
              </div>
            </Box>
          )}
        </div>
      </div>
    </>
  );
}

export default RetrivePage;
