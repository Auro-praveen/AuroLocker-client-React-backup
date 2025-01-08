import React, { useEffect, useRef, useState } from "react";
import "./submitLocks.css";
import { Grid } from "@material-ui/core";
import Col from "react-bootstrap/Col";
import { useAuth } from "../GlobalFunctions/Auth";
import Button from "@mui/material/Button";
import ErrorIcon from "../utils/error.png";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import serverUrl from "../GlobalVariable/serverUrl.json";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import YLogo from "../logos/logo_yellow.png";
import CloseIcon from "@mui/icons-material/Close";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Snackbar from "@mui/material/Snackbar";
import { Stack } from "@mui/material";
import { Alert } from "@mui/material";
import { Collapse } from "@mui/material";
import { containerClasses } from "@mui/system";
import { useNavigate } from "react-router-dom";
import razorpayKey from "../GlobalVariable/rPay.json";
import { isSafari } from "react-device-detect";

const MuiAlert = React.forwardRef(function MuiAlert(props, ref) {
  return <Alert elevation={3} ref={ref} variant="filled" {...props} />;
});

/*

  Auther Praveekumar
    view all entered details
    checks if user selected lock is already occupied if not then renders to the razorpay payment gateway
    after first attempt fail, they can post pay and secure their lock
    if payment is done and not verified ( happens rare ) there is button to verify payment

    last modified November-28 2023 by praveen

*/

function SubmitLock(props) {
  const Auth = useAuth();
  const navigate = useNavigate();
  const [userSelectedLock, setUserSelectedLock] = useState({
    TransactionId: Auth.userDetails.TransactionId,
    MobileNo: Auth.userDetails.MobileNo,
    terminalID: Auth.userDetails.terminalID,
    dob: Auth.userDetails.dob,
    cname: Auth.userDetails.userName,
    itemstored: Auth.userDetails.itemstored,
  });

  const subscriptionType = Auth.subscriptionType;

  const [verifyPayment, setVerifyPayment] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitBtnStatus, setSubmitBtnStatus] = useState(false);
  const [errorWindowStat, setErrorWindowStat] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [verifyPaymentButtonStatus, setVerifyPaymentButtonStatus] =
    useState(false);

  const [successAlertHandler, setSuccessAlertHandler] = useState({
    openSuccessAlert: false,
    vertical: "top",
    horizontal: "center",
  });

  const [errorAlertHandler, setErrorAlertHandler] = useState({
    openErrorAlert: false,
  });

  const [isPayWhileretrieveClick, setIsPayWhileRetrieveClick] = useState(false);

  const { openSuccessAlert, vertical, horizontal } = successAlertHandler;
  const [openPaymentAlert, setOpenPaymentAlert] = useState(false);

  const { openErrorAlert } = errorAlertHandler;

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [
    onSubscriptionTypeProceedLoading,
    setOnSubscriptionTypeProceedLoading,
  ] = useState(false);

  // praveen modified nov 2023
  // const amountIncGST = Number(
  //   Math.round(props.pricePerHour) * (Auth.userDetails.GSTAmount / 100) +
  //     Math.round(props.pricePerHour)
  // );

  // praveen 2024 october

  const amountIncGST = Number(
    Number(props.pricePerHour) * (Number(Auth.userDetails.GSTAmount) / 100) +
      Number(props.pricePerHour)
  );

  const totAmountIncludingBalance =
    Number(Auth.existingUserBalanceAmount) +
    // Number(Math.round(props.pricePerHour));
    Number(amountIncGST);

  // console.log("==========================");
  // console.log(totAmountIncludingBalance);
  // console.log(amountIncGST);
  // console.log(Auth.userDetails.GSTAmount);
  // console.log("==========================");

  // console.log(Auth.userDetails.itemstored)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const timeIterval = useRef();

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  // useEffect(() => {
  //   window.addEventListener("beforeunload", (event) => {
  //     event.preventDefault();
  //     return (event.returnValue =
  //       "Do not refresh the page, All Details will be lossed");
  //   });
  // });

  const pageStates = props.verifyDocStatus;

  let noOfHours = Math.floor(props.noOfHours / 60);
  let andMinutes = props.noOfHours % 60;
  if (andMinutes === 60) {
    noOfHours = noOfHours + 1;
    andMinutes = andMinutes * 0;
  }

  const confirmBookForm = (e, payType) => {
    closePaymentAlert();
    let passcode;
    if (props.passcode.length === 0) {
      passcode = Auth.passcode;
    } else {
      passcode = props.passcode;
    }

    e.preventDefault();

    const confirmLockObj = {
      ...userSelectedLock,
      passcode: passcode,
      LockerNo: props.userSelected,
      PacketType: "stlockcnf",
      hours: props.noOfHours,
      amount: props.pricePerHour,
      // amount: amountIncGST,
      Balance: 0,
      DevTime: getCurrentTime(),
    };

    setUserSelectedLock({
      ...userSelectedLock,
      ...confirmLockObj,
    });

    fetchFinalDataBeforePayment(confirmLockObj, payType);
  };

  const confirmBookingForBalanceUser = (e, payType) => {
    closePaymentAlert();
    let passcode;
    if (props.passcode.length === 0) {
      passcode = Auth.passcode;
    } else {
      passcode = props.passcode;
    }

    e.preventDefault();
    const confirmLockObj = {
      ...userSelectedLock,
      passcode: passcode,
      LockerNo: props.userSelected,
      PacketType: "stlockcnf",
      hours: props.noOfHours,
      amount: props.pricePerHour,
      Balance: Auth.existingUserBalanceAmount,
      DevTime: getCurrentTime(),
    };

    setUserSelectedLock({
      ...userSelectedLock,
      ...confirmLockObj,
    });

    fetchFinalDataBeforePayment(confirmLockObj, payType);
  };

  const obj = {
    orderId: "order_NEWAeuGSwkj6HE",
    totAmount: "3000",
    GSTAmount: "16.0",
    URL: "Empty",
    responseCode: "LOCKAVS-200",
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  // const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";
  // const fetchBeforPaymentUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/PaymentStatusBefor";

  const fetchFinalDataBeforePayment = (statusBefore, payType) => {
    console.log(statusBefore);
    setSubmitBtnStatus(true);
    fetch(/*fetchBeforPaymentUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(statusBefore),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "LOCKAVS-200") {
          if (data.orderId.toLowerCase() !== "none") {
            setOrderId(data.orderId);
            if (payType === "pay") {
              razorPayPayment(data.orderId, data.totAmount, statusBefore);
            } else {
              const obj = {
                orderId: data.orderId,
                ...statusBefore,
              };
              payLaterSubmission(obj, "paylater");
            }
          } else {
            // changed here by prvn august 27 2024

            if (subscriptionType === "RENT") {
              const subscriptionTypeObj = {
                ...statusBefore,
                PacketType: "stopenloc",
                responseCode: "paymentSuccess",
                Subscriptiontype: subscriptionType,
                orderId: "NONE",
              };

              ConfirmPaymentDetails(subscriptionTypeObj);
            } else {
              alert("something went wrong");
              setSubmitBtnStatus(false);
            }
          }
        } else if (data.responseCode === "LOCKAVF-201") {
          setSubmitBtnStatus(false);
          setErrorWindowStat(true);
          setOnSubscriptionTypeProceedLoading(false);

          Auth.busyLockerFunction(statusBefore.LockerNo);
          setSubmitBtnStatus(true);
          // if (onSubscriptionTypeProceedLoading) {
          //   setOnSubscriptionTypeProceedLoading(false);
          // }
        } else {
          alert("something went wrong");
          setSubmitBtnStatus(false);
          if (onSubscriptionTypeProceedLoading) {
            setOnSubscriptionTypeProceedLoading(false);
          }
        }
      })
      .catch((err) => {
        setSubmitBtnStatus(false);
        if (onSubscriptionTypeProceedLoading) {
          setOnSubscriptionTypeProceedLoading(false);
        }
        console.log("err :" + err);
      });
  };

  // const url = "https://api.razorpay.com/v1/orders ";

  const razorPayPayment = (orderId, totAmount, status) => {
    // setCount((count) => count + 1);
    console.log("from server inside razor pay : " + totAmount);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    console.log("inside function ");
    var options = {
      key: razorpayKey.key,
      amount: totAmount,
      currency: "INR",
      image: "../logos/logo_yellow.png",
      order_id: orderId,
      name: "Tuckit.in",
      description: "secured payment here",
      redirect: true,
      // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",

      prefill: {
        name: userSelectedLock.userName,
        email: "payments@tuckpod.com",
        contact: userSelectedLock.MobileNo,
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#0e4a1e",
      },

      handler: function (response) {
        console.log("inside handler dec 03 before");
        console.log("inside response function" + response);
        if (
          response.razorpay_payment_id &&
          response.razorpay_order_id &&
          response.razorpay_signature
        ) {
          let timeLeft = 10;
          const interval = setInterval(() => {
            if (timeLeft === 0) {
              clearInterval(interval);
            }
            timeLeft = timeLeft - 1;
            console.log(timeLeft);
          }, 1000);

          // setCount((count) => count + 1);
          setCount(0);

          const paymentSuccess = {
            ...status,
            PacketType: "stopenloc",
            responseCode: "paymentSuccess",
            orderId: orderId,
            razorpayId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          // praveen changed here august 16

          setCount(0);
          clearInterval(timeIterval.current);
          ConfirmPaymentDetails(paymentSuccess);
        } else {
          console.log("inside handler dec 03 elsee");
        }

        console.log("inside handler dec 03");
        // else {
        //   setIsSuccess(false);
        //   setIsError(true);
        //   setCount((count) => count + 1);
        //   let timeLeft = 11;
        //   const interval = setInterval(() => {
        //     if (timeLeft === 0) {
        //       clearInterval(interval);
        //     }
        //     timeLeft = timeLeft - 1;
        //     console.log(timeLeft);
        //   }, 1000);

        //   const paymentSuccess = {
        //     ...status,
        //     PacketType: "stopenloc",
        //     responseCode: "payFailCancel",
        //     orderId: orderId,
        //   };
        //   ConfirmPaymentDetails(paymentSuccess);
        //   setSubmitBtnStatus(false);
        // }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    // paymentObject.createElement()
    // setIsSuccess(false);
    // setIsError(true);
    // setCount((count) => count + 1);

    let timeLeft = 12;
    console.log(count);
    timeIterval.current = setInterval(() => {
      if (timeLeft <= 0) {
        setVerifyPayment(true);
        setCount((count) => count + 1);
        clearInterval(timeIterval.current);
      }
      timeLeft = timeLeft - 1;
    }, 1000);

    setSubmitBtnStatus(false);
  };

  // const confirmSeatUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/PaymentStatusHandler";
  const ConfirmPaymentDetails = (status) => {
    setSubmitBtnStatus(true);
    setVerifyPaymentButtonStatus(true);
    setIsPayWhileRetrieveClick(true);

    fetch(/*confirmSeatUrl*/ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-type":"application/json"
      },
      body: JSON.stringify(status),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "LOCKOPEN-200") {
          // alert(" inside lock open responseCode :: ")

          setSubmitBtnStatus(false);
          Auth.seatCountFun(1);

          if (Auth.passcode.length < 1) {
            Auth.passcodeHandler(props.passcode);
          }

          // praveen changed here august 17-2023

          if (!isSafari) {
            Auth.userSelectedLockHandler(props.userSelected);
            Auth.handleExistingUserBalanceAmount(null);

            Auth.busyLockerFunction(props.userSelected);
            navigate("/verOpenLock", { replace: true });
          }

          setSubmitBtnStatus(false);
          setVerifyPaymentButtonStatus(false);
          setIsPayWhileRetrieveClick(false);

          // navigate("/success", { replace: true });
        } else if ("LOCKOPENCA-201") {
          alert("Something went wrong");
          setSubmitBtnStatus(false);
          setVerifyPaymentButtonStatus(false);
          setIsPayWhileRetrieveClick(false);
          // alert("inside else after booking ")
        } else {
          alert("Something went wrong");
          setSubmitBtnStatus(false);
          setVerifyPaymentButtonStatus(false);
          setIsPayWhileRetrieveClick(false);
        }
        // setSubmitBtnStatus(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        if (onSubscriptionTypeProceedLoading) {
          setOnSubscriptionTypeProceedLoading(false);
        }
        setSubmitBtnStatus(false);
        setVerifyPaymentButtonStatus(false);
        setIsPayWhileRetrieveClick(false);
      });

    // if browser type is safari it directly renders to success page praveen changed here august 17-2023

    if (isSafari) {
      Auth.userSelectedLockHandler(props.userSelected);
      Auth.handleExistingUserBalanceAmount(null);
      Auth.busyLockerFunction(props.userSelected);
      // props.choosingLocksStatus(props.userSelected);
      Auth.seatCountFun(1);
      navigate("/success", { replace: true });
    }
  };

  const chooseLocksAgainFun = (e) => {
    setSubmitBtnStatus(false);
    setErrorWindowStat(false);
    Auth.busyLockerFunction(props.userSelected);
    props.choosingLocksStatus(props.userSelected);
  };

  const payLaterSubmission = (userDetObj, payType) => {
    let payLater;
    if (payType === "paylater") {
      payLater = {
        ...userSelectedLock,
        ...userDetObj,
        PacketType: "stopenloc",
        responseCode: "payFailPaylater",
      };
    } else {
      payLater = {
        ...userSelectedLock,
        PacketType: "stopenloc",
        responseCode: "payFailPaylater",
        orderId: orderId,
      };
    }

    Auth.storePostPayHandler();

    setIsPayWhileRetrieveClick(true);

    console.log(payLater);
    fetch(/*confirmSeatUrl*/ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-type":"application/json"
      },
      body: JSON.stringify(payLater),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "LOCKOPEN-200") {
          setIsSuccess(true);
          setIsError(false);
          Auth.userSelectedLockHandler(props.userSelected);
          // setSubmitBtnStatus(false);
          Auth.seatCountFun(1);
          if (Auth.passcode.length < 1) {
            Auth.passcodeHandler(props.passcode);
          }
          Auth.busyLockerFunction(props.userSelected);
          navigate("/verOpenLock", { replace: true });

          logoutHandler();
          // navigate("/success", { replace: true });
        } else if (data.responseCode === "LOCKOPENCA-201") {
          setIsSuccess(false);
          setIsError(true);

          logoutHandler();
        } else if (data.responseCode === "LOCKOPENPL-200") {
          navigate("/postpay", { replace: true });
          logoutHandler();
        } else {
          setIsSuccess(false);
          setIsError(true);
          logoutHandler();
        }
        setSubmitBtnStatus(false);
        setIsPayWhileRetrieveClick(true);
      })
      .catch((err) => {
        console.log("err : " + err);
        setSubmitBtnStatus(false);
        setIsPayWhileRetrieveClick(true);
        logoutHandler();
      });
  };

  const logoutHandler = () => {
    // setOpen(true);
    // Auth.logoutHandler();
    setCount(0);
  };

  const closeErrorAlert = () => {
    setIsError(false);
  };

  const closeSuccessAlert = () => {
    setIsSuccess(false);
  };

  const successTimeInterval = useRef();

  const verifyPaymentHandler = () => {
    setVerifyPaymentButtonStatus(true);
    const verifyPaymentObject = {
      PacketType: "verifypaystatus",
      orderId: orderId,
    };

    console.log(verifyPaymentObject);
    fetch(serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(verifyPaymentObject),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "paysuc-200") {
          let time = 5;
          successTimeInterval.current = setInterval(() => {
            console.log("success");
            setSuccessAlertHandler({
              ...successAlertHandler,
              openSuccessAlert: true,
            });
            if (time <= 0) {
              clearInterval(successTimeInterval.current);
            }
            time = time - 1;
          }, 1000);

          const paySuccessObj = {
            ...userSelectedLock,
            PacketType: "stopenloc",
            responseCode: "paymentSuccess",
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: data.razorpayPaymentId,
            razorpaySignature: data.razorpaySignature,
            razorpayId: data.razorpayId,
            orderId: orderId,
          };

          setVerifyPayment(false);
          setVerifyPaymentButtonStatus(false);
          ConfirmPaymentDetails(paySuccessObj);
        } else if (data.responseCode === "payfail-201") {
          console.log("failed");

          setErrorAlertHandler({
            ...errorAlertHandler,
            openErrorAlert: true,
          });

          setVerifyPayment(false);
          setVerifyPaymentButtonStatus(false);
        }
      })
      .catch((err) => {
        console.log("error : " + err);

        setVerifyPaymentButtonStatus(false);
      });
  };

  const onCloseErrorAlert = () => {
    setErrorAlertHandler({
      ...errorAlertHandler,
      openErrorAlert: false,
    });
  };

  const onCloseSuccessAlert = () => {
    setSuccessAlertHandler({
      ...successAlertHandler,
      openSuccessAlert: false,
    });
  };

  // Praveen added 10/27/2023
  const payWhileRetrieveFun = () => {};

  function openPaymentAlertWindow() {
    // console.log("========== called herer herer her eher her ===========");
    setOpenPaymentAlert(true);
  }

  function closePaymentAlert() {
    setOpenPaymentAlert(false);
  }
  return (
    <>
      <Grid
      // container
      // className="row h-100 justify-content-center align-items-center "
      >
        <Grid>
          <Col>
            <div
              className={
                pageStates ? "verify-container" : "verify-container-hidden"
              }
            >
              <div className="paymentgateway-container">
                <div className="backbtn-container">
                  <IconButton
                    className="back-btn"
                    color="secondary"
                    onClick={props.backToPasscode}
                  >
                    <ArrowBackIosIcon fontSize="medium" />
                  </IconButton>
                </div>

                <div className="close-container">
                  <IconButton
                    className="close-btn"
                    color="secondary"
                    onClick={handleClickOpen}
                  >
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                  <br />
                </div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle
                    sx={{
                      textAlign: "center",
                    }}
                    id="responsive-dialog-title"
                  >
                    {language.LockerReservationPage.exitAlert}
                    {/* {"Are You Sure You Want To Leave?"} */}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {language.SelectedLockerData.wanttoleaveApplicationAlert}
                      {/* Are You sure you want to close this application?, All the
                      Details You entered will be lossed */}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleClose}
                    >
                      No
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => Auth.logoutHandler()}
                      autoFocus
                    >
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={openPaymentAlert}
                  onClose={closePaymentAlert}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle
                    sx={{
                      textAlign: "center",
                    }}
                    id="responsive-dialog-title"
                  >
                    {language.LockerReservationPage.payWaitAlert}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {language.LockerReservationPage.payWaitDescription}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={
                        Auth.existingUserBalanceAmount
                          ? (e) => confirmBookingForBalanceUser(e, "pay")
                          : (e) => confirmBookForm(e, "pay")
                      }
                      autoFocus
                    >
                      {language.LockerReservationPage.payNowBtn}
                    </Button>
                  </DialogActions>
                </Dialog>

                <br />
                <div className="verify-formdetails-container">
                  <img
                    className="logo-container"
                    src={YLogo}
                    alt="img"
                    width={100}
                  />
                  <Stack>
                    <Collapse in={isError}>
                      <Alert
                        variant="standard"
                        severity="error"
                        onClose={() => closeErrorAlert()}
                      >
                        {language.VerifyingLockOpen.somethingwentwrongAlert}
                        {/* Something went wrong */}
                      </Alert>
                    </Collapse>

                    <Collapse in={isSuccess}>
                      <Alert
                        variant="standard"
                        severity="success"
                        onClose={() => closeSuccessAlert()}
                      >
                        {language.PaymentSuccessful.YourPaymentSuccessfulMsg}

                        {/* Your payment is successfull */}
                      </Alert>
                    </Collapse>
                  </Stack>

                  <Stack spacing={2} sx={{ width: "100%" }}>
                    <Snackbar
                      open={openErrorAlert}
                      autoHideDuration={3000}
                      onClose={onCloseErrorAlert}
                      anchorOrigin={{ vertical, horizontal }}
                    >
                      <MuiAlert
                        onClose={onCloseErrorAlert}
                        severity="warning"
                        sx={{ width: "100%" }}
                      >
                        {language.PaymentSuccessful.PaymentFailedMsg}
                        {/* Your Payment Failed! Try Again */}
                      </MuiAlert>
                    </Snackbar>
                  </Stack>

                  <Stack spacing={2} sx={{ width: "100%" }}>
                    <Snackbar
                      open={openSuccessAlert}
                      autoHideDuration={3000}
                      onClose={onCloseSuccessAlert}
                      anchorOrigin={{ vertical, horizontal }}
                    >
                      <MuiAlert
                        onClose={onCloseSuccessAlert}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        {language.PaymentSuccessful.PaymentWasSuccess}
                        {/* Your Payement Was successfull! */}
                      </MuiAlert>
                    </Snackbar>
                  </Stack>

                  <h3>{language.SelectedLockerData.VerifyDetails}</h3>
                  {/* <h3>Verify the Details</h3> */}
                  <Box
                    component="form"
                    sx={{
                      // "& .MuiTextField-root": { m: 2, width: "40ch" },
                      "& .MuiTextField-root": { m: 1, width: 280 },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      label={language.SelectedLockerData.terminalIDLbl}
                      value={userSelectedLock.terminalID}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                    <TextField
                      label={language.SelectedLockerData.userName}
                      value={userSelectedLock.cname}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                    <TextField
                      label={language.SelectedLockerData.mobileno}
                      value={userSelectedLock.MobileNo}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                    <TextField
                      label={language.SelectedLockerData.lockerSelected}
                      value={props.userSelected}
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                    <TextField
                      label={language.SelectedLockerData.totalTime}
                      variant="outlined"
                      color="primary"
                      value={noOfHours + " hour " + andMinutes + " minutes"}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                    />
                    {Auth.existingUserBalanceAmount ? (
                      <>
                        <TextField
                          className="Mui-focused"
                          label={language.SelectedLockerData.singleLockerAmount}
                          // label="Amount"
                          value={
                            Number(props.pricePerHour) % 1 === 0
                              ? props.pricePerHour + ".00 Rs"
                              : props.pricePerHour + " Rs"
                          }
                          variant="outlined"
                          color="primary"
                          // helperText="*including GST"
                          InputProps={{
                            readOnly: true,
                          }}
                          focused
                          required
                        />
                        <TextField
                          label={language.SelectedLockerData.BalanceAmount}
                          variant="outlined"
                          color="primary"
                          value={
                            Number(Auth.existingUserBalanceAmount) % 1 === 0
                              ? Auth.existingUserBalanceAmount + ".00 Rs"
                              : Auth.existingUserBalanceAmount + " Rs"
                          }
                          // value={
                          //   Math.round(
                          //     (Number(Auth.existingUserBalanceAmount) +
                          //       Number(Auth.existingUserBalanceAmount) *
                          //         (Auth.userDetails.GSTAmount / 100) +
                          //       Number.EPSILON) *
                          //       100
                          //   ) / 100
                          // }
                          // value={Auth.existingUserBalanceAmount + " Rs"}
                          // helperText="*including GST"
                          InputProps={{
                            readOnly: true,
                          }}
                          focused
                        />

                        {/* Changed here for the purfose of GST calculation (Praveen) nov 2023 */}

                        <TextField
                          // label={language.SelectedLockerData.BalanceAmount}
                          label={Auth.userDetails.GSTAmount + "% added GST"}
                          variant="outlined"
                          color="primary"
                          value={
                            Math.round(
                              (Math.round(
                                (totAmountIncludingBalance +
                                  Number(Auth.existingUserBalanceAmount) *
                                    (Auth.userDetails.GSTAmount / 100) +
                                  Number.EPSILON) *
                                  100
                              ) /
                                100 -
                                Math.round(
                                  (Number(props.pricePerHour) +
                                    Number(Auth.existingUserBalanceAmount) +
                                    Number.EPSILON) *
                                    100
                                ) /
                                  100 +
                                Number.EPSILON) *
                                100
                            ) /
                              100 +
                            " Rs"
                          }
                          // helperText="*including GST"
                          InputProps={{
                            readOnly: true,
                          }}
                          focused
                        />

                        <TextField
                          className="Mui-focused"
                          label={language.SelectedLockerData.totAmount}
                          // value={totAmountIncludingBalance + ".00 Rs"}
                          value={
                            Math.round(
                              (totAmountIncludingBalance +
                                Number(Auth.existingUserBalanceAmount) *
                                  (Auth.userDetails.GSTAmount / 100) +
                                Number.EPSILON) *
                                100
                            ) /
                              100 +
                            " Rs"
                          }
                          variant="outlined"
                          color="primary"
                          helperText="*including GST"
                          InputProps={{
                            readOnly: true,
                          }}
                          focused
                          required
                        />

                        {submitBtnStatus ? (
                          <div className="btn-container">
                            <LoadingButton
                              loading
                              loadingPosition="end"
                              endIcon={<SaveIcon />}
                              variant="contained"
                              color="primary"
                            >
                              {language.SelectedLockerData.proceedBtn}
                              {/* proceed to pay */}
                            </LoadingButton>
                          </div>
                        ) : (
                          <div className="btn-container">
                            <Button
                              type="button"
                              variant="contained"
                              className="mui-btn-color"
                              onClick={() => openPaymentAlertWindow()}
                              // onClick={(e) =>
                              //   confirmBookingForBalanceUser(e, "pay")
                              // }

                              endIcon={<PaymentIcon />}
                              fullWidth
                            >
                              {language.SelectedLockerData.proceedBtn}
                              {/* proceed to pay */}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {subscriptionType !== "RENT" && (
                          <>
                            <TextField
                              className="Mui-focused"
                              // label={language.SelectedLockerData.totalAmount}
                              label="Amount"
                              value={
                                Number(props.pricePerHour) % 1 === 0
                                  ? props.pricePerHour + ".00 Rs"
                                  : props.pricePerHour + " Rs"
                              }
                              variant="outlined"
                              color="primary"
                              // helperText="including GST"
                              InputProps={{
                                readOnly: true,
                              }}
                              focused
                            />

                            <TextField
                              // label={language.SelectedLockerData.BalanceAmount}
                              label={Auth.userDetails.GSTAmount + "% added GST"}
                              variant="outlined"
                              color="primary"
                              value={
                                Math.round(
                                  (Number(props.pricePerHour) +
                                    Number(props.pricePerHour) *
                                      (Auth.userDetails.GSTAmount / 100) -
                                    props.pricePerHour +
                                    Number.EPSILON) *
                                    100
                                ) /
                                  100 +
                                " Rs"
                              }
                              // helperText="*including GST"
                              InputProps={{
                                readOnly: true,
                              }}
                              focused
                            />

                            <TextField
                              className="Mui-focused"
                              label={language.SelectedLockerData.totalAmount}
                              // label="Total Amount"
                              // value={totAmountIncludingBalance + ".00 Rs"}
                              // value={totAmountIncludingBalance + " Rs"}
                              value={
                                Math.round(
                                  (Number(totAmountIncludingBalance) +
                                    Number(Auth.existingUserBalanceAmount) *
                                      (Number(Auth.userDetails.GSTAmount) /
                                        100) +
                                    Number.EPSILON) *
                                    100
                                ) /
                                  100 +
                                " Rs"
                              }
                              variant="outlined"
                              color="primary"
                              helperText="including GST"
                              InputProps={{
                                readOnly: true,
                              }}
                              focused
                            />
                          </>
                        )}

                        {/* <TextField
                          className="Mui-focused"
                          // label={language.SelectedLockerData.totalAmount}
                          label="Total Amount"
                          // value={totAmountIncludingBalance + ".00 Rs"}
                          value={totAmountIncludingBalance + " Rs"}
                          variant="outlined"
                          color="primary"
                          helperText="including GST"
                          InputProps={{
                            readOnly: true,
                          }}
                          focused
                        /> */}

                        {/* Changed here by prveen august 27 2024 */}
                        {subscriptionType === "RENT" ? (
                          <div className="btn-container">
                            <LoadingButton
                              loading={onSubscriptionTypeProceedLoading}
                              loadingPosition="end"
                              endIcon={<SaveIcon />}
                              variant="contained"
                              className={
                                onSubscriptionTypeProceedLoading
                                  ? ""
                                  : "mui-btn-color"
                              }
                              color="primary"
                              onClick={(e) => {
                                setOnSubscriptionTypeProceedLoading(true);
                                confirmBookForm(e, "pay");
                              }}
                              fullWidth
                            >
                              {onSubscriptionTypeProceedLoading
                                ? "waiting for response"
                                : language.SelectedLockerData.confirmBtn}
                              {/* proceed to pay */}
                            </LoadingButton>
                          </div>
                        ) : (
                          <>
                            {" "}
                            {submitBtnStatus ? (
                              <div className="btn-container">
                                <LoadingButton
                                  loading
                                  loadingPosition="end"
                                  endIcon={<SaveIcon />}
                                  variant="contained"
                                  color="primary"
                                >
                                  {language.SelectedLockerData.proceedBtn}
                                  {/* proceed to pay */}
                                </LoadingButton>
                              </div>
                            ) : (
                              <div className="btn-container">
                                <Button
                                  type="button"
                                  variant="contained"
                                  className="mui-btn-color"
                                  // onClick={(e) => confirmBookForm(e, "pay")}
                                  onClick={() => openPaymentAlertWindow()}
                                  endIcon={<PaymentIcon />}
                                  // sx={{
                                  //   "& .MuiTextField-root": { m: 2, width: "300" },
                                  //     // width: 280
                                  // }}
                                  fullWidth
                                >
                                  {language.SelectedLockerData.proceedBtn}
                                  {/* proceed to pay here here here */}
                                </Button>
                              </div>
                            )}
                          </>
                        )}

                        {/* direct button for the pay later in case use wants to pay while retrieve */}
                      </>
                    )}

                    {subscriptionType !== "RENT" && (
                      <>
                        {isPayWhileretrieveClick ? (
                          <div className="btn-container">
                            <LoadingButton
                              loading
                              loadingPosition="end"
                              endIcon={<PendingActionsIcon />}
                              variant="contained"
                              color="primary"
                            >
                              {/* Pay While Retrieve */}
                              {language.SelectedLockerData.paywhileretrive}
                            </LoadingButton>
                          </div>
                        ) : (
                          <div className="btn-container">
                            <Button
                              type="button"
                              variant="contained"
                              className="mui-btn-color-yellow"
                              onClick={(e) => confirmBookForm(e, "paylater")}
                              endIcon={<PendingActionsIcon />}
                              fullWidth
                            >
                              {/* Pay While Retrieve */}
                              {language.SelectedLockerData.paywhileretrive}
                            </Button>
                          </div>
                        )}
                      </>
                    )}

                    {/* {submitBtnStatus ? (
                    <div className="btn-container">
                      <LoadingButton
                        loading
                        loadingPosition="end"
                        endIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                      >
                        proceed to pay
                      </LoadingButton>
                    </div>
                  ) : (
                    <div className="btn-container">
                      <Button
                        type="button"
                        variant="contained"
                        className="mui-btn-color"
                        onClick={(e) => confirmBookForm(e)}
                        endIcon={<PaymentIcon />}
                        fullWidth
                      >
                        proceed to pay
                      </Button>
                    </div>
                  )} */}

                    {verifyPayment && (
                      <>
                        {verifyPaymentButtonStatus ? (
                          <div className="btn-container">
                            <LoadingButton
                              loading
                              loadingPosition="end"
                              endIcon={<VerifiedUserIcon />}
                              variant="contained"
                              color="primary"
                            >
                              {language.VerifyingLockOpen.VerifyPayment}
                              {/* Verifying Payment */}
                            </LoadingButton>
                          </div>
                        ) : (
                          <div className="btn-container">
                            <Button
                              variant="contained"
                              color="secondary"
                              endIcon={<VerifiedUserIcon />}
                              // sx={{
                              //   "& .MuiTextField-root": { m: 2, width: "300" },
                              // //  width: 280
                              // }}

                              onClick={() => verifyPaymentHandler()}
                              fullWidth
                            >
                              {language.VerifyingLockOpen.VerifyingYourPayment}
                              {/* Verify Your Payment */}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </Box>
                </div>

                {submitBtnStatus === false && (
                  <div className="backto-choose-locks">
                    <p className="">
                      {language.VerifyingLockOpen.Backto} {/* back to{" "} */}
                      <Button
                        className="chooseLock-link"
                        variant="text"
                        color="primary"
                        onClick={() => props.choosingLocksStatus()}
                      >
                        {" "}
                        {language.VerifyingLockOpen.ChooseLock}
                        {/* Choose locker.. */}
                      </Button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Grid>
      </Grid>

      {errorWindowStat && (
        <>
          <div className="lockerUnavailable-window"></div>
          <div className="locker-un-wind">
            <img className="error-img-icon" src={ErrorIcon} alt="err-icon" />
            <h2 className="small-window-head">
              {" "}
              {language.VerifyingLockOpen.LockerJustOccupied}{" "}
              {/* locker you choose just occupied{" "} */}
            </h2>
            <h6 className="small-window-desc">
              {" "}
              {language.VerifyingLockOpen.PleaseChooseAnotherLocker}
              {/* please choose another locker{" "} */}
            </h6>
            <div className="buttons-container">
              <Button
                variant="contained"
                color="secondary"
                className="mui-btn-color"
                onClick={() => chooseLocksAgainFun()}
                startIcon={<SwapHorizontalCircleIcon />}
              >
                {language.VerifyingLockOpen.BackToLocker}
                {/* Back To Locker.. */}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* {count >= 3 &&  (
        <>
        {
          !Auth.existingUserBalanceAmount ?
          <>
          <div className="lockerUnavailable-window"></div>
          <div className="payLater-wind">
            <h2 className="item-header">Payment failed</h2>
            <h5 className="item-header">
              Do you want to store now and pay later
            </h5>

            <Button
              variant="contained"
              color="primary"
              className="btn-group"
              onClick={() => payLaterSubmission()}
            >
              store now
            </Button>

            <Button
              variant="contained"
              color="primary"
              className="btn-group"
              onClick={() => logoutHandler()}
            >
              Cancel
            </Button>

          </div>
          </>
          :
          <>
          <div className="lockerUnavailable-window"></div>
          <div className="payLater-wind">
            <h2 className="item-header">Payment failed</h2>
            <h5 className="item-header">
              Payment Not Processed Please Try Again! With Different Payment Method
            </h5>

            <Button
              variant="contained"
              color="primary"
              className="btn-group"
              onClick={() => logoutHandler()}
            >
              Try Again
            </Button>

          </div>
          </>
        }

        </>
      )} */}

      {count >= 1 && (
        <>
          <div className="lockerUnavailable-window"></div>
          <div className="payLater-wind">
            <h2 className="item-header">
              {language.PaymentSuccessful.PayFailed}
            </h2>
            <hr className="divider-line" />
            {/* <h2 className="item-header">Payment failed</h2> */}
            <h5 className="item-header-context">
              {language.PaymentSuccessful.WantStorePayLater}
              {/* Do you want to store now and pay later */}
            </h5>

            <Button
              variant="contained"
              className="btn-group paylater-btns"
              onClick={() => payLaterSubmission("", "pay")}
            >
              {language.PaymentSuccessful.StoreNow}
              {/* store now */}
            </Button>

            <Button
              variant="contained"
              className="btn-group paylater-btns"
              onClick={() => logoutHandler()}
            >
              {language.PaymentSuccessful.Cancel}
              {/* need to change this in language object  */}
              {/* cancel */}
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default SubmitLock;
