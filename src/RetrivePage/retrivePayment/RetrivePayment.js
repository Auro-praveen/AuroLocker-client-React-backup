import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import "./retrivePay.css";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import serverUrl from "../../GlobalVariable/serverUrl.json";
import EnglishLang from "../../Languages/English.json";
import KannadaLang from "../../Languages/Kannada.json";
import HindiLang from "../../Languages/Hindi.json";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import YLogo from "../../logos/logo_yellow.png";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import { useIdleTimer } from "react-idle-timer";
import { useAuth } from "../../GlobalFunctions/Auth";
import { useNavigate } from "react-router-dom";
import razorpayKey from "../../GlobalVariable/rPay.json";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

/*

  @Auther Praveenkumar
  post payment
  excess payment 
  post + excess payment if any will be rendered to this page,,

  if payment fails again for 3 times there is postpay option as well ( and amount will be carried to furhter for next booking )

  changed in november 29 2023 for some gst amount ammount calculations

* NOTE: Be carefull while changing the code, may affect somewhere
*
*/
function RetrivePayment() {
  const RetriveAuth = useRetriveAuth();
  const [count, setCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [order_id, setOrder_id] = useState("");

  const timeInterval = useRef();

  let totalExcessAndPostPayAmount;
  let totalPostPayAmount;
  let totalExcessAmount;

  // praveen changed here
  const balanceAmount = Number(Math.round(RetriveAuth.BalanceAmount / 100));

  if (RetriveAuth.excessUsageItems.Balance !== 0) {
    totalExcessAmount =
      Number(Math.round(Number(RetriveAuth.excessUsageItems.eamount) / 100)) +
      balanceAmount;
    totalPostPayAmount =
      Number(Math.round(Number(RetriveAuth.postPayItem.amount) / 100)) +
      balanceAmount;
    totalExcessAndPostPayAmount =
      Number(
        Math.round(Number(RetriveAuth.postPayAndExcessUsage.amount) / 100)
      ) +
      Number(
        Math.round(Number(RetriveAuth.postPayAndExcessUsage.eamount) / 100)
      ) +
      balanceAmount;
  }

  // praveen changed here for g-amount
  // const balanceAmount = Number(
  //   Math.round(RetriveAuth.BalanceAmount / 100) +
  //     (RetriveAuth.retriveLockContainer.GSTAmount *
  //       Math.round(RetriveAuth.BalanceAmount / 100)) /
  //       100
  // );

  // if (RetriveAuth.excessUsageItems.Balance !== 0) {
  //   totalExcessAmount =
  //     Number(Math.round(RetriveAuth.excessUsageItems.eamount / 100) + (Math.round(RetriveAuth.excessUsageItems.eamount / 100) * RetriveAuth.retriveLockContainer.GSTAmount/100)) +
  //     balanceAmount;
  //   totalPostPayAmount =
  //     Number(Math.round(RetriveAuth.postPayItem.amount / 100) + ((Math.round(RetriveAuth.postPayItem.amount / 100) * RetriveAuth.retriveLockContainer.GSTAmount/100))) + balanceAmount;
  //   totalExcessAndPostPayAmount =
  //     Number(Math.round(RetriveAuth.postPayAndExcessUsage.amount / 100) + ((Math.round(RetriveAuth.postPayAndExcessUsage.amount / 100) * RetriveAuth.retriveLockContainer.GSTAmount/100)) ) +
  //     Number(Math.round(RetriveAuth.postPayAndExcessUsage.eamount / 100) + ((Math.round(RetriveAuth.postPayAndExcessUsage.amount / 100) * RetriveAuth.retriveLockContainer.GSTAmount/100))) +
  //     balanceAmount;
  // }

  const excessTimeUsage = {
    eamount: Math.round(Number(RetriveAuth.excessUsageItems.eamount) / 100),
    EXHour: RetriveAuth.excessUsageItems.EXHour,
    Balance: balanceAmount,
    totalAmount: totalExcessAmount,
  };

  const postPay = {
    amount: Math.round(Number(RetriveAuth.postPayItem.amount) / 100),
    Hour: RetriveAuth.postPayItem.Hour,
    Balance: balanceAmount,
    totalAmount: totalPostPayAmount,
  };

  const [openPaymentAlert, setOpenPaymentAlert] = useState(false);
  const [payableAmount, setPayableAmount] = useState(0);

  const postPayExcessUsage = {
    amount: Math.round(RetriveAuth.postPayAndExcessUsage.amount / 100),
    Hour: RetriveAuth.postPayAndExcessUsage.Hour,
    eamount: Math.round(RetriveAuth.postPayAndExcessUsage.eamount / 100),
    EXHour: RetriveAuth.postPayAndExcessUsage.EXHour,
    Balance: balanceAmount,
    totAmount: totalExcessAndPostPayAmount,
  };

  const onIdle = () => {
    RetriveAuth.sessionTimeoutLogout();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 8,
  });

  const [paymentHandlerWind, setPaymentHandlerWind] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
    const handleBackButton = (event) => {
      // Display a confirmation dialog to the user

      console.log("clicked on back button");
      
      const confirmLeave = window.confirm(
        "Are you sure, you want to leave? the page will be refreshed"
      );

      if (confirmLeave) {
        // If user clicks 'Yes', navigate to the home page
        RetriveAuth.sessionTimeoutLogout();
      } else {
        // If user clicks 'No', prevent the default back action
        event.preventDefault();
      }
    };

    // Listen for the back button (popstate) event
    window.addEventListener("popstate", handleBackButton);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("popstate", handleBackButton);
    };
    
  }, []);

  // transaction id is static here

  const retrivePaymentItem = {
    terminalID: RetriveAuth.retriveLockContainer.terminalID,
    MobileNo: RetriveAuth.MobileNo,
    LockerNo: RetriveAuth.retrieveLockSelected,
    TransactionID: "66640912221804431",
  };

  // const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  // const paymentUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/RetrivePaymentHandler";

  // if different packet types are needed to send money
  // const postPaymentHandler = (amount) => {
  //   const obj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrexcepay",
  //     amount: amount

  //   };
  //   paymentHandler(obj)
  // }

  // const excessPaymentHandler = (amount) => {
  //   const obj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrepopay",
  //     amount: amount

  //   };
  //   paymentHandler(obj)
  // }

  // const postExcessAmountHandler = (amount) => {
  //   const obj = {
  //     ...retrivePaymentItem,
  //     PacketType: "retrexcepopay",
  //     amount: amount

  //   };
  //   paymentHandler(obj)
  // }

  const paymentHandler = (totAmount) => {
    setPaymentHandlerWind(false);
    setOpenPaymentAlert(false);
    console.log(retrivePaymentItem);
    const obj = {
      ...retrivePaymentItem,
      PacketType: "retrexcepopay",
      amount: totAmount - balanceAmount,
      Balance: balanceAmount,
    };
    console.log(obj);
    fetch(/* paymentUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "LOCEPORID-200") {
          razorPayPayment(data.orderId, data.totAmount);
          setPaymentHandlerWind(true);
        } else {
          alert("Something went wrong");
          setPaymentHandlerWind(true);
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        setPaymentHandlerWind(true);
      });
  };

  console.log("post amount : " + RetriveAuth.postPayItem.amount);

  const razorPayPayment = (orderId, amount) => {
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
          const obj = {
            PacketType: "retrexcepopaycnf",
            responseCode: "paymentSuccess",
            OrderId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignatur: response.razorpay_signature,
          };
          paymentStatusHandler(obj);
        }
        // else {
        //   setCount((count) => count + 1);
        //   if (count === 3) {
        //     let timeLeft = 3;
        //     const timeInterval = setTimeout(() => {
        //       if (timeLeft === 0) {
        //         clearInterval(timeInterval);
        //       }
        //       timeLeft = timeLeft - 1;
        //     }, 100);

        //     const obj = {
        //       PacketType: "retrexcepopaycnf",
        //       responseCode: "payFailCancel",
        //       OrderId: orderId,
        //     };
        //     paymentStatusHandler(obj);
        //   }
        // }
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    // setIsError(true);

    let timeLeft = 4;
    timeInterval.current = setInterval(() => {
      if (timeLeft === 0) {
        // alert(count);
        setCount((count) => count + 1);
        if (count >= 2) {
          setIsInfo(true);
          setIsError(false);
          setOrder_id(orderId);
        }
        clearInterval(timeInterval.current);
      }
      timeLeft = timeLeft - 1;
    }, 1000);

    // const obj = {
    //   PacketType: "retrexcepopaycnf",
    //   responseCode: "payFailCancel",
    //   OrderId: orderId,
    // };
    // paymentStatusHandler(obj);

    // paymentObject.createElement()
  };

  // const payemtnStatUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/PaymentConfirm";
  const paymentStatusHandler = (stat) => {
    setPaymentHandlerWind(false);
    const respObj = {
      ...retrivePaymentItem,
      ...stat,
    };

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
        if (data.responseCode === "LOCRS-200") {
          setIsError(false);
          // if (count === 2) {
          setIsSuccess(true);
          let timeLeft = 5;
          const timeInterval = setTimeout(() => {
            if (timeLeft <= 0) {
              clearInterval(timeInterval);
            }
            timeLeft = timeLeft - 1;
          }, 1000);
          // }
          setPaymentHandlerWind(true);
          navigate("/verlockopenret", { replace: true });
        } else if (data.responseCode === "LOCRETCA-201") {
          setIsError(true);
          setIsSuccess(false);
          setPaymentHandlerWind(true);
        }
      });
  };

  const payLaterFormSubmit = () => {
    const retrievePayFailObj = {
      ...retrivePaymentItem,
      PacketType: "retrexcepopaycnf",
      responseCode: "payFailCancel",
      OrderId: order_id,
    };

    console.log(retrievePayFailObj);
    fetch(serverUrl.path, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(retrievePayFailObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "LOCRS-200") {
          navigate("/verlockopenret", { replace: true });
        } else if (data.responseCode === "LOCRETCA-201") {
          RetriveAuth.retrievPacketTypeHandler(retrievePayFailObj.PacketType);
          navigate("/verlockopenret", { replace: true });
        } else if (data.responseCode === "STLFAIL") {
          setIsError(true);
        }
      });
  };

  const timeCalculation = (time) => {
    console.log(time);
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const totTime = hour + " hours," + minute + " minutes";
    return totTime;
  };

  const closeErrorAlert = () => {
    setIsError(false);
  };

  const closeSuccessAlert = () => {
    setIsSuccess(false);
  };

  const closeInfoAlert = () => {
    setIsInfo(false);
  };

  const handleOpenPayAlert = (amount) => {
    setOpenPaymentAlert(true);

    setPayableAmount(amount);
  };

  function closePaymentAlert() {
    setOpenPaymentAlert(false);
  }

  return (
    <div className="retrive-payment-container">
      <div className="retrive-pay-wind">
        <img className="logo-container" src={YLogo} alt="img" width={100} />
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Collapse in={isError}>
            <Alert
              variant="standard"
              severity="error"
              onClose={() => closeErrorAlert()}
            >
              {language.RetrieveOption.somethingwrong}
              {/* Failed, Something went wrong !! */}
            </Alert>
          </Collapse>

          <Collapse in={isSuccess}>
            <Alert
              variant="standard"
              severity="success"
              onClose={() => closeSuccessAlert()}
            >
              {language.RetrieveOption.successmsg}
              {/* Success, Good To Go !! */}
            </Alert>
          </Collapse>

          <Collapse in={false}>
            <Alert
              variant="standard"
              severity="warning"
              onClose={() => closeInfoAlert()}
            >
              {language.RetrieveOption.dueamnt}
              {/* Your Payment Failed ! Due Amount Will be Carried Further */}
            </Alert>
          </Collapse>
        </Stack>
        {count >= 3 ? (
          <div className="retr-pay-fail-wind">
            <div className="passcode-header">
              <h4>{language.RetrieveOption.paymntdue}</h4>
              {/* <h4> Your Payment Failed Due to some techincal reasons</h4> */}
            </div>

            <h6>
              {language.RetrieveOption.payNextTransaction}
              {/* You can retrieve your items now and Your balance will be carried
              forward with next transaction. */}
            </h6>
            {/* {balanceAmount !== 0 && (
              <h5 className="balance-amount-container">
                Balance Amount :{" "}
                <strong className="balance-amount">
                  <br /> {balanceAmount + ".00Rs "}{" "}
                </strong>
              </h5>
            )} */}

            {postPay.Hour ? (
              <h5 className="balance-amount-container">
                {language.RetrieveOption.BalanceAmnt}{" "}
                {/* Balance Amount :{" "} */}
                <strong className="balance-amount">
                  <br />{" "}
                  {Number(postPay.totalAmount) % 1 === 0
                    ? postPay.totalAmount + ".00 Rs "
                    : postPay.totalAmount + ".Rs "}{" "}
                </strong>
              </h5>
            ) : excessTimeUsage.EXHour ? (
              <h5 className="balance-amount-container">
                {language.RetrieveOption.BalanceAmnt}{" "}
                {/* Balance Amount :{" "} */}
                <strong className="balance-amount">
                  <br />{" "}
                  {Number(excessTimeUsage.totalAmount) % 1 === 0
                    ? excessTimeUsage.totalAmount + ".00 Rs "
                    : excessTimeUsage.totalAmount + " Rs"}{" "}
                </strong>
              </h5>
            ) : (
              postPayExcessUsage.Hour && (
                <h5 className="balance-amount-container">
                  {language.RetrieveOption.BalanceAmnt}{" "}
                  {/* Balance Amount :{" "} */}
                  <strong className="balance-amount">
                    <br />{" "}
                    {Number(postPayExcessUsage.totAmount) % 1 === 0
                      ? postPayExcessUsage.totAmount + ".00 Rs "
                      : postPayExcessUsage.totAmount + " Rs"}{" "}
                  </strong>
                </h5>
              )
            )}

            {/* <h4> You can Pay it while using locker for the next time !!</h4> */}
            <div className="form-container">
              <Button
                color="primary"
                className="mui-btn-color-yellow"
                variant="contained"
                onClick={() => payLaterFormSubmit()}
              >
                {language.RetrieveOption.retrievePayLater}
                {/* Retrieve And PayLater */}
              </Button>
            </div>
          </div>
        ) : (
          <Box
            component="form"
            sx={{
              // "& .MuiTextField-root": { m: 1, width: "30ch" },
              "& .MuiTextField-root": { m: 1, height: "6ch" },
            }}
            noValidate
            autoComplete="off"
          >
            {excessTimeUsage.EXHour ? (
              <>
                <h2 className="container-item-header">
                  {language.RetrieveOption.excessTimeUsage}
                </h2>
                {/* <h2 className="container-item-header">Excess usage</h2> */}
                <div className="form-container">
                  <TextField
                    label="excess time"
                    type="text"
                    name="eHour"
                    variant="outlined"
                    color="primary"
                    value={timeCalculation(excessTimeUsage.EXHour)}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    fullWidth
                    required
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="excess amount"
                    type="text"
                    name="eAmount"
                    variant="outlined"
                    color="primary"
                    // helperText="including GST"
                    value={
                      Number(excessTimeUsage.eamount) % 1 === 0
                        ? excessTimeUsage.eamount + ".00 Rs"
                        : excessTimeUsage.eamount + " Rs"
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    fullWidth
                    required
                  />
                </div>

                {/*  praveen edit here for the major change dec 2023 for GST Amount*/}

                {balanceAmount > 0 ? (
                  <>
                    <div className="form-container">
                      <TextField
                        label="Balance amount"
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        color="primary"
                        // helperText="including GST"
                        value={balanceAmount + ".00 Rs"}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>

                    {/* Praveen edit here for GAmount */}

                    <div className="form-container">
                      <TextField
                        // label="Balance amount"
                        label={
                          RetriveAuth.retriveLockContainer.GSTAmount +
                          "% added GST amount"
                        }
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        color="primary"
                        // helperText="including GST"
                        // value={balanceAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (balanceAmount +
                              Number(excessTimeUsage.eamount) -
                              (Number(excessTimeUsage.totalAmount) +
                                Number(excessTimeUsage.totalAmount) *
                                  (RetriveAuth.retriveLockContainer.GSTAmount /
                                    100)) +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>

                    <div className="form-container">
                      <TextField
                        label="total amount INCL balance"
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        placeholder=""
                        color="primary"
                        helperText="including GST"
                        // value={excessTimeUsage.totalAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(excessTimeUsage.totalAmount) +
                              Number(excessTimeUsage.totalAmount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) +
                              Number.EPSILON) *
                              100
                          ) /
                            100 +
                          " Rs"
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    {/* Praveen edit here for the gst amount dec 2023*/}
                    <div className="form-container">
                      <TextField
                        // label="Balance amount"
                        label={
                          RetriveAuth.retriveLockContainer.GSTAmount +
                          "% added GST amount"
                        }
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        color="primary"
                        // helperText="including GST"
                        // value={balanceAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(excessTimeUsage.eamount) +
                              Number(excessTimeUsage.eamount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) -
                              Number(excessTimeUsage.eamount) +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>
                    <div className="form-container">
                      <TextField
                        label="Total amount"
                        // label={
                        //   RetriveAuth.retriveLockContainer.GSTAmount +
                        //   "% added GST Amount"
                        // }
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        color="primary"
                        helperText="including GST"
                        // value={balanceAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(excessTimeUsage.eamount) +
                              Number(excessTimeUsage.eamount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>{" "}
                  </>
                )}

                {paymentHandlerWind ? (
                  <div className=" form-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mui-btn-color-yellow"
                      onClick={() =>
                        // paymentHandler(excessTimeUsage.totalAmount)
                        handleOpenPayAlert(excessTimeUsage.totalAmount)
                      }
                      fullWidth
                    >
                      {" "}
                      {language.RetrieveOption.proceedpay}{" "}
                      {/* proceed to pay{" "} */}
                    </Button>
                  </div>
                ) : (
                  <div className=" form-container">
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {language.RetrieveOption.load}
                      {/* loading */}
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : postPay.Hour ? (
              <>
                <h2 className="container-item-header">
                  {language.RetrieveOption.postpay}
                </h2>
                {/* <h2 className="container-item-header">post payment</h2> */}
                <div className=" form-container">
                  <TextField
                    label="Total hour"
                    type="text"
                    name="hour"
                    variant="outlined"
                    value={timeCalculation(postPay.Hour)}
                    color="primary"
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="Amount"
                    type="text"
                    name="amount"
                    variant="outlined"
                    color="primary"
                    // helperText="including GST"
                    value={postPay.amount + ".00 Rs"}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                {/* <div className="form-container">
                  <TextField
                    label="Total Amount"
                    type="text"
                    name="amount"
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    // value={postPay.amount + ".00 Rs"}
                    value={
                      Math.round(
                        (Number(postPay.amount) +
                          Number(postPay.amount) *
                            (RetriveAuth.retriveLockContainer.GSTAmount / 100) +
                          Number.EPSILON) *
                          100
                      ) /
                        100 +
                      " Rs"
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div> */}
                {balanceAmount > 0 ? (
                  <>
                    <div className="form-container">
                      <TextField
                        label="Balance amount"
                        type="text"
                        name="balance"
                        variant="outlined"
                        color="primary"
                        // helperText="including GST"
                        value={balanceAmount + ".00 Rs"}
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>

                    {/* Praveen edit here for GAmount */}

                    <div className="form-container">
                      <TextField
                        // label="Balance amount"
                        label={
                          RetriveAuth.retriveLockContainer.GSTAmount +
                          "% added GST amount"
                        }
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        color="primary"
                        // helperText="including GST"
                        // value={balanceAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(postPay.totalAmount) +
                              Number(postPay.totalAmount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) -
                              Number(postPay.totalAmount) +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>

                    <div className="form-container">
                      <TextField
                        // label="total amount"
                        label="Total amount INCL balance"
                        type="text"
                        name="totalAmount"
                        variant="outlined"
                        color="primary"
                        helperText="including GST"
                        // value={postPay.totalAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(postPay.totalAmount) +
                              Number(postPay.totalAmount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) +
                              Number.EPSILON) *
                              100
                          ) /
                            100 +
                          " Rs"
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Praveen edit here for GAmount */}
                    <div className="form-container">
                      <TextField
                        // label="Balance amount"
                        label={
                          RetriveAuth.retriveLockContainer.GSTAmount +
                          "% added GST amount"
                        }
                        type="text"
                        name="eAmount"
                        variant="outlined"
                        color="primary"
                        // helperText="including GST"
                        // value={balanceAmount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(postPay.totalAmount) +
                              Number(postPay.totalAmount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) -
                              Number(postPay.totalAmount) +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        fullWidth
                        required
                      />
                    </div>
                    <div className="form-container">
                      <TextField
                        label="Total amount"
                        type="text"
                        name="amount"
                        variant="outlined"
                        color="primary"
                        helperText="including GST"
                        // value={postPay.amount + ".00 Rs"}
                        value={
                          Math.round(
                            (Number(postPay.amount) +
                              Number(postPay.amount) *
                                (RetriveAuth.retriveLockContainer.GSTAmount /
                                  100) +
                              Number.EPSILON) *
                              100
                          ) /
                            100 +
                          " Rs"
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        focused
                        required
                        fullWidth
                      />
                    </div>{" "}
                  </>
                )}
                {paymentHandlerWind ? (
                  <div className="form-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mui-btn-color-yellow"
                      onClick={() => handleOpenPayAlert(postPay.totalAmount)}
                      fullWidth
                    >
                      {" "}
                      {language.RetrieveOption.proceedpay}{" "}
                      {/* proceed to pay{" "} */}
                    </Button>
                  </div>
                ) : (
                  <div className="form-container">
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {language.RetrieveOption.load}
                      {/* loading */}
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : postPayExcessUsage.EXHour ? (
              <>
                <h2 className="container-item-header">
                  {language.RetrieveOption.postandexcesspay}
                  {/* post payment and Excess usage */}
                </h2>
                <div className="form-container">
                  <TextField
                    label="Selected time"
                    type="text"
                    name="hour"
                    variant="outlined"
                    color="primary"
                    value={timeCalculation(postPayExcessUsage.Hour)}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="Amount"
                    type="text"
                    name="amount"
                    variant="outlined"
                    color="primary"
                    // helperText="including GST"
                    value={postPayExcessUsage.amount + ".00 Rs"}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>
                <div className="form-container">
                  <TextField
                    label="Excess time"
                    type="text"
                    name="eHour"
                    variant="outlined"
                    color="primary"
                    value={timeCalculation(postPayExcessUsage.EXHour)}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>

                <div className="form-container">
                  <TextField
                    label="Excess amount"
                    type="text"
                    name="eAmount"
                    variant="outlined"
                    // helperText="including GST"
                    color="primary"
                    value={postPayExcessUsage.eamount + ".00 Rs"}
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    required
                    fullWidth
                  />
                </div>
                {balanceAmount > 0 && (
                  <div className="form-container">
                    <TextField
                      label="Balance amount"
                      type="text"
                      name="balance"
                      variant="outlined"
                      color="primary"
                      // helperText="including GST"
                      value={balanceAmount + ".00 Rs"}
                      InputProps={{
                        readOnly: true,
                      }}
                      focused
                      fullWidth
                      required
                    />
                  </div>
                )}

                {/* Praveen edit here for GAmount */}
                <div className="form-container">
                  <TextField
                    // label="Balance amount"
                    label={
                      RetriveAuth.retriveLockContainer.GSTAmount +
                      "% added GST amount"
                    }
                    type="text"
                    name="eAmount"
                    variant="outlined"
                    color="primary"
                    // helperText="including GST"
                    // value={balanceAmount + ".00 Rs"}
                    value={
                      Math.round(
                        (Number(postPayExcessUsage.totAmount) +
                          Number(postPayExcessUsage.totAmount) *
                            (RetriveAuth.retriveLockContainer.GSTAmount / 100) -
                          Number(postPayExcessUsage.totAmount) +
                          Number.EPSILON) *
                          100
                      ) / 100
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    focused
                    fullWidth
                    required
                  />
                </div>

                <div className="form-container">
                  <TextField
                    // label="total Amount"
                    label="total amount INCL balance"
                    type="text"
                    name="totAmount"
                    variant="outlined"
                    color="primary"
                    helperText="including GST"
                    // value={postPayExcessUsage.totAmount + ".00 Rs"}
                    value={
                      Math.round(
                        (Number(postPayExcessUsage.totAmount) +
                          Number(postPayExcessUsage.totAmount) *
                            (RetriveAuth.retriveLockContainer.GSTAmount / 100) +
                          Number.EPSILON) *
                          100
                      ) /
                        100 +
                      " Rs"
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    focused
                    required
                  />
                </div>

                {paymentHandlerWind ? (
                  <div className="form-container">
                    <Button
                      variant="contained"
                      color="primary"
                      className="mui-btn-color-yellow"
                      onClick={() =>
                        handleOpenPayAlert(postPayExcessUsage.totAmount)
                      }
                      fullWidth
                    >
                      {" "}
                      {language.RetrieveOption.proceedpay}{" "}
                      {/* proceed to pay{" "} */}
                    </Button>
                  </div>
                ) : (
                  <div className="btn-container">
                    <LoadingButton
                      loading
                      loadingPosition="end"
                      endIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {language.RetrieveOption.load}
                      {/* loading ... */}
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : null}
          </Box>
        )}
      </div>

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
            onClick={() => paymentHandler(payableAmount)}
            autoFocus
          >
            {language.LockerReservationPage.payNowBtn}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RetrivePayment;
