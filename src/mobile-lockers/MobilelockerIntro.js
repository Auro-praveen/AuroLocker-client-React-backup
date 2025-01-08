import React, { useState } from "react";
import { useEffect } from "react";
import "./mobileLockerintro.css";
import YLogo from "../logos/logo_yellow.png";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { useMobileLockerAuth } from "../GlobalFunctions/MobileLockerAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { commonPOSTapiForMobileLockersMainServer } from "./server-connectivity/ServerAPI";
import axios from "axios";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import { useIdleTimer } from "react-idle-timer";
// import axios from "axios";


// default path for mobile lockers would be --> http://localhost:3000/storeRetrieve?terminalID=mobile-storage&&locId=BANGLORE&&ltype=SMALL
export default function MobilelockerIntro() {
  const [mobLockerInformation, setMobLockerInformation] = useState({
    lockType: "Large",
    lockAmount: 20,
    locationId: "loc202",
    gst: 0,
  });

  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [openInfoAlert, setOpeInfoAlert] = useState(false);
  const [isLockersAvailable, setIsLockersAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverCommunicationError, setServerCommunicationError] =
    useState(false);

  const mobileLockerAuth = useMobileLockerAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  const onIdle = () => {

    console.log("logout called here");
    mobileLockerAuth.logoutHandler();

  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      let time = getRemainingTime() / 1000
      Math.ceil(time);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getTerminalIdLockerDetais();

    // testRequestPOST();

    // setMobLockerInformation({
    //   ...mobLockerInformation,
    //   locationId: mobileLockerAuth.mobileLockersObject.locationId,
    //   lockAmount: mobileLockerAuth.mobileLockersObject.lockerAmount,
    //   lockType: mobileLockerAuth.mobileLockersObject.lockerType,
    // });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });

  // const testRequestPOST = async () => {
  //   await axios.post("http://192.168.0.198:8080/AuroAutoLocker/TestingServltt",
  //     {
  //     val: "Something"
  //   }, {
  //     headers: {
  //       Accept: "application/json"
  //     },
  //     withCredentials : true
  //   },

  // )
  //   .then((data) => console.log(data))
  // }

  const getTerminalIdLockerDetais = async () => {
    const requestPayload = {
      PacketType: "stgetamt",
      LocationID: mobileLockerAuth.mobileLockersObject.locationId,
      LockerType: mobileLockerAuth.mobileLockersObject.lockerType,
    };

    const resp = await commonPOSTapiForMobileLockersMainServer(
      requestPayload
    ).catch((err) => console.log("some error : " + err));

    // console.log(resp.available ? "some true" : "fals asdf");

    // if (resp.status !== "resp-404") {

    // console.log(resp);

    if (resp.status === "resp-200") {
      if (resp.responseCode === "locwamt") {
        if (resp.available) {
          const respObject = {
            lockerAmount: resp.amount,
            gst: resp.gst,
          };

          setMobLockerInformation({
            lockType: mobileLockerAuth.mobileLockersObject.lockerType,
            locationId: mobileLockerAuth.mobileLockersObject.locationId,
            // locationId: mobileLockerAuth.mobileLockersObject.locationId,
            lockAmount: resp.amount,
            gst: resp.gst,
          });

          setIsLockersAvailable(true);
          mobileLockerAuth.handleMobileLockersObject(respObject);

          setIsLoading(false);
        } else {
          setIsLockersAvailable(false);
          setOpeInfoAlert(true);
          setIsLoading(false);
        }
      } else {
        setOpenErrorAlert(true);
        setIsLoading(false);
        setIsLockersAvailable(false);
      }
    } else {
      setOpenErrorAlert(true);
      setIsLoading(false);
      setIsLockersAvailable(false);
      setServerCommunicationError(true);
    }

    // }

    // else {
    //   setOpenErrorAlert(true)
    //   setIsLoading(false)
    //   setIsLockersAvailable(false)
    // }
  };

  const handleProceed = () => {
    location.pathname = "/lockers/otp-verification";
    navigate(location.pathname, { replace: true });
  };

  const closeAllAlerts = () => {
    setOpeInfoAlert(false);
    setOpenErrorAlert(false);
  };

  const handleClose = () => {
    mobileLockerAuth.logoutHandler();
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress
          color="inherit"
          size={"35px"}
          sx={{ marginTop: "35%" }}
        />
      ) : (
        <div className="loginPage-containerr">
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
                Server Connection Failed!, Please Try Again
              </Alert>
            </Snackbar>

            <Snackbar
              open={openInfoAlert}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={6000}
              onClose={closeAllAlerts}
            >
              <Alert
                onClose={closeAllAlerts}
                severity="info"
                variant="filled"
                sx={{ width: "100%" }}
              >
                Currently All Lockers Have Been Booked!
              </Alert>
            </Snackbar>

            <img
              className="logo-container"
              src={YLogo}
              alt="img"
              width={100}
              style={{ marginTop: "-3px" }}
            />
            <hr style={{ marginTop: "1px" }} />
            <div className="locker-info-container">
              {isLockersAvailable ? (
                <>
                  <h2 className="mobile-locker-header">
                    Locker Information For LocationId :{" "}
                    <b style={{ color: "red" }}>
                      {mobLockerInformation.locationId}
                    </b>
                  </h2>
                  {/* <hr /> */}

                  <div className="locker-category-container">
                    <div className="locker-content-inline">
                      <p className="single-line-para para">Locker Type : </p>{" "}
                      <p className="single-result-para para">
                        {mobLockerInformation.lockType}
                      </p>
                    </div>

                    <div className="locker-content-inline">
                      <p className="single-line-para para">Amount : </p>{" "}
                      <p className="single-result-para para">
                        {mobLockerInformation.lockAmount} Rs
                      </p>
                      <p className="single-line-para para">{" "} / Mobile You Store. </p>{" "}
                    </div>
                  </div>

                  <div className="para-info-container">
                    {" "}
                    <p className="info-para para">
                      <b>Note</b> : You Can Store Only{" "}
                      {mobLockerInformation.lockType === "Small"
                        ? 2
                        : mobLockerInformation.lockType === "Medium"
                        ? 3
                        : mobLockerInformation.lockType === "Large"
                        ? "6-12"
                        : ""}{" "}
                      Mobiles Inside This Locker
                    </p>
                  </div>

                  <div className="mob-lock-btn-container">
                    <Button
                      variant="contained"
                      className="mob-locker-btn"
                      onClick={() => handleProceed()}
                      fullWidth
                    >
                      Proceed
                    </Button>
                  </div>
                </>
              ) : serverCommunicationError ? (
                <>
                  <div className="no-locker-available-container">
                    <h4>{language.LoginPage.deviceInactive}</h4>

                    <h6>{language.LoginPage.deviceInactiveDesc}</h6>
                  </div>

                  <div className="mob-lock-btn-container">
                    <Button
                      variant="contained"
                      className="mob-locker-btn"
                      onClick={() => handleClose()}
                      fullWidth
                    >
                      Proceed
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="no-locker-available-container">
                    <h4>All Lockers Have Been Booked</h4>

                    <h6>
                      Currently No Lockers Are Available You Can Try After Some
                      time or Try From Different location or terminal,
                    </h6>
                  </div>

                  <div className="mob-lock-btn-container">
                    <Button
                      variant="contained"
                      className="mob-locker-btn"
                      onClick={() => handleClose()}
                      fullWidth
                    >
                      Proceed
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
