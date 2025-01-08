import React, { useEffect, useState } from "react";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import "./retriveLock.css";
import { Button } from "@mui/material";
import serverUrl from "../../GlobalVariable/serverUrl.json";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EnglishLang from "../../Languages/English.json";
import KannadaLang from "../../Languages/Kannada.json";
import HindiLang from "../../Languages/Hindi.json";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import YLogo from "../../logos/logo_yellow.png";
// import { useAuth } from "../../GlobalFunctions/Auth";
import { useIdleTimer } from "react-idle-timer";
import { useAuth } from "../../GlobalFunctions/Auth";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";

import razorpayKey from "../../GlobalVariable/rPay.json";

/*

@Auther = Praveenkumar 

changes applied :
1) partial and full payment introduced === jan 2023
2) if post pay payment for partial retrieve === march 23-2023
1) partial retrieve payment enabled === april 26-2023
*/

function RetriveLock() {
  const RetriveAuth = useRetriveAuth();
  const retriveLockers = RetriveAuth.retriveLockContainer.LOCKNO;

  const [retriveLockItems, setRetriveLockItems] = useState({
    PacketType: "retropenloccnf",
    MobileNo: RetriveAuth.MobileNo,
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
    LockerNo:
      RetriveAuth.retriveLockContainer.LOCKNO.length === 1
        ? RetriveAuth.retriveLockContainer.LOCKNO
        : [],
  });

  const [isPostPayPartial, setIsPostPayPartial] = useState(false);

  const [isParialRetr, setIsPartialRetr] = useState(
    RetriveAuth.isPartialRetrieve
  );

  const [partialRetrieveDailgue, setPartialRetrieveDailgue] = useState(false);
  const [fullRetrieveDailgue, setFullRetrieveDailogue] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  const onIdle = () => {
    RetriveAuth.sessionTimeoutLogout();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setPartialRetrieveDailgue(false);
    setFullRetrieveDailogue(false);
  };

  const closePaymentPage = () => {
    setIsPostPayPartial(false);
  };

  const retriveLockHandler = (rLock) => {
    if (retriveLockItems.LockerNo.indexOf(rLock) > -1) {
      let lockSelected = [...retriveLockItems.LockerNo];
      lockSelected.splice(lockSelected.indexOf(rLock), 1);
      setRetriveLockItems({
        ...retriveLockItems,
        LockerNo: lockSelected,
      });

      console.log("partial retrieve ");
    } else {
      // setRetriveSelectedLock((locks) => [...locks, rLock]);
      const lockers = [...retriveLockItems.LockerNo, rLock];
      setRetriveLockItems({
        ...retriveLockItems,
        LockerNo: lockers,
      });
      console.log("partial retrieve ");
    }
  };
  // const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  // const openLockUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/OpenLockHandler";
  const submitRetriveLock = () => {
    if (retriveLockItems.LockerNo.length > 0) {
      if (RetriveAuth.isPartialRetrieve) {
        RetriveAuth.selectedLockersToRetrieve(retriveLockItems.LockerNo);

        if (RetriveAuth.retriveLockContainer.amount > 0) {
          setIsPostPayPartial(true);
        } else {
          initiatingPartRetrievePayment();
        }

        // else {
        //   navigate("/verlockopenret", { replace: true });
        // }
      } else {
        setIsLoading(true);

        console.log(retriveLockItems);
        RetriveAuth.selectedLockersToRetrieve(retriveLockItems.LockerNo);
        fetch(/* openLockUrl */ serverUrl.path, {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: JSON.stringify(retriveLockItems),
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log(data);
            if (data.responseCode === "LOCEX-200") {
              const items = {
                eamount: data.eamount,
                EXHour: data.EXHour
              };
              RetriveAuth.handleBalanceAmount(data.Balance);
              RetriveAuth.excessUsageHandler(items);
              RetriveAuth.CustomerNameHandler(data.cname);
              navigate("/retrievePay", { replace: true });
              setIsLoading(false);
            } else if (data.responseCode === "LOCPO-200") {
              const items = {
                amount: data.amount,
                Hour: data.Hour
              };

              RetriveAuth.handleBalanceAmount(data.Balance);
              RetriveAuth.CustomerNameHandler(data.cname);
              RetriveAuth.postPayHandler(items);
              navigate("/retrievePay", { replace: true });
              setIsLoading(false);
            } else if (data.responseCode === "LOCPAEX-200") {
              const items = {
                amount: data.amount,
                Hour: data.Hour,
                eamount: data.eamount,
                EXHour: data.EXHour,
              };
              RetriveAuth.handleBalanceAmount(data.Balance);
              RetriveAuth.postPayAndExcessUsageHandler(items);
              RetriveAuth.CustomerNameHandler(data.cname);
              navigate("/retrievePay", { replace: true });
              setIsLoading(false);
            } else if (data.responseCode === "LOCRS-200") {
              navigate("/verlockopenret", { replace: true });
              // navigate("/retriveSuccess", { replace: true });
              setIsLoading(false);
            } else if (data.responseCode === "RTRANPCNF-200") {
              navigate("/verlockopenret", { replace: true });
              // navigate("/retriveSuccess", { replace: true });
              setIsLoading(false);
            }
          })
          .catch((err) => {
            setIsLoading(false);
            console.log("err : " + err);
          });
      }
    } else {
      alert("choose a lock");
    }
  };

  const initiatingPartRetrievePayment = () => {
    const retrPayReq = {
      PacketType: "partretreq",
      terminalID: retriveLockItems.terminalID,
      MobileNo: retriveLockItems.MobileNo,
      LockerNo: retriveLockItems.LockerNo,
    };

    fetch(serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(retrPayReq),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "PARPAY-200") {
          if (data.partcount === 0) {
            razorPayPayment(data.orderId, data.totAmount, "partpaycnf");
          } else {
            navigate("/verlockopenret", { replace: true });
          }
        } else {
          setIsWarning(true);
        }
      });
  };
  // for partial payment

  const onSelectedMakePayment = () => {
    razorPayPayment(
      RetriveAuth.retriveLockContainer.orderId,
      RetriveAuth.retriveLockContainer.amount,
      "partpaycnf"
    );
  };

  const razorPayPayment = (orderId, amount, packetType) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    // setCount((count) => count + 1);
    var options = {
      key: razorpayKey.key,
      amount: amount,
      currency: "INR",
      image: { YLogo },
      order_id: orderId,
      name: "Tuckit.in",
      description: "secured payment here",
      // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",

      prefill: {
        name: RetriveAuth.CustomerName,
        email: "payments@tuckpod.com",
        contact: RetriveAuth.MobileNo,
      },

      notes: {
        address: "",
      },

      theme: {
        color: "#0e4a1e",
      },

      handler: function (response) {
        if (
          response.razorpay_payment_id &&
          response.razorpay_order_id &&
          response.razorpay_signature
        ) {
          setIsSuccess(true);
          setIsError(false);

          // Praveen changed april 26-2023
          const obj = {
            PacketType: packetType,
            responseCode: "paymentSuccess",
            OrderId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          paymentStatusHandler(obj);
        }
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // payment success response to the server
  const paymentStatusHandler = (stat) => {
    const respObj = {
      // PacketType:"partpaycnf",
      terminalID: retriveLockItems.terminalID,
      MobileNo: retriveLockItems.MobileNo,
      ...stat,
    };

    console.log(respObj);

    fetch(/* payemtnStatUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(respObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "PARPAY-200") {
          setIsError(false);
          // if (count === 2) {
          setIsSuccess(true);

          navigate("/verlockopenret", { replace: true });
        } else if (data.responseCode === "PARPAY-201") {
          setIsError(true);
          setIsSuccess(false);
        }
      });
  };

  const onPartialSelectFun = () => {
    setIsPartialRetr(false);
    setPartialRetrieveDailgue(false);
  };

  const onFullRetrieveSelectFun = () => {
    setIsPartialRetr(false);
    RetriveAuth.noPartialRetrieveSelected();
    setFullRetrieveDailogue(false);
  };

  const closeAlert = () => {
    setIsError(false);
    setIsWarning(false);
    setIsSuccess(false);
  };

  return (
    <div className="retrieve-lock-container">
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Collapse in={isError}>
          <Alert
            variant="standard"
            severity="error"
            onClose={() => closeAlert()}
          >
            Payment failed! Please try again.
          </Alert>
        </Collapse>

        <Collapse in={isWarning}>
          <Alert
            variant="standard"
            severity="error"
            onClose={() => closeAlert()}
          >
            Something went wrong! please try again.
          </Alert>
        </Collapse>

        <Collapse in={isSuccess}>
          <Alert
            variant="standard"
            severity="success"
            onClose={() => closeAlert()}
          >
            Your Payment is successfull!
          </Alert>
        </Collapse>
      </Stack>

      <Dialog
        open={partialRetrieveDailgue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ color: "#ff0000" }} id="alert-dialog-title">
          {/* <b>{"Partial Retrieve"}</b> */}
          <b>{language.RetrieveOption.partialretrivepage}</b>
        </DialogTitle>
        <DialogContent>
          <div className="partial-retr-info-container">
            <p>
              <b style={{ color: "#ff0000" }}>
                {language.RetrieveOption.partialretriveInfoAlert}
              </b>
              {language.RetrieveOption.RetrieveDescriptionUpdated}
              {/* <b style={{ color: "#ff0000" }}>Partial Retrieve :</b> */}
              {/* Bookings active until you retrieve items fully.
              Charges applicable for excess usage (if any), T&C apply. */}
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" autoFocus>
            {language.RetrieveOption.Cancel}
            {/* Cancel */}
          </Button>
          <Button
            onClick={() => onPartialSelectFun()}
            variant="outlined"
            autoFocus
          >
            {language.RetrieveOption.ok}
            {/* OK */}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={fullRetrieveDailgue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ color: "#ff0000" }} id="alert-dialog-title">
          {/* <b>{"Full Retrieve"}</b> */}
          <b>{language.RetrieveOption.fullretrieve}</b>
        </DialogTitle>
        <DialogContent>
          <div className="full-retr-info-container">
            <p>
              <b style={{ color: "#ff0000" }}>
                {language.RetrieveOption.FullretriveInfoAlert}
              </b>
              {language.RetrieveOption.fullretrieveAlert}
              {/* <b style={{ color: "#ff0000" }}>Full Retrieve :</b>  */}
              {/* Retrieve all items & close the door.
              Locker available for new bookings, T&C apply */}
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" autoFocus>
            {language.RetrieveOption.Cancel}
            {/* Cancel */}
          </Button>
          <Button
            onClick={() => onFullRetrieveSelectFun()}
            variant="outlined"
            autoFocus
          >
            {language.RetrieveOption.ok}
            {/* OK */}
          </Button>
        </DialogActions>
      </Dialog>

      {isParialRetr ? (
        <div className="partial-lock-open">
          {/* <div className="btn-container">
            <Button
              variant="contained"
              className="mui-btn-color-yellow"
              color="warning"
              onClick={() => setFullRetrieveDailogue(true)}
              fullWidth
            >
              {language.RetrieveOption.fullretrieve}
            full retrieve 
            </Button>
            
            <h6 className="full-retr-tcomplete">{language.RetrieveOption.transactionComplete}</h6>
            <h6 className="full-retr-tcomplete"> Transaction Complete </h6>
          </div> */}

          <div className="btn-container">
            <div
              variant="contained"
              className="mui-btn-color-yellow full-retrieve-btn"
              color="warning"
              onClick={() => setFullRetrieveDailogue(true)}
            >
              <p style={{ marginBottom: "0px", paddingTop: "8px" }}>
                {language.RetrieveOption.fullretrieve}
              </p>
              {/* <p style={{ marginBottom: "0px", paddingTop:'8px' }}>full retrieve </p> */}
              <hr style={{ marginBottom: "2px", marginTop: "8px" }} />
              <p className="full-retr-tcomplete">
                {language.RetrieveOption.FullRetrieveInfo}
              </p>
              {/* <p className="full-retr-tcomplete"> Transaction Complete </p> */}
            </div>
          </div>
          <hr />
          {/* <div className="btn-container"> */}
          {/* <Button
              variant="contained"
              className="mui-btn-color-yellow"
              color="warning"
              onClick={() => {
                setPartialRetrieveDailgue(true);
              }}
              fullWidth
            >
              {language.RetrieveOption.partialretrivepage}
              partial retrieve
            </Button> */}

          <div className="btn-container">
            <div
              variant="contained"
              className="mui-btn-color-yellow full-retrieve-btn"
              color="warning"
              // onClick={() => setFullRetrieveDailogue(true)}
              onClick={() => {
                setPartialRetrieveDailgue(true);
              }}
            >
              <p style={{ marginBottom: "0px", paddingTop: "8px" }}>
                {language.RetrieveOption.partialretrivepage}
              </p>
              {/* <p style={{ marginBottom: "0px", paddingTop:'8px' }}>full retrieve </p> */}
              <hr style={{ marginBottom: "2px", marginTop: "8px" }} />
              <p className="full-retr-tcomplete">
                {language.RetrieveOption.partialretriveInfo}
              </p>
              {/* <p className="full-retr-tcomplete"> Transaction Complete </p> */}
            </div>
          </div>
          {/* </div> */}

          {/* <div className="partial-retr-info-container">
            <p>
              <b style={{ color: "#ff0000" }}>Partial Retrieve :</b> Locker
              still belongs to you until you fully retrieve.
            </p>
          </div>

          <div className="full-retr-info-container">
            <p>
              <b style={{ color: "#ff0000" }}>Full Retrieve :</b> Locker will be
              fully Retrieved and no longer belongs to you.
            </p>
          </div> */}
        </div>
      ) : (
        <div className="retrive-lock-wind">
          <img className="logo-container" src={YLogo} alt="img" width={100} />
          <h3 className="retrive-lock-header">
            {language.RetrievePage.selectretrievinglock}
          </h3>
          {/* <h3 className="retrive-lock-header">Select Locker To Open</h3> */}
          <div className="retrive-lock-content">
            {retriveLockers.map((lock, index) => (
              <button
                className={
                  retriveLockItems.LockerNo.indexOf(lock) > -1
                    ? "retrive-locks"
                    : "retrive-locks-selected"
                }
                key={index}
                onClick={() => retriveLockHandler(lock)}
              >
                <h2>{lock}</h2>
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="btn-container">
              <LoadingButton
                loading
                loadingPosition="end"
                endIcon={<SaveIcon />}
                variant="contained"
                color="warning"
                fullWidth
              >
                {language.RetrieveOption.wait}
                {/* wait ... */}
              </LoadingButton>
            </div>
          ) : (
            <div className="btn-container">
              <Button
                variant="contained"
                className="mui-btn-color-yellow"
                color="warning"
                onClick={() => submitRetriveLock()}
                fullWidth
              >
                {language.RetrieveOption.openlock}
                {/* open lock */}
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={isPostPayPartial}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ color: "#ff0000" }} id="alert-dialog-title">
          <b>{language.RetrievePage.duePaymentAlert}</b>
          {/* <b>Your Payment is due</b> */}
        </DialogTitle>
        <DialogContent>
          <div className="full-retr-info-container">
            <p>
              {/* {language.RetrieveOption.paymentPendingInRetrieve} */}
              {language.RetrievePage.paymentPendingInRetrieve}
              {/* Your payment of{" "} */}
              <b style={{ color: "#ff0000" }}>
                Rs.
                {Math.round(
                  (Number(RetriveAuth.retriveLockContainer.amount) +
                    Number(RetriveAuth.retriveLockContainer.balance) / 100 +
                    (Number(RetriveAuth.retriveLockContainer.amount) +
                      Number(RetriveAuth.retriveLockContainer.balance) / 100) *
                      (RetriveAuth.retriveLockContainer.GSTAmount / 100) +
                    Number.EPSILON) *
                    100
                ) / 100}{" "}
                (including GST)
              </b>{" "}
              {/* {language.RetrieveOption.paymentPendingInRetrieveTwo}  */}
              {language.RetrievePage.paymentPendingInRetrieveTwo}
              {/* is pending, as you selected a post pay option, make payment to
              partial retieve your lock. */}
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePaymentPage} variant="outlined" autoFocus>
            {language.RetrieveOption.Cancel}
            {/* Cancel */}
          </Button>
          <Button
            onClick={() => onSelectedMakePayment()}
            variant="outlined"
            autoFocus
          >
            {/* {language.RetrieveOption.makePayment} */}
            Make Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RetriveLock;
