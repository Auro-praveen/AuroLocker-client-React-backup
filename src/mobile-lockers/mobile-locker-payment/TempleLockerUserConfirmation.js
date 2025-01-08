import React, { useEffect, useRef, useState } from "react";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";
import YLogo from "../../logos/logo_yellow.png";
import "./templeLockerConfirmation.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { commonPOSTapiForMobileLockersMainServer } from "../server-connectivity/ServerAPI";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import razorpayAuth from "../../GlobalVariable/rPay.json";
import { useLocation, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { LoadingButton } from "@mui/lab";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import serverURL from "../../GlobalVariable/serverUrl.json";

const TempleLockerUserConfirmation = () => {
  const mobileLockerAuth = useMobileLockerAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [loadingBtn, setLoadingBtn] = useState(false);

  const userConfirmationObject = {
    // userName: mobileLockerAuth.mobileLockerUser.username,
    locationId: mobileLockerAuth.mobileLockersObject.locationId,
    lockerType: mobileLockerAuth.mobileLockersObject.lockerType,
    lockerNo: mobileLockerAuth.mobileLockersObject.lockerNo,
    lockRentAmount:
      Number(mobileLockerAuth.mobileLockerPayObject.totAmount) / 100,
    userMobileNo: mobileLockerAuth.mobileLockerUser.mobileNo,
    userDOB: mobileLockerAuth.mobileLockerUser.userDOB,
    userPasscode: mobileLockerAuth.mobileLockerUser.passcode,
    terminalId: mobileLockerAuth.mobileLockersObject.terminalID,
    noOfMobiles: mobileLockerAuth.mobileLockersObject.noOfMobiles,
    transactionID: mobileLockerAuth.mobileLockersObject.transactionId,
    totamountInclGST:
      mobileLockerAuth.mobileLockerPayObject.Balance === "0" ||
      mobileLockerAuth.mobileLockerPayObject.Balance === undefined ||
      mobileLockerAuth.mobileLockerPayObject.Balance === ""
        ? (
            ((Number(mobileLockerAuth.mobileLockerPayObject.totAmount) / 100) *
              Number(mobileLockerAuth.mobileLockerPayObject.gstAmount)) /
              100 +
            Number(mobileLockerAuth.mobileLockerPayObject.totAmount) / 100
          ).toFixed(2)
        : (
            ((((Number(mobileLockerAuth.mobileLockerPayObject.totAmount) /
              100) *
              Number(mobileLockerAuth.mobileLockerPayObject.Balance)) /
              100) *
              Number(mobileLockerAuth.mobileLockerPayObject.gstAmount)) /
              100 +
            Number(mobileLockerAuth.mobileLockerPayObject.totAmount) / 100 +
            Number(mobileLockerAuth.mobileLockerPayObject.Balance) / 100
          ).toFixed(2),
    totalAmount:
      mobileLockerAuth.mobileLockerPayObject.Balance === "0" ||
      mobileLockerAuth.mobileLockerPayObject.Balance === undefined ||
      mobileLockerAuth.mobileLockerPayObject.Balance === ""
        ? Number(mobileLockerAuth.mobileLockerPayObject.totAmount) / 100
        : Number(mobileLockerAuth.mobileLockerPayObject.totAmount) / 100 +
          Number(mobileLockerAuth.mobileLockerPayObject.Balance) / 100,
    Balance: Number(mobileLockerAuth.mobileLockerPayObject.Balance) / 100,
  };

  // console.log(userConfirmationObject.Balance === NaN ? true : false);
  console.log(userConfirmationObject);

  const [OrderId, setOrderId] = useState(
    mobileLockerAuth.mobileLockerPayObject.orderId
  );

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const logoutHandler = () => {
    mobileLockerAuth.logoutHandler();
  };

  const { getRemainingTime } = useIdleTimer({
    logoutHandler,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const [openPaymentInfoDialog, setOpenPaymentInfoDialog] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [openInfoAlert, setOpenInfoAlert] = useState(false);
  const [openLockError, setOpenLockerError] = useState(false);
  const [openPaymentFailedDialog, setOpenPaymentFailedDialog] = useState(false);

  const [paymentAttemptCount, setPaymentAttemtCount] = useState(0);

  const timeIterval = useRef();

  const handlePaymentProceed = async () => {
    // setLoadingBtn(true)

    alert(paymentAttemptCount);

    if (paymentAttemptCount > 0) {
      const razorpayOrderGenObj = {
        PacketType: "stgetorderid",
        LocationID: userConfirmationObject.locationId,
        MobileNo: userConfirmationObject.userMobileNo,
        LockerType: userConfirmationObject.lockerType,
        NoOfMobile: userConfirmationObject.noOfMobiles,
      };

      const resp = await commonPOSTapiForMobileLockersMainServer(
        razorpayOrderGenObj
      ).catch((err) => console.log("Error is : " + err));

      if (resp.status === "resp-200") {
        if (resp.responseCode === "GENORDID-200") {
          setOrderId(resp.orderId);
          razorpayPayentGatewayInit(resp.orderId, resp.totAmount);

          // if (paymentStatus === false) {
          //     alert("paymnt Failed")
          // } else {
          //     alert("Payent Redirectt")
          // }
        } else {
          // Alert("Failed To Fetch Payment Data Try Again!")
          setOpenInfoAlert(true);
          setLoadingBtn(false);
        }
      } else {
        setLoadingBtn(false);
      }
    } else {
      razorpayPayentGatewayInit(OrderId, userConfirmationObject.lockRentAmount);

      // if (paymentStatus === false) {
      //     alert("paymnt Failed")
      // } else {
      //     alert("Payent Redirectt")
      // }
    }
  };

  const razorpayPayentGatewayInit = (orderId, totAmount) => {
    // setCount((count) => count + 1);
    console.log("from server inside razor pay : " + totAmount + "  " + orderId);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    console.log("inside function ");
    var options = {
      key: razorpayAuth.key,
      amount: totAmount * 100,
      currency: "INR",
      image: "/logo_yellow.png",
      order_id: orderId,
      name: "Tuckit.in",
      description: "secured payment here",
      redirect: true,
      // callback_url: "http://localhost:3000/lockers/locker-payment",

      prefill: {
        // name: userConfirmationObject.userName,
        email: "payments@tuckpod.com",
        contact: userConfirmationObject.userMobileNo,
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#0e4a1e",
      },

      // newly added

      modal: {
        ondismiss: function () {
          setLoadingBtn(false);
          console.log("dismiss function called here");
          if (paymentAttemptCount > 1) {
            setOpenPaymentFailedDialog(true);
          }

          setPaymentAttemtCount((count) => count + 1);
        },
        onerror: function () {
          alert("something went wrong!");
        },
      },

      handler: function (response) {
        console.log("inside handler dec 03 before");
        console.log(response);
        if (
          response.razorpay_payment_id &&
          response.razorpay_order_id &&
          response.razorpay_signature
        ) {
          // let timeLeft = 10;
          // const interval = setInterval(() => {
          //     if (timeLeft === 0) {
          //         clearInterval(interval);
          //     }
          //     timeLeft = timeLeft - 1;
          //     console.log(timeLeft);
          // }, 1000);

          // setCount((count) => count + 1);
          // setPaymentAttemtCount(0);

          const paymentSuccess = {
            // ...status,
            PacketType: "stopenloc",
            responseCode: "paymentSuccess",
            orderId: orderId,
            razorpayId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          // praveen changed here august 16

          setLoadingBtn(true);

          setPaymentAttemtCount(0);
          // clearInterval(timeIterval.current);
          setOpenPaymentFailedDialog(true);
          ConfirmPaymentDetails(paymentSuccess);

          return true;
        } else {
          // console.log("payment Failekjhkjhkjhkjhd");
          return false;
        }

        // console.log("inside handler dec 03");
      },
    };

    const paymentObject = new window.Razorpay(options);

    // newly added
    paymentObject.on("payment.failed", function (response) {
      console.log(response);
    });

    paymentObject.open();

    // paymentObject.createElement()
    // setIsSuccess(false);
    // setIsError(true);
    // setCount((count) => count + 1);

    // let timeLeft = 12;
    // // console.log(count);
    // timeIterval.current = setInterval(() => {
    //     if (timeLeft <= 0) {
    //         // setVerifyPayment(true);

    //         // setOpenPaymentFailedDialog(true)

    //         clearTimeIntervalFun();
    //         // clearInterval(timeIterval.current);
    //     }
    //     timeLeft = timeLeft - 1;
    // }, 1000);

    // setSubmitBtnStatus(false);
  };

  const clearTimeIntervalFun = () => {
    alert(paymentAttemptCount);

    setLoadingBtn(false);

    if (paymentAttemptCount + 1 > 1) {
      setOpenPaymentFailedDialog(true);
    }
    setPaymentAttemtCount((count) => count + 1);
    clearInterval(timeIterval.current);
  };

  const ConfirmPaymentDetails = async (paymentObject) => {
    console.log("inside pay siuccess page");

    setOpenPaymentFailedDialog(false);

    console.log(paymentObject);

    const formData = new FormData();

    const requestPaySuccessObj = {
      ...paymentObject,
      terminalID: userConfirmationObject.terminalId,
      MobileNo: userConfirmationObject.userMobileNo,
      TransactionId: userConfirmationObject.transactionID,
      LocationID: userConfirmationObject.locationId,
      LockerType: userConfirmationObject.lockerType,
      amount: userConfirmationObject.lockRentAmount,
      passcode: userConfirmationObject.userPasscode,
      DOB: userConfirmationObject.userDOB,
      imageinbyte: mobileLockerAuth.userPhoteAuthentication,
      LockerNo: userConfirmationObject.lockerNo,
      Balance: userConfirmationObject.Balance,
    };

    // formData.append(
    //     'imageinbyte', mobileLockerAuth.userPhoteAuthentication
    // )

    // formData.append('formDetails', JSON.stringify(requestPaySuccessObj))

    // console.log(formData);

    // const resp = await commonPOSTapiForMobileLockersMainServer(formData).catch((err) => console.log("Error is : " + err));
    const resp = await sendFormDataToServer(requestPaySuccessObj).catch((err) =>
      console.log("Error is : " + err)
    );

    console.log(resp);
    if (resp.status !== "resp-404") {
      if (resp.responseCode === "LOCKAVS-200") {
        location.pathname = "/lockers/verify-locker-open";
        navigate(location.pathname, { replace: true });

        setLoadingBtn(false);

        setOpenSuccessAlert(true);
        setOpenPaymentInfoDialog(true);
      } else {
        setLoadingBtn(false);
        setOpenLockerError(true);
      }
    } else {
      // alert("Server Connection Error:")
      setOpenErrorAlert(true);
      setLoadingBtn(false);
    }
  };

  const sendFormDataToServer = async (formdata) => {
    let serverResponse = await fetch(serverURL.templeLockerPath, {
      // const serverResponse = await fetch("http://192.168.0.124:8080/AuroTempleLBEngine/AuroClientRequest", {

      // const serverResponse = await fetch("http://192.168.0.198:8080/AuroAutoLocker/TestingServltt", {

      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(formdata),
    })
      .then((resp) => {
        return resp.json();
      })
      .catch((err) => console.log("some error : " + err));

    if (
      !serverResponse ||
      serverResponse === undefined ||
      serverResponse === null
    ) {
      serverResponse = {
        // ...serverResponse,
        status: "resp-404",
      };
    } else {
      serverResponse = {
        ...serverResponse,
        status: "resp-200",
      };
    }

    return serverResponse;
  };

  const closeAllAlerts = () => {
    setOpenSuccessAlert(false);
    setOpenInfoAlert(false);
    setOpenErrorAlert(false);
  };

  const onProceedClickHandle = async (isPaymentSuccess) => {
    location.pathname = "/lockers/verify-locker-open";
    setOpenPaymentInfoDialog(false);
    setOpenPaymentFailedDialog(false);

    if (isPaymentSuccess) {
      navigate(location.pathname, { replace: true });
    } else {
      // if the payment is not success
      const payFailLaterObj = {
        PacketType: "stopenloc",
        terminalID: userConfirmationObject.terminalId,
        MobileNo: userConfirmationObject.userMobileNo,
        TransactionId: userConfirmationObject.transactionID,
        orderId: OrderId,
        responseCode: "payFailPaylater",
        LocationID: userConfirmationObject.locationId,
        LockerType: userConfirmationObject.lockerType,
        amount: userConfirmationObject.lockRentAmount,
        passcode: userConfirmationObject.userPasscode,
        razorpayId: "",
        razorpayPaymentId: "",
        razorpaySignature: "",
        DOB: userConfirmationObject.userDOB,
        LockerNo: userConfirmationObject.lockerNo,
        imageinbyte: mobileLockerAuth.userPhoteAuthentication,
        Balance: userConfirmationObject.Balance,
      };

      const formData = new FormData();

      // formData.append(
      //     'imageinbyte', mobileLockerAuth.userPhoteAuthentication
      // )
      // formData.append('formDetails', JSON.stringify(payFailLaterObj))

      // const resp = await commonPOSTapiForMobileLockersMainServer(formData).catch((err) => console.log("Error is : " + err));

      const resp = await sendFormDataToServer(payFailLaterObj).catch((err) =>
        console.log("Error is : " + err)
      );

      console.log(resp);

      if (resp.status !== "resp-404") {
        if (resp.responseCode === "LOCKAVS-200") {
          navigate(location.pathname, { replace: true });
        } else {
          setOpenLockerError(true);
        }
      } else {
        navigate(location.pathname, { replace: true });
      }

      // navigate(location.pathname, { replace: true })
    }
  };

  const retryPaymentAfterMaxLengthReached = () => {
    setOpenPaymentFailedDialog(false);
    handlePaymentProceed();
  };

  return (
    <div className="loginPage-container">
      <div className="mobile-locker-content">
        <Snackbar
          open={openSuccessAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={6000}
          onClose={closeAllAlerts}
        >
          <Alert
            onClose={closeAllAlerts}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Payment Has Been Recieved Successfully
          </Alert>
        </Snackbar>

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
            Payment is not recieved Please Try again!
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
            Payment Not Initiated, Please Try Again !
          </Alert>
        </Snackbar>

        <Snackbar
          open={openLockError}
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
            Something Went Wrong Please Contact The Admin!
          </Alert>
        </Snackbar>

        <img
          className="logo-container"
          src={YLogo}
          alt="img"
          width={100}
          style={{ marginTop: "-5px" }}
        />

        <hr />

        <h2 style={{ marginBottom: "30px", color: "crimson" }}>
          {" "}
          Please Verify The Details{" "}
        </h2>

        {/* <div className="mobile-lock-verifydetails-container">
                    <div style={{ width: "100%" }}>
                        <p style={{ float: "left", marginLeft: "20px", marginTop: "-10px", padding: "10px" }} > User Name :  </p>
                    </div>
                    <br />
                    <div className="verifydetais-item-container">
                        <h6 style={{ marginRight: "100px", marginTop: "10px" }}>{userConfirmationObject.userName}</h6>
                    </div>
                </div> */}

        <div className="mobile-lockers-inputform-container">
          <div className="mobile-lock-verifydetails-container">
            <div style={{ width: "100%" }}>
              <p
                style={{
                  float: "left",
                  marginLeft: "20px",
                  marginTop: "-10px",
                  padding: "10px",
                  color: "#1E367B",
                }}
              >
                {" "}
                Mobile Number :{" "}
              </p>
            </div>
            <br />
            <div className="verifydetais-item-container">
              <h6 style={{ clear: "left", marginTop: "10px" }}>
                {userConfirmationObject.userMobileNo}
              </h6>
            </div>
          </div>
          <div className="mobile-lock-verifydetails-container">
            <div style={{ width: "100%" }}>
              <p
                style={{
                  float: "left",
                  marginLeft: "20px",
                  marginTop: "-10px",
                  padding: "10px",
                  color: "#1E367B",
                }}
              >
                {" "}
                Date of Birth :{" "}
              </p>
            </div>
            <br />
            <div className="verifydetais-item-container">
              <h6 style={{ clear: "left", marginTop: "10px" }}>
                {userConfirmationObject.userDOB}
              </h6>
            </div>
          </div>

          <div className="mobile-lock-verifydetails-container">
            <div style={{ width: "100%" }}>
              <p
                style={{
                  float: "left",
                  marginLeft: "20px",
                  marginTop: "-10px",
                  padding: "10px",
                  color: "#1E367B",
                }}
              >
                {" "}
                Location ID :{" "}
              </p>
            </div>
            <br />
            <div className="verifydetais-item-container">
              <h6 style={{ clear: "left", marginTop: "10px" }}>
                {userConfirmationObject.locationId}
              </h6>
            </div>
          </div>

          <div className="mobile-lock-verifydetails-container">
            <div style={{ width: "100%" }}>
              <p
                style={{
                  float: "left",
                  marginLeft: "20px",
                  marginTop: "-10px",
                  padding: "10px",
                  color: "#1E367B",
                }}
              >
                {" "}
                Terminal ID :{" "}
              </p>
            </div>
            <br />
            <div className="verifydetais-item-container">
              <h6 style={{ clear: "left", marginTop: "10px" }}>
                {userConfirmationObject.terminalId}
              </h6>
            </div>
          </div>

          <div className="mobile-lock-verifydetails-container">
            <div style={{ width: "100%" }}>
              <p
                style={{
                  float: "left",
                  marginLeft: "20px",
                  marginTop: "-10px",
                  padding: "10px",
                  color: "#1E367B",
                }}
              >
                {" "}
                Locker Number :{" "}
              </p>
            </div>
            <br />
            <div className="verifydetais-item-container">
              <h6 style={{ clear: "left", marginTop: "10px" }}>
                {userConfirmationObject.lockerNo}
              </h6>
            </div>
          </div>
          {/* 
                <div className="mobile-lock-verifydetails-container">
                    <div style={{ width: "100%" }}>
                        <p style={{ float: "left", marginLeft: "20px", marginTop: "-10px", padding: "10px" }} > Locker Amount :  </p>
                    </div>
                    <br />
                    <div className="verifydetais-item-container">
                        <h6 style={{ marginRight: "120px", marginTop: "10px" }}>{userConfirmationObject.lockRentAmount} Rs</h6>
                    </div>
                </div> */}

          {userConfirmationObject.Balance === 0 ||
          userConfirmationObject.Balance === undefined ||
          userConfirmationObject.Balance === "" ||
          userConfirmationObject.Balance === NaN ? (
            <div className="mobile-lock-verifydetails-container">
              <div style={{ width: "100%" }}>
                <p
                  style={{
                    float: "left",
                    marginLeft: "20px",
                    marginTop: "-10px",
                    padding: "10px",
                    color: "#1E367B",
                  }}
                >
                  {" "}
                  Locker Amount :{" "}
                </p>
              </div>
              <br />
              <div className="verifydetais-item-container">
                <h6 style={{ clear: "left", marginTop: "10px" }}>
                  {userConfirmationObject.lockRentAmount} Rs
                </h6>
              </div>
            </div>
          ) : (
            <>
              <div className="mobile-lock-verifydetails-container">
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      float: "left",
                      marginLeft: "20px",
                      marginTop: "-10px",
                      padding: "10px",
                      color: "#1E367B",
                    }}
                  >
                    {" "}
                    Locker Amount :{" "}
                  </p>
                </div>
                <br />
                <div className="verifydetais-item-container">
                  <h6 style={{ clear: "left", marginTop: "10px" }}>
                    {userConfirmationObject.lockRentAmount} Rs
                  </h6>
                </div>
              </div>

              <div className="mobile-lock-verifydetails-container">
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      float: "left",
                      marginLeft: "20px",
                      marginTop: "-10px",
                      padding: "10px",
                      color: "#1E367B",
                    }}
                  >
                    {" "}
                    Balance :{" "}
                  </p>
                </div>
                <br />
                <div className="verifydetais-item-container">
                  <h6 style={{ clear: "left", marginTop: "10px" }}>
                    {userConfirmationObject.Balance} Rs
                  </h6>
                </div>
              </div>

              <div className="mobile-lock-verifydetails-container">
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      float: "left",
                      marginLeft: "20px",
                      marginTop: "-10px",
                      padding: "10px",
                      color: "#1E367B",
                    }}
                  >
                    {" "}
                    Total Amount :{" "}
                  </p>
                </div>
                <br />
                <div className="verifydetais-item-container">
                  <h6 style={{ clear: "left", marginTop: "10px" }}>
                    {userConfirmationObject.totalAmount} Rs
                  </h6>
                </div>
              </div>
            </>
          )}

          {/* <div className="mobile-lock-verifydetails-container">
                    <div style={{ width: "100%" }}>
                        <p style={{ float: "left", marginLeft: "20px", marginTop: "-10px", padding: "10px" }} > Locker Amount : (incl of gst) </p>
                    </div>
                    <br />
                    <div className="verifydetais-item-container">
                        <h6 style={{ marginRight: "80px", marginTop: "10px" }}>{userConfirmationObject.totamountInclGST} Rs</h6>
                    </div>
                </div> */}

          <div className="mob-lock-btn-container">
            {loadingBtn ? (
              <LoadingButton
                variant="contained"
                // className="mob-locker-btn"
                loading
                loadingPosition="end"
                endIcon={<CreditScoreIcon />}
                // onClick={() => handlePaymentProceed()}
                fullWidth
                disabled
              >
                Initiating Payment
              </LoadingButton>
            ) : (
              <LoadingButton
                variant="contained"
                className="mob-locker-btn"
                loadingPosition="end"
                endIcon={<CreditScoreIcon />}
                onClick={() => handlePaymentProceed()}
                fullWidth
              >
                Proceed To Pay
              </LoadingButton>
            )}

            {/* <Button
                        variant="contained"
                        className="mob-locker-btn"
                        onClick={() => handlePaymentProceed()}
                        fullWidth
                    >
                        Proceed To Pay
                    </Button> */}
          </div>
        </div>
      </div>

      <Dialog
        open={openPaymentInfoDialog}
        // TransitionComponent={Transition}
        keepMounted
        //   onClose={() => closeOpenDialog()}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            textAlign: "center",
            color: "#1E367B",
            backgroundColor: "#df8549",
          }}
        >
          <b>{"Payment Success"}</b>
        </DialogTitle>
        <DialogContent>
          <div className="temple-lockers-paysuccess">
            <img
              src={"/logos/paysuccess.gif"}
              alt="payment-success"
              width={180}
              height={150}
            />
            <h6 style={{ color: "green", textAlign: "center" }}>
              Payment Success, Please Click On Proceed To Continue
            </h6>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => onProceedClickHandle(true)}
            fullWidth
          >
            Proceed
          </Button>
          {/* <Button onClick={() => closeOpenDialog()}>Re-Enter Passcode</Button>
                    <Button onClick={() => ProceedToVerifyDetails()}>Proceed</Button> */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPaymentFailedDialog}
        // TransitionComponent={Transition}
        keepMounted
        //   onClose={() => closeOpenDialog()}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            textAlign: "center",
            color: "#1E367B",
            backgroundColor: "#df8549",
          }}
        >
          <b>{"Payment Failed"}</b>
        </DialogTitle>
        <DialogContent>
          <div className="temple-lockers-paysuccess">
            <img
              src={"/logos/payment_failed.png"}
              alt="payment-success"
              width={180}
              height={150}
            />
            <h6
              style={{
                color: "crimson",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Your Payment Has Been Failed, You Can Still Book The Locker,Amount
              Will Be Carried As Balance To The Next Booking
            </h6>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={() => onProceedClickHandle(false)}
          >
            Confirm Booking
          </Button>

          {/* <Button onClick={() => closeOpenDialog()}>Re-Enter Passcode</Button> */}
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={() => retryPaymentAfterMaxLengthReached()}
          >
            Retry-Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TempleLockerUserConfirmation;
