import React, { useState, useEffect, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

import "./LoginDes.css";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../GlobalFunctions/Auth";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import serverUrl from "../GlobalVariable/serverUrl.json";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import YLogo from "../logos/logo_yellow.png";
import YTextLogo from "../logos/tuckit_yellow_text.png";
import { isSafari } from "react-device-detect";

import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage, useLanguage } from "../GlobalFunctions/LanguageFun";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PhonelinkLockIcon from "@mui/icons-material/PhonelinkLock";
// import { LoadCanvasTemplate } from "react-simple-captcha";

import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Typography } from "@mui/material";

/**
 *
 * @author("Praveen")
 *
 *
 * for generating the otp here
 * otp via sms for all the terminal id's for terminal id falcon there is option of getting the otp via sms or whatsapp
 * last updated praveen august-24 2023
 *
 * 27/10/2023
 * Removed Whatsapp otp verification Option Here.
 * Only otp verification is possible through normal mobile otp
 *
 */

function LoginPage(props) {
  const Auth = useAuth();

  const [clientRequest, setClientRequest] = useState({
    terminalID: Auth.userDetails.terminalID,
    currentTime: "",
    MobileNo: "",
    btype: isSafari ? "Safari" : "Other",
  });

  const [isMessgeTypeDialogueOpen, setIsMessgeTypeDialogueOpen] =
    useState(false);
  const [activeWarning, setActiveWarning] = useState(false);
  const [activeError, setActiveError] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const [btnActive, setBtnActive] = useState(true);
  const [limitExceed, setLimitExceed] = useState(false);

  const [lockersFull, setLockersFull] = useState(false);

  const [lockerTimeOver, setLockerTimeOver] = useState(false);

  const [blockedUser, setBlockedUser] = useState(false);

  const [isDeviceActive, setIsDeviceActive] = useState(false);
  const [storeWindClass, setStoreWindClass] = useState("store-page-container");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCurrentTimeFun = () => {
    const date = new Date();
    console.log(
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    );
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  useEffect(() => {
    if (Auth.currentPosition.lat === "" && Auth.currentPosition.long === "") {
      alert("false");
      navigate("/", { replace: true });
    }

    if (Auth.phoneNumber) {
      setClientRequest({
        ...clientRequest,
        MobileNo: Auth.phoneNumber,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  // const sendOtpUrl = "http://192.168.0.198:8080/AuroAutoLocker/OtpHandler";
  // const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  // praveen changed this function for getting whatsapp through otp august - 24
  const sendOtpFun = (e) => {
    e.preventDefault();
    setBtnActive(false);

    if (clientRequest.MobileNo === undefined) {
      alert("Please enter your phone number");
    } else if (clientRequest.MobileNo.length === 10) {
      if (isChecked) {
        if (clientRequest.terminalID === "G2121") {
          // askForDefaultGenerateOtpType();
          setIsMessgeTypeDialogueOpen(true);
        } else {
          const time = getCurrentTimeFun();
          setClientRequest({
            ...clientRequest,
            ...Auth.currentPosition,
            currentTime: time,
          });

          const custDetials = {
            ...clientRequest,
            ...Auth.currentPosition,
            PacketType: "stgetotp",
            currentTime: time,
          };

          generateOtp(custDetials);
        }
      } else {
        setBtnActive(true);
        setActiveError(true);
      }
    } else {
      setActiveWarning(true);
      setBtnActive(true);
    }
  };

  // this function is responible for asking for weather the user want get otp via normal sms or whatsapp

  const askForDefaultGenerateOtpType = (param) => {
    if (param === "sms") {
      const time = getCurrentTimeFun();
      setClientRequest({
        ...clientRequest,
        ...Auth.currentPosition,
        currentTime: time,
      });

      const custDetials = {
        ...clientRequest,
        ...Auth.currentPosition,
        PacketType: "stgetotp",
        currentTime: time,
        whatsup: false,
      };

      generateOtp(custDetials);
    } else {
      const time = getCurrentTimeFun();
      setClientRequest({
        ...clientRequest,
        ...Auth.currentPosition,
        currentTime: time,
      });

      const custDetials = {
        ...clientRequest,
        ...Auth.currentPosition,
        PacketType: "stgetotp",
        currentTime: time,
        whatsup: true,
      };

      generateOtp(custDetials);
    }

    setIsMessgeTypeDialogueOpen(false);
  };

  // this function is responsible for generating otp
  const generateOtp = (custDetials) => {
    Auth.loginHandler(clientRequest.MobileNo);

    console.log(custDetials);

    fetch(/*sendOtpUrl*/ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Referrer-Policy": "no-referrer",
        // "X-Content-Type-Options": "nosniff",
        // "X-Frame-Options":"SAMEORIGIN"
      },
      body: JSON.stringify(custDetials),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (
          data.responseCode === "GENOTP-200" ||
          data.responseCode === "GENOTP-201"
        ) {
          const lockCount = parseInt(data.Lcount);
          Auth.seatCountFun(lockCount);
          Auth.loginHandler(clientRequest.MobileNo);
          navigate("/verOtp", { replace: true });
          setBtnActive(true);
        } else if (data.responseCode === "LOCMAXREAC-201") {
          setLimitExceed(true);
        } else if (data.responseCode === "DEVINACT-201") {
          setIsDeviceActive(true);
          // praveen changed for testing
          // const lockCount = parseInt(data.Lcount);
          // Auth.seatCountFun(lockCount);
          // Auth.loginHandler(clientRequest.MobileNo);
          // navigate("/verOtp", { replace: true });
          // setBtnActive(true);
        } else if (data.responseCode === "LOCKERFULL-200") {
          setLockersFull(true);
        } else if (data.responseCode === "SERTIMEOVER-200") {
          setLockerTimeOver(true);
        } else if (data.responseCode === "NUMBERBLOCK") {
          setBlockedUser(true);
        } else {
          //reloads the [age if otp not sent
          alert("some error occured, please check your MobileNumber");
          // window.location.reload(false);
          setClientRequest({
            ...clientRequest,
            MobileNo: "",
          });
          setBtnActive(true);
        }
      })
      .catch((err) => {
        setBtnActive(true);
        console.log("err " + err);
      });
  };

  var timeLeft = 3;
  const interval = useRef();

  if (activeWarning) {
    interval.current = setInterval(() => {
      timeLeft = timeLeft - 1;
      if (timeLeft === 0) {
        setActiveWarning(false);
        clearInterval(interval.current);
      }
    }, 1000);
  }

  if (activeError) {
    interval.current = setInterval(() => {
      timeLeft = timeLeft - 1;
      if (timeLeft === 0) {
        setActiveError(false);
        clearInterval(interval.current);
      }
    }, 1000);
  }

  const hideWarningAlert = () => {
    setActiveWarning(false);
    clearInterval(interval.current);
  };

  const hideErrorAlert = () => {
    setActiveError(false);
    clearInterval(interval.current);
  };

  //for setting a phone number
  const setPhoneNumFunc = (e) => {
    if (e.target.value.length <= 10) {
      setClientRequest({
        ...clientRequest,
        [e.target.name]: e.target.value,
      });
    }
  };

  const acceptPolicy = (e) => {
    setIsChecked(e.target.checked);
  };

  const closeMessageTypeDailogue = () => {
    setIsMessgeTypeDialogueOpen(false);
    setBtnActive(true);
  };

  return (
    <div className="loginPage-container">
      {limitExceed ? (
        <>
          <div className="limit-exceed">
            <div className="limit-exceed-header-one">
              <h4>{language.LoginPage.LockerLimitExceed}</h4>
            </div>

            <div className="limit-exceed-header-two">
              <h2>{language.LoginPage.Retrieve3Lockers}</h2>
            </div>

            <Link to="/retrieve">
              <Button variant="contained" color="primary">
                {language.LoginPage.retrieveLock}
                {/* <h4>locker booking limit Exceeded for your mobile number</h4>
            </div>

            <div className="limit-exceed-header-two">
              <h2>please try again after retrieving your items</h2>
            </div>

            <Link to="/retrieve">
              <Button variant="contained" color="primary">
                Retrieve Lock */}
              </Button>
            </Link>
          </div>
        </>
      ) : lockersFull ? (
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
      ) : isDeviceActive ? (
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
      ) : blockedUser ? (
        <>
          <div className="limit-exceed">
            <div>
              <h4 className="limit-exceed-header-one">
                {language.AdditionalAlerts.loginBlockedUserTitle}
              </h4>
            </div>

            <hr />
            <div className="limit-exceed-header-two">
              <h2>{language.AdditionalAlerts.loginBlockedUserDesc}</h2>
            </div>
          </div>
        </>
      ) : (
        <div className="row">
          <div className={storeWindClass}>
            <img className="logo-container" src={YLogo} alt="img" width={100} />
            {/* <div className="welcomepage-logo-container-others">
              <img
                className="welcome-page-logo-others"
                src={YLogo}
                alt="img"
                width={160}
              />
            </div> */}

            {/* <div className="text-logo-container">
              <img
                className="logo-container-text"
                src={YTextLogo}
                alt="img"
                width={80}
              />
            </div> */}

            {/* <hr style={{marginTop : "-7px", marginBottom:"-7px"}}/> */}
            <div className="row">
              {/* <div className="col-md-6 col-lg-6 login-left">
                  <img src={loginBanner} className="img-fluid" alt="Login" />
                </div> */}

              <div className="form-container">
                <Stack sx={{ width: "100%" }} spacing={2}>
                  {activeError && (
                    <Alert
                      variant="standard"
                      severity="error"
                      onClose={() => hideErrorAlert()}
                    >
                      {language.LoginPage.termsAlert}
                      {/* Please Accept terms and conditions!! */}
                    </Alert>
                  )}

                  {activeWarning && (
                    <Alert
                      variant="standard"
                      severity="warning"
                      onClose={() => hideWarningAlert()}
                    >
                      {language.LoginPage.EnterValidMobNoAlert}
                      {/* Mobile number is not valid! */}
                    </Alert>
                  )}
                  {/* <Alert variant="filled" severity="info">
                    This is an info alert — check it out!
                  </Alert>
                  <Alert variant="filled" severity="success">
                    This is a success alert — check it out!
                  </Alert> */}
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
                  <>
                    <div className="login-header">
                      <h3 className="login-header-text">
                        {language.LoginPage.authenticateTitle}
                      </h3>
                    </div>
                    <div className=" form-container">
                      <TextField
                        type="number"
                        label={language.LoginPage.mobileNo}
                        name="MobileNo"
                        className="passocde-input"
                        variant="outlined"
                        color="warning"
                        value={clientRequest.MobileNo}
                        onChange={(e) => setPhoneNumFunc(e)}
                        required
                        fullWidth
                        focused
                      />
                    </div>
                    {/* <LoadCanvasTemplate /> */}
                    <div className="terms-condition-container">
                      <FormControlLabel
                        // label={language.LoginPage.termschbox}
                        control={
                          <Checkbox
                            checked={isChecked}
                            inputProps={{ "aria-label": "controlled" }}
                            onChange={(e) => acceptPolicy(e)}
                          />
                        }
                      />
                      <Button color="primary" onClick={() => handleClickOpen()}>
                        {" "}
                        {language.LoginPage.termschbox}
                        {/* terms and conditions */}
                      </Button>
                    </div>

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle
                        color={"#002185"}
                        textAlign={"center"}
                        id="responsive-dialog-title"
                      >
                        {"Terms And Conditions"}
                        <hr
                          style={{
                            marginTop: "2px",
                            marginBottom: "2px",
                            color: "crimson",
                            width: "100%",
                          }}
                        />
                      </DialogTitle>

                      <DialogContent>
                        <DialogContentText color={"#000"}>
                          <b>USER TERMS </b>
                          This document is an electronic record in terms of
                          Information Technology Act, 2000 and rules thereunder
                          as applicable and the amended provisions pertaining to
                          electronic records in various statutes as amended by
                          the Information Technology Act, 2000. This electronic
                          record is generated by a computer system and does not
                          require any physical or digital signatures. Please
                          read these User Terms ("Terms") carefully before using
                          the Application and Service operated by Tuckit ("us",
                          "we", or "our"). Your access to and use of the
                          Application and Service is conditioned on your
                          acceptance of and compliance with these Terms and the
                          Privacy Policy. These Terms apply to all visitors,
                          users and others who access or use the Application and
                          Service. By accessing or using the Website,
                          Application and Service you agree to be bound by these
                          Terms. If you disagree with any part of the Terms,
                          then you may not access the Application and Service.
                          The term “you/ your” or “User” refers to the user of
                          Application and Service offered commercially by
                          Tuckit.
                          <br />
                          <b>TUCKPOD STORAGE SOLUTIONS PRIVATE LIMITED </b>
                          of the Companies Act, 2013 and having its registered
                          office at 6/3 Nala Cross, KH Road, Sudhamanagar,
                          Bangalore 560027 (hereinafter referred to as ‘Tuckit’,
                          which term shall include its transferees, novatees,
                          assigns and/or successors); For the purposes of these
                          Terms, You and Tuckit shall individually be known as
                          “Party” and collectively be known as the “Parties”.
                          <br />
                          <b>1.DEFINITIONS </b> 1.1 “Applicable Law” shall mean
                          any statutes, laws, regulations, ordinances, rules,
                          judgments, orders, decrees, by-laws, approval from the
                          concerned authority, government resolution, orders,
                          directives, guidelines, policy, requirement, or other
                          governmental restriction or any similar form of
                          decision of, or determination by, or any
                          interpretation or adjudication having the force of law
                          of any of the foregoing, by any concerned authority
                          having jurisdiction over the matter in question;
                          <br />
                          1.2 “Application” shall mean the software application,
                          dashboards, web and mobile applications, interactive
                          user interface, hardware and related documentation
                          which Tuckit provides to the User, including any
                          updates thereof, whether hosted or made available
                          locally or remotely, to enable Tuckit to provide the
                          Service to the User.
                          <br />
                          1.3 “Service” shall mean the service of providing
                          temporary storage solutions by means of electronically
                          or mechanically controlled secure lockers/pods at
                          various locations through the Application, to the User
                          by Tuckit as per these Terms.
                          <br />
                          <b>2.USER ELIGIBILITY </b> 2.1 The Application and
                          Service are available only to the User who can form
                          legally binding contracts under the Applicable Law.
                          2.2 The User must not be a minor as per Applicable Law
                          i.e. User must be at least 18 (eighteen) years of age
                          to be eligible to use the Application and Service. In
                          the event the User is a minor, it is assumed that such
                          User’s use of the Application and Service and these
                          Terms have been agreed to by the legal guardian of the
                          said User and that these Terms are legally binding.
                          2.3 The User, while accessing or using the Application
                          and Service, must follow and abide by the Applicable
                          Laws. In the event of the User being found to be not
                          eligible as per the Applicable Laws, Tuckit reserves
                          the right to deny the Application and Service.
                          Notwithstanding the foregoing, Tuckit at all times
                          reserves the right to deny the Application and Service
                          to the User.
                          <br />
                          <b>3. CONSENT TO THE TERMS </b> 3.1 By clicking on the
                          tab/button/checkbox of “Accept” or any other
                          tab/button/checkbox of similar nature, subject to
                          providing any information mandatorily required by the
                          Application or Service, (i) You confirm your
                          eligibility under Applicable Law to contract with
                          Tuckit, (ii) you accept these Terms and the Privacy
                          Policy as displayed on the Application, (iii) You
                          consent to receive communications and information from
                          us electronically (whether through SMS, emails, phone
                          calls and automated phone calls), whether sent by
                          e¬mail or other electronic means and (iv) You consent
                          to obtaining and sharing of any information (including
                          personally identifiable information) with our
                          employees, agents, associates and third parties on a
                          need-to-know basis or under terms of confidentiality,
                          for the purpose of making available the Application
                          and Service to You. Electronic communications shall be
                          deemed to have been received by you when we send the
                          electronic communication to the email address/mobile
                          number/details provided by you during the sign-up or
                          accessing the Application or Service as per our
                          records, or when we post the electronic communication
                          on the Application.
                          <br />
                          <b>4. REGISTRATION AND BOOKING </b>
                          4.1 In order to use the Services and the Application,
                          You must: <br /> a. Only open one Account using Your
                          Registration Data, and not use the account of any
                          person <br /> b. provide your own electronic device
                          (including mobile phone), which must have a
                          functioning mobile number and the ability to read Our
                          text messages (SMS), OTP (One Time Password) and push
                          notifications, and meet the minimum device
                          requirements we specify from time to time (Device). It
                          is your responsibility to check to ensure that you
                          download the correct version of the Application for
                          your Device <br /> c. have to keep your account and
                          registration details current and correct for
                          communications. By agreeing to the terms and
                          conditions, the User agrees to receive promotional
                          communication and newsletters upon registration. The
                          USer can opt out either by unsubscribing in "My
                          Account" or by contacting the customer service.
                          <br />
                          4.2 User on registration shall be allowed to select
                          and book the required locker for the duration required
                          by the user.
                          <br /> 4.3 Tuckit will send booking confirmation,
                          cancellation, payment confirmation, refund status,
                          schedule change or any such other information relevant
                          for the transaction or booking made by the User, via
                          SMS, internet-based messaging applications like
                          WhatsApp, voice call, e-mail or any other alternate
                          communication detail provided by the User at the time
                          of booking.
                          <br />
                          4.4 Pick-up Option- The User will have to select the
                          method of Retrieval either using an OTP (One Time
                          Password) or using an Passkey incase the Users stores
                          the electronic device (including mobile phone).
                          <br />
                          4.5 The User hereby unconditionally consents that such
                          communications via SMS, OTP, internet-based messaging
                          applications like WhatsApp, voice call, email or any
                          other mode are:
                          <br />
                          a. upon the request and authorization of the User;{" "}
                          <br /> b. ‘transactional’ and not an ‘unsolicited
                          commercial communication’ as per the guidelines of
                          Telecom Regulation Authority of India (TRAI), and{" "}
                          <br /> c. in compliance with the relevant guidelines
                          of TRAI or such other authority in India and abroad.
                          <br />
                          <b>5. USER ACCOUNTS </b>
                          5.1 Tuckit may collect user data including name,
                          email-id, contact details, biometric information etc.
                          to facilitate the Service by creating a unique account
                          of the User or by identifying the User by any means as
                          deemed fit by Tuckit. The collection, verification,
                          audit and maintenance of correct and updated User
                          information is a continuous process and Tuckit
                          reserves the right, at any time, to take steps
                          necessary to ensure User’s compliance with all
                          relevant and applicable KYC requirements, if any.
                          <br />
                          5.2 It is assumed that all information provided by the
                          User for accessing and using the Application and the
                          Service, is correct accurate and up to date. Tuckit
                          may verify the information that User have provided and
                          choose to refuse the Service without providing
                          reasons. Also, Tuckit reserves the right to terminate
                          its Service on account of misuse and misrepresentation
                          of any information provided by the User.
                          <br />
                          5.3 User account bearing details provided by the User
                          are created and owned by Tuckit. Any access to the
                          Application and the Service may be revoked without
                          prior notice in the event of suspicious account
                          activity or malafide intent/conduct of the User. In
                          the case where the system is unable to establish
                          unique identity of the User against the details
                          provided to Tuckit, the Service may be denied to the
                          User. Tuckit reserves the full discretion to suspend a
                          User's account in the above event and does not have
                          the liability to share any account information
                          whatsoever.
                          <br />
                          <b>6. LICENSE </b> Tuckit grants you a non-exclusive,
                          non-transferable end user license right to access and
                          use the Application as per these Terms. Tuckit
                          reserves all rights not expressly granted to you in
                          these Terms. The Application is protected by copyright
                          and other intellectual property laws and treaties.
                          Tuckit or its suppliers own the title, copyright and
                          other intellectual property rights in the Application.
                          The Application is licensed, not sold.
                          <br />
                          <b>7. CONSENT TO USE OF DATA </b> By using the
                          Application and/or the Service, you agree to the use
                          of your information in accordance with the Privacy
                          Policy available on the Application.
                          <br />
                          <b> 8. DISCLAIMER OF WARRANTIES </b> You acknowledge
                          the Application is provided on "as is" basis and
                          without warranty of any kind, express or implied, and
                          to the maximum extent permitted by Applicable Law.
                          Neither Tuckit, its licensors or affiliates, nor the
                          copyright holders make any representations or
                          warranties, express or implied, including but not
                          limited to the warranties of merchantability or
                          fitness for a particular purpose or that the
                          Application will not infringe any third party
                          Intellectual Property rights. There is no warranty by
                          Tuckit or by any other party that the functions
                          contained in the Application will meet your
                          requirements or that the operation of the Application
                          and the Service will be uninterrupted or error-free.
                          You assume all responsibility and risk for the access
                          and use of the Application and Service to achieve your
                          intended results. Tuckit shall not be liable for
                          inability of the User to access the Application or
                          Service due to reasons beyond the control of Tuckit or
                          due to reasons attributable to third parties such as
                          power networks, mobile phone network, data system
                          operators, landlords of the premises hosting the
                          Service or any other third parties.
                          <br />
                          <b>9. USAGE CONDITIONS </b>
                          9.1 Users agree to use the Application and Service
                          only for purposes that are permitted by a) these Terms
                          and b) any Applicable Laws as amended from time to
                          time and being in force.
                          <br />
                          9.2 By using the Application and Service; You agree
                          not to:
                          <br />
                          (i) authorize others to use your account or the
                          Service on your behalf (except for any third parties
                          expressly authorized by User);
                          <br />
                          (ii) assign or otherwise transfer Your account to any
                          third person or legal entity;
                          <br />
                          (iii) use the Application and Service for storage of
                          perishable items or for unlawful purposes, including
                          but not limited to sending or storing any unlawful
                          material or for fraudulent purposes;
                          <br />
                          (iv) store any hazardous materials, including
                          contraband, drugs, weapons, arms, or radioactive
                          substances belongings, which can create any hazard or
                          nuisance to Tuckit or to any of its customers
                          <br />
                          (v) use the Application and Service to cause nuisance,
                          annoyance or inconvenience;
                          <br />
                          (vi) impair the proper operation of the network and/or
                          interfere with or disrupt the integrity or performance
                          of the Application and Service;
                          <br />
                          (vii) reverse engineer or access the Application and
                          Service in order to design or build a competitive
                          product or service, design or build a product using
                          similar ideas, features, functions or graphics of the
                          Application and Service;
                          <br />
                          (viii) launch an automated program or script,
                          including, but not limited to, web spiders, web
                          crawlers, web robots, web ants, web indexers, bots,
                          viruses or worms, or any program which may make
                          multiple server requests per second, or unduly burdens
                          or hinders the operation and/or performance of the
                          Application and Service;
                          <br />
                          (ix) try to harm the Application and Service in any
                          way whatsoever;
                          <br />
                          (x) disclose information designated as confidential by
                          Tuckit, without Tuckit’s prior written consent; and
                          <br />
                          (xi) copy or distribute the Application and Service or
                          other Tuckit content without written permission from
                          Tuckit.
                          <br />
                          You are solely responsible for any breach of your
                          obligations under these Terms (including financial
                          obligations) and for the consequences (including any
                          loss or damage which Tuckit may suffer) as a result
                          any such breach.
                          <br />
                          You agree to defend, indemnify and hold harmless
                          Tuckit, its employees, directors, officers, agents and
                          their successors and assigns from and against any and
                          all claims, liabilities, damages, losses, costs and
                          expenses, including attorney's fees, caused by or
                          arising out of claims based upon your actions or
                          inactions, which may result in any loss or liability
                          to Tuckit or any third party including but not limited
                          to breach of any warranties, representations or
                          undertakings or in relation to the non-fulfilment of
                          any of your obligations under this User Agreement or
                          arising out of the your violation of any applicable
                          laws, regulations including but not limited to
                          Intellectual Property Rights, payment of statutory
                          dues and taxes, claim of libel, defamation, violation
                          of rights of privacy or publicity, loss of service by
                          other subscribers and infringement of intellectual
                          property or other rights. This clause shall survive
                          the expiry or termination of this User Agreement.
                          <br />
                          9.3 Payment Conditions
                          <br />
                          (i) The access to the Service is granted on ‘pre-paid’
                          basis i.e., the User will be required to pay charges
                          as prescribed by Tuckit, in advance for the access to
                          the Service. The charges as applicable from time to
                          time, shall be displayed on the interface provided by
                          Tuckit and the same shall be [exclusive / inclusive]
                          of goods and services tax.
                          <br />
                          (ii) In the event the User uses the Service for a time
                          period in excess of the time period originally booked
                          by the User for any reason whatsoever, the User shall
                          be obligated to pay for such excess time period in
                          order to access the Service.
                          <br />
                          (iii) Users shall be entitled to make payments for the
                          Service through payment gateways as authorised by
                          Tuckit or Unified Payments Interface (UPI).
                          <br />
                          (iv) In the event any other payment options are
                          integrated with the Application or the Service, such
                          payments option shall be made available to the User at
                          the discretion of Tuckit.
                          <br />
                          (v) Tuckit reserves the rights to proceed against you
                          in any manner as Tuckit may deem fit (including but
                          not limited to any court process) as per Applicable
                          Law in relation to any amounts due.
                          <br />
                          9.4 User further agrees to:
                          <br />
                          (i) have understood the contract and terms and
                          conditions laid therein with Tuckit for Application
                          and Service usage and you have clearly understood the
                          terms related to the Service;
                          <br />
                          (ii) use the Services for personal purpose only
                          (applicable in case of individuals) or authorized
                          purpose only (applicable to business entities,
                          organizations and body corporate) ;
                          <br />
                          (iii) use an access point or 3G/4G/5G data account and
                          telephone networks which you are authorized to use;
                          <br />
                          (iv) keep account information confidential or any
                          other identification provided by Tuckit which allows
                          access to the Service and the Application;
                          <br />
                          (v) provide with proof of identity/contact
                          details/address reasonably requested by Tuckit;
                          <br />
                          (vi) comply with all Applicable Law while using the
                          Application and Service; and
                          <br />
                          (vii) not access or attempt to access the Service by
                          any means other than through the interface that is
                          provided by Tuckit.
                          <br />
                          (viii) access the Service as per timings and
                          additional conditions prescribed by third-parties
                          premises where the Service is offered.
                          <br />
                          9.5 The User shall be allowed to access the Service to
                          keep the items under storage for not more than 24
                          consecutive hours, at one instance (“Time Limit”). The
                          User shall be allowed to access the Service twice for
                          storage and once for retrieval, within the Time Limit.
                          Tuckit shall alert the User regarding expiry of the
                          Time Limit by way of SMS or electronic communication
                          30 (thirty) minutes prior to the expiry of the Time
                          Limit (“Alert”) and provide the option to (a) extend
                          the Time Limit by making payment for the extended Time
                          Limit, before each instance of such expiry or (b)
                          retrieve the items placed under storage upon making
                          payment for the Time Limit or the extended Time Limit,
                          as the case may be. In the event the User fails to
                          extend the Time Limit and retrieve the items placed
                          under storage, Tuckit shall allow the use of Service
                          for storage of items up to a maximum of 72 (seventy
                          two) consecutive hours from the last Alert sent to the
                          User (“Additional Time Limit”) and the User shall have
                          the option to retrieve the items placed under storage
                          within the Additional Time Limit upon making payment
                          for the actual hours of usage of the Service.
                          <br />
                          9.6 In the event the User keeps the items in storage
                          under the Service, for a period exceeding the
                          Additional Time Limit, Tuckit shall send an Alert to
                          the User and provide the User with the following
                          options – (a) removal of the items from the Service
                          and retention of custody of the same by Tuckit for the
                          purpose of collection of such items by the User at a
                          later date as agreed by Tuckit and subject to an
                          additional retrieval charge or (b) disposal of the
                          items under storage, by Tuckit without any liability
                          whatsoever to the User. Any failure on part of the
                          User to elect the aforementioned options (a) and (b)
                          within the prescribed time period, shall be deemed to
                          be an authorization to Tuckit for disposal of the
                          items under storage, by Tuckit without any liability
                          whatsoever to the User.
                          <br />
                          9.7 The applicable charges (except the additional
                          retrieval charge) for access to the Service shall on
                          half hourly basis on such rates as displayed by Tuckit
                          on the interface provided to the User, from time to
                          time, regardless of the actual time of usage of the
                          Service.
                          <br />
                          9.8 The User shall not be entitled to any refund for
                          retrieval of the items under storage within the Time
                          Limit or Additional Time Limit, as the case may be.
                          <br />
                          9.9 Each User shall be allocated single locker/pod at
                          a time as a part of the Service, and such User shall
                          be allowed to place not more than 1 (one) item under
                          storage in such locker/pod.
                          <br />
                          9.10 The User shall authorize to use only the
                          locker/pod allocated to the User as a part of the
                          Service and Tuckit shall not be liable for loss of or
                          damage to items placed in a locker/pod not allocated
                          to the User.
                          <br />
                          9.11 The User shall be solely responsible for
                          closing/locking the locker/pod after placing items
                          under storage and Tuckit shall not be liable for loss
                          of or damage to items placed in a locker/pod if the
                          User fails to close/lock the locker after placing
                          items under storage.
                          <br />
                          9.12 Tuckit reserves the right to immediately
                          terminate the Service and the use of the Application,
                          should you not comply with any of the above terms.
                          <br />
                          9.13 In the event the User is unable to access the
                          Service or has reason to believe that the Service has
                          malfunctioned or that the Service is affected
                          adversely due to any technical issue which is directly
                          attributable to Tuckit, the User may contact Tuckit at
                          [---].
                          <br />
                          <b>
                            10. ARRANGEMENT BETWEEN YOU AND THE PAYMENT GATEWAY
                          </b>{" "}
                          10.1 All payments are processed using a payment
                          gateway or appropriate payment system infrastructure
                          and the same will also be governed by the terms and
                          conditions agreed to between You and the respective
                          and the payment gateway.
                          <br />
                          10.2 All online bank transfers from valid bank
                          accounts are processed using the gateway provided by
                          the third parties which support payment facility to
                          provide these services to you. All such online bank
                          transfers on payment facility are also governed by the
                          terms and conditions agreed to between you and the
                          third party.
                          <br />
                          <b>11. NO LIABILITY FOR ITEMS IN STORAGE </b> The User
                          understand and agrees the items placed in storage
                          under the Service are at the sole and entire risk of
                          the User and that by opting for the Service, the User
                          shall not hold Tuckit liable or responsible in respect
                          of any loss or damages cause to the items in storage
                          under the Service or for any reason whatsoever
                          including but not limited to the User's
                          non--compliance with these Terms, malfunction, partial
                          or total failure of any network terminal, data
                          processing system, computer telecom transmission or
                          telecommunications system or other circumstances
                          whether or not beyond the control of Tuckit or any
                          person or any organization involved in the above
                          mentioned systems. Provided that the Tuckit will only
                          be liable in the event the loss or damages cause to
                          the items in storage under the Service are solely
                          attributable to Tuckit (excluding perishable items or
                          items required to be stored under special conditions
                          e.g. temperature or humidity control).
                          <br />
                          <b>12.MISUSE OF SERVICE </b> The User agrees to not
                          access or use the Service and Application or any
                          components or elements comprised in the Service and
                          Application including but not limited to the lockers
                          and pods, in contravention of these terms and
                          Applicable Laws. The User agrees not to damage or
                          cause harm to the Service or any components or
                          elements comprised in the Service and Application or
                          abandon the items placed in storage under the Service
                          and holds Tuckit harmless in respect of the said items
                          and indemnifies Tuckit in respect of any costs or
                          liability arising upon Tuckit due to misuse of the
                          Service or abandonment of items placed in storage
                          under the Service or from any damage or harm to the
                          Service and the Application or any components or
                          elements comprised in the Service and the Application.
                          Tuckit may communicate or contact the User in the
                          event of abandonment of the Service or items placed in
                          storage under the Service, not more than two times and
                          if there is no response from the User, Tuckit shall
                          not be liable for the items placed in storage under
                          the Service.
                          <br />
                          <b>13. SECURITY </b> The User understands and agrees
                          that the Service is made available to the Users at
                          third-party premises and shall be subject to security
                          measures applied by Tuckit and such third-parties
                          including but not limited to surveillance by means of
                          close-circuit cameras to prevent instances of general
                          vandalism and misuse of the Service and the User
                          agrees and consents to abide by any such security
                          measures by Tuckit or such third parties and agrees
                          that such security measures do not constitute any
                          infringement upon the privacy of the User.
                          <br />
                          <b>14.REFUND </b> The User shall not be entitled for
                          refund of amounts paid in respect of the Service
                          availed by the User wherein the User has used the
                          Service for a time less than the time opted by the
                          User. The User shall only be entitled to refund of any
                          incremental amounts paid to Tuckit due to billing
                          errors, within a period of 7 to 10 days from the date
                          of the User raising a refund request with Tuckit.
                          <br />
                          <b>
                            {" "}
                            15. COMPLIANCE WITH COURT OR GOVERNMENT ORDERS{" "}
                          </b>{" "}
                          In the event Tuckit is required to disclose the
                          particulars of items under storage or grant access to
                          the items under storage to any governmental
                          authorities pursuant to any investigation process,
                          court or government orders, Tuckit shall comply with
                          such investigation process, court or government orders
                          and shall not liable to the User for such disclosure
                          or grant of access.
                          <br />
                          <b>16. AUTHENTICATION </b>16.1 In order to provide
                          access to the Service to the User, Tuckit shall
                          authenticate the User by means of sending
                          one-time-password number (OTP) to the User or through
                          biometric (fingerprint) identification of the User. In
                          the event the User fails to submit the correct OTP or
                          identify himself by means of biometric information by
                          more than 2 (two) times and fails to authenticate
                          itself, the access to Service shall be suspended for 2
                          (two) hours. The Service will only be resumed upon
                          submission of the correct OTP or biometric
                          identification to Tuckit by the User and payment of
                          amounts due, if any, by the User.
                          <br />
                          16.2 The User shall have the option of nominating any
                          other person on behalf of the User to access the
                          Service, provided such access to the Service shall be
                          granted by Tuckit only upon authentication of such
                          person by means of sending one-time-password number
                          (OTP) to the User. Upon authentication, any actions or
                          inactions on the part of such person with regards to
                          the Service or access thereof shall be deemed to that
                          of the User and the User shall be wholly liable for
                          such actions of inactions of the said person or any
                          breach of these Terms by the said person. For the
                          purpose of these terms, such other person shall be
                          deemed to be the agent of the User and the User shall
                          be liable for any actions of such other person.
                          <br />
                          <b>17. FORCE MAJEURE </b> Any delay or failure to
                          provide access to the Application and Service
                          hereunder shall be excused if and to the extent caused
                          by the occurrence of a Force Majeure. For the purposes
                          of this Agreement, “Force Majeure” shall mean a cause
                          or event that is not reasonably foreseeable or not
                          otherwise caused by or under the control of the Party
                          claiming Force Majeure, including acts of God, fires,
                          floods, explosions, riots, wars, hurricane, epidemics,
                          sabotage, terrorism, vandalism, accident, restraint of
                          government, governmental acts, injunctions, labour
                          strikes, internet outage, power outage, network
                          failure, failure of components/cables/subsystems and
                          other like events that are beyond the reasonable
                          control of Tuckit affected thereby, despite the
                          Tuckit's reasonable efforts to prevent, avoid, delay,
                          or mitigate the effect of such acts, events or
                          occurrences, and which events or the effects thereof
                          are not attributable to the Tuckit's failure to
                          provide access to the Application and Service.
                          <br />
                          <b>18. LIMITATION OF LIABILITY </b>It is agreed that
                          Tuckit and its affiliates, employees, directors,
                          agents shall not be liable, for any direct, indirect,
                          incidental, consequential, punitive damages
                          (including, without limitation, lost profits, cost of
                          procuring substitute service, loss of opportunity), or
                          any peril to the life and limb, however caused to the
                          User, arising out of access to Application and
                          Service. In the event of any loss or damages caused to
                          the User due to actions solely attributable to Tuckit,
                          the liability of the Tuckit shall be limited to the
                          consideration paid by the User in relation to access
                          and use of the Service.
                          <br />
                          <b>19.SEVERABILITY </b> If any provision of this
                          Agreement is held by a court of competent jurisdiction
                          to be invalid, illegal, or unenforceable, then the
                          remainder of this Agreement shall remain in full force
                          and effect. In the event any such provision previously
                          held to be invalid, illegal, or unenforceable, is
                          thereafter held by a court of competent jurisdiction
                          to be valid, legal, or enforceable, then said
                          provision shall automatically be revived and
                          incorporated into this Agreement.
                          <br />
                          <b>20. GOVERNING LAW AND JURISDICTION </b> This
                          Agreement, all transactions executed hereunder, and
                          the legal relations between the Parties shall be
                          governed and construed solely in accordance with the
                          laws of India and the courts of Bengaluru shall have
                          exclusive jurisdiction.
                          <br />
                          <b>21. ENTIRE AGREEMENT </b>
                          These Terms along with the Privacy Policy available at
                          www.tuckpod.com, constitute the complete and exclusive
                          understanding and agreement of the Parties and
                          supersede all prior understandings and agreements,
                          whether written or oral, with respect to the subject
                          matter herein.
                          <br />
                          <b>22. TERMINATION </b> These Terms are effective
                          until terminated. Your rights under these Terms will
                          terminate automatically without notice from Tuckit if
                          you fail to comply with these Terms. Upon termination
                          of these Terms, you must cease all use of the
                          Application and Service. If you wish to terminate
                          these Terms, you may discontinue the access and use of
                          the Application and Service..
                          <br />
                          <b>23. INDEMNITY </b> Tuckit may vary or amend,
                          modify, or change the Terms at its discretion and
                          without any notice or cause, at anytime, periodically,
                          without the Users consent. By continuing to use any
                          Service after any amendment,modification, or change,
                          the User has agreed to be bound by all such
                          amendments, modifications, and changes. The User must
                          carefully review this Agreement on a regular basis to
                          maintain awareness of all amendments, modifications,
                          and changes. Whenever a change is made to the Terms,
                          Tuckit will post a notification on the Application.
                          <br />
                          <b>24. CHANGES TO THE TERMS </b> Intellectual Property
                          Rights for the purpose of this Terms shall always mean
                          and include copyrights whether registered or not,
                          patents including rights of filing patents,
                          trademarks, trade names, trade dresses, house marks,
                          collective marks, associate marks and the right to
                          register them, designs both industrial and layout,
                          geographical indicators, moral rights, broadcasting
                          rights, displaying rights, distribution rights,
                          selling rights, abridged rights, translating rights,
                          reproducing rights, performing rights, communicating
                          rights, adapting rights, circulating rights, protected
                          rights, joint rights, reciprocating rights,
                          infringement rights. All those Intellectual Property
                          rights arising as a result of domain names, internet
                          or any other right available under applicable law
                          shall vest in the domain of Company as the owner of
                          such domain name. The Parties hereto agree and confirm
                          that no part of any Intellectual Property rights
                          mentioned hereinabove is transferred in the name of
                          User and any intellectual property rights arising as a
                          result of these presents shall also be in the absolute
                          ownership, possession and Our control or control of
                          its licensors, as the case may be.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="info"
                          variant="outlined"
                          onClick={handleClose}
                          autoFocus
                        >
                          OK
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {btnActive ? (
                      <div className="btn-container">
                        <Button
                          variant="contained"
                          type="button"
                          className="mui-btn-color"
                          onClick={(e) => sendOtpFun(e)}
                          endIcon={<PhonelinkLockIcon />}
                          fullWidth
                        >
                          {language.LoginPage.otpBtn} &nbsp;&nbsp;&nbsp;
                        </Button>
                      </div>
                    ) : (
                      <div className="btn-container">
                        <LoadingButton
                          loading
                          loadingPosition="end"
                          endIcon={<SaveIcon />}
                          variant="contained"
                          fullWidth
                        >
                          {language.LoginPage.otpBtn}
                          {/* generating otp... */}
                        </LoadingButton>
                      </div>
                    )}
                  </>
                </Box>
              </div>
            </div>
          </div>
        </div>
      )}

      <>
        <Dialog
          open={isMessgeTypeDialogueOpen}
          onClose={closeMessageTypeDailogue}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ textAlign: "center", minWidth: 300, color: "#1E367B" }}
          >
            {"Get OTP Using"}
            <hr style={{ margin: 5, padding: 0 }} />
          </DialogTitle>
          <DialogContent style={{ marginTop: -10 }}>
            <DialogContentText id="alert-dialog-description">
              <>
                <Button
                  variant="outlined"
                  onClick={() => askForDefaultGenerateOtpType("sms")}
                  sx={{
                    color: "#F17829",
                    borderColor: "#1E367B",
                    mt: 1,
                    backgroundColor: "#e6f9ff",
                  }}
                  endIcon={<EmailIcon color="primary" />}
                  fullWidth
                >
                  <b>SMS</b>
                </Button>

                <>
                  <Typography component={"p"} style={{ textAlign: "center" }}>
                    OR
                  </Typography>
                </>

                <Button
                  variant="outlined"
                  onClick={() => askForDefaultGenerateOtpType("whatsapp")}
                  sx={{
                    color: "#F17829",
                    borderColor: "#1E367B",
                    mb: 2,
                    backgroundColor: "#e6f9ff",
                  }}
                  endIcon={<WhatsAppIcon color="primary" />}
                  fullWidth
                >
                  <b>Whatsapp</b>
                </Button>
              </>
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={closeMessageTypeDailogue}>Disagree</Button>
            <Button onClick={askForDefaultGenerateOtpType} autoFocus>
              Agree
            </Button>
          </DialogActions> */}
        </Dialog>
      </>
    </div>
    // </div>
  );
}

export default LoginPage;
