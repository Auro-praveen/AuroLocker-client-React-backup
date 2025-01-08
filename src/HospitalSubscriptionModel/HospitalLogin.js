import { Alert, containerClasses, Snackbar, TextField } from "@mui/material";
import React from "react";
import blueLogo from "../logos/logo_blue.png";
import yellowLogo from "../logos/logo_yellow.png";
import yellowTextLogo from "../logos/tuckit_yellow_text_c.png";
import { LoadingButton } from "@mui/lab";

import "./hospitalLocks.css";
import HospitalLockOptn from "./HospitalLockOpen";

import HospitalLoginForm from "./HospitalLoginForm";

const RequestUrl = "http://192.168.0.186/AuroLocker/AuroHospitalRequest";

class HospitalLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    mobileNo: "",
    passcode: "",
    isUserVerified: false,
    lockerNo: "",
    lockOpenRequestCount: 0,
    submitBtnLoading: false,
    alertObjects: {
      openErrorAlert: false,
      vertical: "top",
      horizontal: "center",
      openWarningAlert: true,
      lockerFailedToOpen: false,
    },
  };

  onInputKeyEventHandler = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  submitLoginform = async (e) => {
    e.preventDefault();

    this.setState({
      ...this.state,
      submitBtnLoading: true,
    });

    const reqObject = {
      mobileNo: this.state.mobileNo,
      passcode: this.state.passcode,
      PacketType: "strhospital",
    };

    const result = await this.requestToServer(reqObject)
      .then((data) => data.json())
      .catch((err) => {
        this.setState({
          ...this.state,
          submitBtnLoading: false,
          isUserVerified: true,
        });
        console.log("error : " + err);
      });

    if (result) {
      if (result.responseCode === "res-200") {
        this.setState({
          ...this.state,
          isUserVerified: true,
          lockerNo: result.lockerNo,
          submitBtnLoading: false,
        });
      } else {
        this.setState({
          ...this.state,
          submitBtnLoading: false,
          ...this.state.alertObjects,
        });
      }
    }
  };

  requestToServer = async (object) => {
    return await fetch(RequestUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(object),
    });
  };

  handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      ...this.state,
      alertObjects: {
        ...this.state.alertObjects,
        openErrorAlert: false,
        openWarningAlert: false,
        lockerFailedToOpen: false,
      },
    });
  };

  render() {
    const { mobileNo, passcode, submitBtnLoading } = this.state;
    const isUserVerified = this.state.isUserVerified;
    const { lockerNo, lockOpenRequestCount } = this.state;

    const {
      openErrorAlert,
      openWarningAlert,
      vertical,
      horizontal,
      lockerFailedToOpen,
    } = this.state.alertObjects;

    return (
      <div className="hospital-lockers-main-container">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openErrorAlert}
          onClose={this.handleCloseAlert}
          autoHideDuration={6000}
        >
          <Alert
            onClose={this.handleCloseAlert}
            severity="error"
            variant="standard"
            sx={{ width: "fit-content" }}
          >
            Some issue with the server please try again later
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openWarningAlert}
          onClose={this.handleCloseAlert}
          autoHideDuration={6000}
        >
          <Alert
            onClose={this.handleCloseAlert}
            severity="warning"
            variant="standard"
            sx={{ width: "fit-content" }}
          >
            Provided credential didn't match
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={lockerFailedToOpen}
          onClose={this.handleCloseAlert}
          autoHideDuration={6000}
        >
          <Alert
            onClose={this.handleCloseAlert}
            severity="error"
            variant="standard"
            sx={{ width: "fit-content" }}
          >
            Locker failed to open, please try again or contact support team
          </Alert>
        </Snackbar>

        <div className="hospital-locker-item-containers">
          <div className="hospital-header-logo-container">
            <img
              src={yellowTextLogo}
              alt="logo"
              className="hospital-logo-container"
              width={200}
            />
          </div>

          {isUserVerified ? (
            <HospitalLockOptn
              lockerNo={lockerNo}
              lockOpenRequestcount={lockOpenRequestCount}
              requestToServer={this.requestToServer.bind(this)}
            />
          ) : (
            <HospitalLoginForm
              mobileNo={mobileNo}
              passcode={passcode}
              onInputKeyEventHandler={this.onInputKeyEventHandler.bind(this)}
              submitLoginform={this.submitLoginform.bind(this)}
              submitBtnLoading={submitBtnLoading}
            />
          )}
        </div>
      </div>
    );
  }
}

export default HospitalLogin;
