import { LoadingButton } from "@mui/lab";
import { Alert, Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import { useLocation, useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./mobile-locker.css";

const VerifyOtp = (props) => {
  const [openLockerDialog, setOpenLockerDialog] = useState(false);

  const amount = 10;
  const lockerNo = "S2";
  const lockerType = "Small";

  const mobileNo = props.mobileNo;

  const handleClickOpen = () => {
    setOpenLockerDialog(true);
  };

  const handleClose = () => {
    setOpenLockerDialog(false);
  };

  const [timeInterval, setTimeInterval] = useState(30);
  const count = useRef(null);
  const inputs = useRef([]);

  const [otp, setOtp] = useState("");

  const [activeError, setActiveError] = useState(false);
  const [activeSuccess, setActiveSuccess] = useState(false);
  const [activeInfo, setActiveInfo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [lockavsUser, setLockavsUser] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [enteredOtp, setOtpEntered] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  useEffect(() => {
    if (count.current !== null) {
      clearIntervalFun();
      setTimeInterval(30);
    }
    timeCountdown();
  }, []);

  const timeCountdown = () => {
    count.current = setInterval(() => {
      setTimeInterval((prevValue) => {
        if (prevValue <= 1) {
          clearIntervalFun();
          return 0;
        } else {
          return prevValue - 1;
        }
      });
    }, 1000);
  };

  const clearIntervalFun = () => {
    clearInterval(count.current);
  };

  useEffect(() => {
    inputs.current[0].focus();
    setOtp("1234");
  }, []);

  const verifyEnteredOtpEvent = (e, index) => {
    if (e.target.value.length <= 1) {
      setOtpEntered({
        ...enteredOtp,
        [e.target.name]: e.target.value,
      });

      if ((e.target.value !== "") && (index < 3 && e.target.value >= 0)) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const loadOtpInputFields = () => {
    const elements = [];
    for (let index = 0; index < 4; index++) {
      elements.push(
        <input
          className="otp-input-field"
          key={index}
          style={{ marginRight: 20 }}
          name={index}
          value={enteredOtp[index]}
          type="number"
          maxLength={1}
          ref={(el) => (inputs.current[index] = el)}
          onChange={(e) => verifyEnteredOtpEvent(e, index)}
        ></input>
      );
    }

    return elements;
  };

  const VerifyOtpHandler = () => {

    // alert("clicked here")
    setLoading(true);
    const userEnteredOtp =
      enteredOtp[0] + enteredOtp[1] + enteredOtp[2] + enteredOtp[3];

    if (userEnteredOtp.length === 4) {

      const otpVerifyResp = props.verifyOTP(userEnteredOtp);

      // console.log(otpVerifyResp);

      if (otpVerifyResp === "otp-200") {

        clearIntervalFun();
        location.pathname = "/lockers/user-details";

        navigate(location.pathname, { replace: true });

        handleClickOpen();

        // location.pathname = "/lockers/user-details";

        // navigate(location.pathname, { replace: true });

        setActiveSuccess(true);
        setActiveError(false);
        setActiveInfo(false);
      } else if (otpVerifyResp === "otp-404") {

        setOtpEntered({
          0: "",
          1: "",
          2: "",
          3: ""
        })

        setActiveError(true);
        setActiveSuccess(false);
        setActiveInfo(false);

      } else if (otpVerifyResp === "lockavs") {
        clearIntervalFun();
        setOtpEntered({
          0: "",
          1: "",
          2: "",
          3: ""
        })

        setLockavsUser(true)
      } else if (otpVerifyResp === "lock-balance-200") {
        clearIntervalFun();
        // setOtpEntered({
        //   0: "",
        //   1: "",
        //   2: "",
        //   3: ""
        // })

        setActiveSuccess(true);
        setActiveError(false);
        setActiveInfo(false);

        // setLockavsUser(true)
      }


      // if (otp === userEnteredOtp) {


      //   clearIntervalFun();

      //   handleClickOpen();

      //   setActiveSuccess(true);
      //   setActiveError(false);
      //   setActiveInfo(false);


      // } else {
      //   setActiveError(true);
      //   setActiveSuccess(false);
      //   setActiveInfo(false);
      // }


    } else {
      setActiveInfo(true);
      setActiveSuccess(false);
      setActiveError(false);
    }
    setLoading(false);
  };

  const hideErrorAlert = () => {
    setActiveError(false);
    setActiveSuccess(false);
    setActiveInfo(false);
  };

  const hideSuccessAlert = () => {
    setActiveError(false);
    setActiveSuccess(false);
    setActiveInfo(false);
  };

  const hideInfoAlert = () => {
    setActiveError(false);
    setActiveSuccess(false);
    setActiveInfo(false);
    setLockavsUser(false)
  };

  const backToGenerateOTP = () => {
    console.log("clicked");
    props.onGenerateClick(false, mobileNo);
    clearIntervalFun();
  };

  const onLockerConfirm = () => {
    location.pathname = "/lockers/user-details";

    navigate(location.pathname, { replace: true });
  };

  return (
    <div className="otp-generate-page">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {activeError && (
          <Alert
            // variant="filled"
            severity="error"
            onClose={() => hideErrorAlert()}
          >
            {/* {language.LoginOTP.OTPAlert} */}
            OTP did not match
          </Alert>
        )}

        {activeSuccess && (
          <Alert
            // variant="filled"
            severity="success"
            onClose={() => hideSuccessAlert()}
          >
            OTP Verified
          </Alert>
        )}

        {activeInfo && (
          <Alert
            // variant="filled"
            severity="info"
            onClose={() => hideInfoAlert()}
          >
            {/* {language.LoginOTP.ValidOTPAlert} */}
            Please Enter Valid OTP
          </Alert>
        )}

        {lockavsUser && (
          <Alert
            // variant="filled"
            severity="success"
            onClose={() => hideInfoAlert()}
          >
            {/* {language.LoginOTP.ValidOTPAlert} */}
            OTP Verified AND Your Locker Has Been Confirmed
          </Alert>
        )}
      </Stack>

      <h2>Verify OTP</h2>

      <div className="mobile-time-interval">
        <h1 style={{ marginTop: "5px" }}>{timeInterval}</h1>
      </div>

      <div className="otp-input-container">
        <h6>Enter Otp Here</h6>
        <div>{loadOtpInputFields()}</div>
      </div>

      <Button className="resend-otp" onClick={() => backToGenerateOTP()}>
        Resend OTP
      </Button>

      <div className="mob-lock-btn-container">
        {/* <Button
          variant="contained"
          className="mob-locker-btn"
          onClick={() => VerifyOtpHandler()}
          fullWidth

        >
          Verify OTP
        </Button> */}

        {timeInterval <= 0 ? (
          <LoadingButton
            size="small"
            // onClick={handleClick}
            // loading={loading}
            // className="mob-locker-btn"
            // loadingIndicator="Loading…"
            variant="contained"
            loadingPosition="end"
            endIcon={<SendIcon />}
            // onClick={() => VerifyOtpHandler()}
            sx={{
              mb: 2,
              padding: '10px'
            }}
            disabled
            fullWidth
          >
            <span> {loading ? "Verifying" : "Verify OTP"} </span>
          </LoadingButton>
        ) : (
          <LoadingButton
            size="small"
            // onClick={handleClick}
            loading={loading}
            className="mob-locker-btn"
            // loadingIndicator="Loading…"
            variant="outlined"
            loadingPosition="end"
            endIcon={<SendIcon />}
            onClick={() => VerifyOtpHandler()}
            fullWidth
          >
            <span> {loading ? "Verifying" : "Verify OTP"} </span>
          </LoadingButton>
        )}

        {/* <LoadingButton
          size="small"
          // onClick={handleClick}
          loading={loading}
          className="mob-locker-btn"
          // loadingIndicator="Loading…"
          variant="outlined"
          loadingPosition="end"
          endIcon={<SendIcon />}
          onClick={() => VerifyOtpHandler()}
          fullWidth
        >
          <span> {loading ?  "Verifying" : "Verify OTP" } </span>
        </LoadingButton> */}

        <Dialog
          // fullScreen={fullScreen}
          open={openLockerDialog}
          // onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            id="responsive-dialog-title"
            sx={{ bgcolor: "crimson", color: "#fff" }}
          >
            {"Remember The Locker Name"}
          </DialogTitle>
          {/* <DialogContent> */}
          <div className="mobile-locker-assigned">
            <div className="mobile-locker-design">
              <h2
                style={{
                  paddingTop: "15px",
                  fontWeight: 600,
                }}
              >
                {lockerNo}
              </h2>
            </div>
            <div className="mobilelocker-descr-container">
              <h2 style={{ color: "#ffeec7", marginTop: "-15px", }}>
                {amount + " Rs"}
              </h2>

              <h6 style={{ color: "#ffeec7", marginBottom: "25px" }}>
                {"Locker Type : " + lockerType}
              </h6>
            </div>
          </div>
          {/* </DialogContent> */}
          <DialogActions>
            <Button color="warning" variant="outlined" autoFocus onClick={handleClose} sx={{ marginTop: "8px" }}>
              Close
            </Button>
            <Button color="success" onClick={() => onLockerConfirm()} variant="outlined" sx={{ marginTop: "8px" }} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VerifyOtp;
