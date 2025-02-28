import React, { useEffect, useState } from "react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../GlobalFunctions/Auth";

import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import YLogo from "../logos/tuckit_transparent.png";
import EnglishLang from "../Languages/Hindi.json";
import KannadaLang from "../Languages/English.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import { useIdleTimer } from "react-idle-timer";
import ChangeLanguage from "../Languages/ChangeLanguage";
import { useMobileLockerAuth } from "../GlobalFunctions/MobileLockerAuth";
import mobileLockersAmount from "../mobile-lockers/mobile-lockers-json/mobileLockersAmount.json";
import { replace } from "formik";
import { isSafari } from "react-device-detect";
import AppFooter from "./AppFooter";
import SocialMediaLinks from "./SocialMediaLinks";

function StoreOrRetrive() {
  const [chooseLanguage, setChooseLanguage] = useState("English");
  const [currentPosition, SetCurrentPosition] = useState({
    // lat: "13.010539",
    // long: "77.554939",

    lat: "12.9559856",
    long: "77.5963159",

    // lat: "12.33234356",
    // long: "77.9945236789",

    // lat: "",
    // long: "",
  });

  const [browser, setBrowser] = useState();

  const [terminalIdWind, setTerminalIdWind] = useState(false);
  const [locationAlertWindow, setlocationAlertWindow] = useState(false);

  const [terminalID, setTerminalID] = useState(null);
  let path = "";

  const navigate = useNavigate();

  const Auth = useAuth();
  const LangAuth = UseLanguage();
  const RetriveAuth = useRetriveAuth();
  const MobileLockerAuth = useMobileLockerAuth();

  useEffect(() => {
    // uncomment for production
    // getCurrentLocation();

    //  testing purpose for static location
    Auth.geoLocationHandler(currentPosition);

    if (!Auth.userDetails.terminalID) {
      path = getTerminalIdFromUrl();
    } else if (Auth.userDetails.terminalID !== "mobile-storage") {
      setTerminalID(Auth.userDetails.terminalID);
    }

    // if the location is taking manually only for testing purpose
    // Auth.geoLocationHandler(currentPosition);
  }, []);

  useEffect(() => {
    if (path === "mobile-storage") {
      navigate("/lockers/mobile-storage", { replace: true });
    }
  }, [path]);

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  // useEffect(() => {
  //   window.addEventListener("beforeunload", (event) => {
  //     event.preventDefault();
  //     return (event.returnValue =
  //       "Do not refresh the page, All Details will be lossed");
  //   });
  // });

  // to remove Console.log to display in the console of browser

  console.log = () => { };

  // const language = LangAuth.userLanguage;

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      if (!position.coords.latitude) {
        alert(language.LocationAcceptPage.grantPermissionLocation);
        // alert("grant permission to access your current location");
      } else {
        const locationObj = {
          lat: String(position.coords.latitude),
          long: String(position.coords.longitude),
        };

        SetCurrentPosition({
          ...currentPosition,
          ...locationObj,
        });

        Auth.geoLocationHandler(locationObj);

        // for getting the key val from the url
      }
    });
    setlocationAlertWindow(false);
  };

  const getTerminalIdFromUrl = () => {
    var url_string = window.location.href; // www.test.com?filename=test

    // var url_string = 'http://localhost:3000/storeRetrieve?terminalID=ORN'; // www.test.com?filename=test
    var url = new URL(url_string);
    var paramValue = url.searchParams.get("terminalID");

    if (paramValue) {
      const terminalIdObj = {
        terminalID: paramValue,
      };

      if (paramValue === "mobile-storage") {
        const locationID = url.searchParams.get("locId");
        const lType = url.searchParams.get("ltype");
        const browserType = isSafari ? "safari" : "other";

        if (locationID !== null && lType !== null) {
          const mobileLockerObject = {
            locationId: locationID,
            lockerType: lType,
            browserType: browserType,
            // amount: mobileLockersAmount[lType],
          };

          console.log(mobileLockerObject);

          MobileLockerAuth.handleMobileLockersObject(mobileLockerObject);
          Auth.existingUserHandler(terminalIdObj);
          setTerminalID(paramValue);
          setTerminalIdWind(false);
          setlocationAlertWindow(true);

          return paramValue;
        } else {
          alert("Something wrong with QR code please contact Admin");
          setTerminalIdWind(true);
        }
      } else {
        console.log(terminalIdObj);
        Auth.existingUserHandler(terminalIdObj);
        RetriveAuth.setRetriveDet(terminalIdObj);

        setTerminalID(paramValue);
        setTerminalIdWind(false);
        setlocationAlertWindow(true);
      }
    } else {
      setTerminalIdWind(true);
    }
  };

  // const changeLanguageFun = () => {
  //   setLanguage(KannadaLang);
  // };

  const chooseLanguageFun = (e) => {
    setChooseLanguage(e.target.value);
    LangAuth.changeUserLanguageFun(e.target.value);
  };

  // const closeDailogueWindow = () => {
  //   setlocationAlertWindow(false)
  // };

  function reloadApp() {
    window.location.reload();
  }

  return (
    <>
      <div className="str-retrieve-choose-container">
        {/* for changing the language here */}

        {/* {terminalID && <ChangeLanguage terminalid={terminalID} />} */}

        <ChangeLanguage terminalid={terminalID} />

        {/* <div className="choose-lang-container">
        <Box sx={{ minWidth: 120 }}>
          <FormControl
            focused
            size="small"
            style={{
              width: 150,
              backgroundColor: "#F17829",
              marginTop: "30px",
            }}
          >
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chooseLanguage}
              // label="Change Language Here"
              onChange={(e) => chooseLanguageFun(e)}
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Kannada">Kannada</MenuItem>
              <MenuItem value="Hindi">Hindi</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div> */}

        <Dialog
          open={locationAlertWindow}
          // onClose={() => closeDailogueWindow()}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {/* {"Current Location Required !"} */}
            {language.LocationAcceptPage.locationAlertTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {language.LocationAcceptPage.LocationAcceptAlerrt}
              {/* Please Allow your browser to access your current location to
            proceed! just to make sure you are next locker. */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="info"
              variant="outlined"
              onClick={() => getCurrentLocation()}
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {terminalIdWind ? (
          <div className="no-terminal-id-wind">
            <div className="no-terminal-id-content">
              <h3>{language.QRCodeScan.QRCodeScanner}</h3>
              {/* <h3>please scan the qr code to proceed</h3> */}
              <hr
                style={{
                  marginTop: "18px",
                  marginBottom: "5px",
                }}
              />
              <SocialMediaLinks />
            </div>
          </div>
        ) : Auth.currentPosition.lat && Auth.currentPosition.long ? (
          <div className="opening-page-container">
            {/* uncomment for language change  */}

            <div className="welcome-page-container">
              <div className="welcomepage-logo-container">
                <img
                  className="welcome-page-logo"
                  src={YLogo}
                  alt="img"
                  width={160}
                />
              </div>

              <div className="retrive-or-store">
                {/* <div className="retrive-or-store"> */}
                {/* <hr className="devider"></hr> */}
                {/* <h2 className="page-header">Hello !</h2> */}
                {/* <h4 className="page-header">{language.OpeningPage.hello}</h4> */}

                <h4 className="page-header">
                  {" "}
                  <strong className="welcome-hello">
                    {language.OpeningPage.hello},{" "}
                  </strong>
                  {language.OpeningPage.welcometitle}
                </h4>
                {/* <SocialMediaLinks /> */}
                <div className="choose-retrive">
                  <h3 className="container-header">
                    <strong>{language.OpeningPage.storeBtn}</strong>

                    {/* <h4 className="page-header">{language.OpeningPage.hello}</h4>
              <h4 className="page-header">
                {" "}
                <strong className="welcome-hello">Hello, </strong>
                Welcome To Tuckit.in
              </h4>
              <div className="choose-retrive">
                <h3 className="container-header">
                  <strong>{language.OpeningPage.storeBtn}</strong> */}
                  </h3>
                  <Link to="/login">
                    <IconButton
                      aria-label="delete"
                      className="store-btn"
                      size="large"
                      color="primary"
                    >
                      <KeyboardDoubleArrowUpIcon fontSize="large" />
                    </IconButton>
                  </Link>
                </div>

                <div className="diff-line"></div>
                <div className="choose-store">
                  <Link to={"/retrieve"}>
                    <IconButton
                      aria-label="delete"
                      className="retrive-btn"
                      size="large"
                      color="primary"
                    >
                      <KeyboardDoubleArrowDownIcon fontSize="large" />
                    </IconButton>
                  </Link>
                  <h3 className="container-header">
                    <strong> {language.OpeningPage.retrieveBtn}</strong>
                  </h3>
                </div>
                <div
                  style={{
                    marginTop: "25px",
                    marginBottom: "-10px",
                  }}
                >
                  <hr
                    style={{
                      marginTop: "10px",
                      marginBottom: "5px",
                    }}
                  />
                  <SocialMediaLinks />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-terminal-id-wind">
            <div className="no-terminal-id-content">
              <h2>{language.LocationAcceptPage.locationAlertTitle}</h2>
              {/* <h2>Current location is required for security purpose</h2> */}
              <h6 className="path-to-unblock-loc">
                {" "}
                {/* Go to settings {" => "} site Settings {" => "} location{" "} */}
                {language.LocationAcceptPage.locationAccessDesc1 +
                  " => " +
                  language.LocationAcceptPage.locationAccessDesc2 +
                  " => " +
                  language.LocationAcceptPage.locationAccessDesc3}
              </h6>
              <h6 className="path-to-unblock-loc">
                {" "}
                {/* Allow location access and try again to continue */}
                {language.LocationAcceptPage.locationAccessDesc4}
              </h6>
              <div className="form-container">
                <Button
                  color="primary"
                  variant="contained"
                  className="mui-btn-color"
                  onClick={() => reloadApp()}
                  fullWidth
                >
                  {language.LocationAcceptPage.getLocation}
                  {/* get Location */}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <AppFooter /> */}
      {/* <SocialMediaLinks /> */}
    </>
  );
}

export default StoreOrRetrive;
