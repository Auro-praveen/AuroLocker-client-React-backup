import React from "react";
import YLogo from "../../logos/logo_yellow.png";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useLocation, useNavigate } from "react-router-dom";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileLockerUserDetails = (props) => {
  const [userDOB, setUserDOB] = useState({
    date: "",
    month: "",
    year: "",
  });

  const [userPasscode, setUserPasscode] = useState({
    passcode: "",
    verPasscode: "",
  });

  const [userName, setUserName] = useState("Nikhil");

  const location = useLocation();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const [isPasscodeMatch, setIsPasscodeMatch] = useState(false);

  const [userdobInString, setUserdobInString] = useState("");

  const [isDateValid, setIsDateValid] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const mobileLockerAuth = useMobileLockerAuth();

  const handleChangeEvent = (e) => {
    // let enteredDate = e.target.value;
    // if (enteredDate.length === 2 || enteredDate.length === 5) {
    //   enteredDate += "-";
    // }
    // setUserDob(enteredDate);

    //changed praveen feb 15-2023

    let val;

    const name = e.target.name;

    if (name === "date" || name === "month") {
      if (e.target.value.length <= 2) {
        val = e.target.value;

        setUserDOB({
          ...userDOB,
          [name]: val,
        });
      }
    } else {
      if (e.target.value.length <= 4) {
        val = e.target.value;
        setUserDOB({
          ...userDOB,
          [name]: val,
        });
      }
    }
  };

  const verifyUserDateOfBirth = () => {
    // const dob = userDob.split("-");
    const date = new Date(userDOB.year, userDOB.month - 1, userDOB.date);
    let numMonth = date.getMonth() + 1;
    let strMonth = numMonth.toString();

    let numDate = date.getDate();
    let stringdate = numDate.toString();
    if (strMonth.length === 1) {
      console.log("length == 1");
      strMonth = 0 + String(strMonth);
    }
    if (stringdate.length === 1) {
      stringdate = 0 + stringdate;
    }
    const strDate =
      stringdate + "-" + strMonth + "-" + String(date.getFullYear());

    console.log("strDate");
    console.log(strDate);
    let userEnteredDate = "";

    if (userDOB.date.length === 1) {
      userEnteredDate += 0 + String(userDOB.date) + "-";
    } else if (userDOB.date.length === 2) {
      userEnteredDate += String(userDOB.date) + "-";
    }

    // else {
    //   setIsDateValid(false);
    //   alert("please enter valid date")
    // }

    if (userDOB.month.length === 1) {
      userEnteredDate += 0 + String(userDOB.month) + "-" + String(userDOB.year);
    } else if (userDOB.month.length === 2) {
      userEnteredDate += String(userDOB.month) + "-" + String(userDOB.year);
    }
    
    // else {
    //   setIsDateValid(false);
    //   alert("please enter valid date")
    // }

    console.log("===========");
    console.log(userEnteredDate);

    if (userDOB.year < 1920) {
      console.log("not valid date ");
      setUserDOB({
        date: "",
        month: "",
        year: "",
      });
      setIsDateValid(false);
      return null;
    } else if (strDate !== userEnteredDate) {
      console.log("not valid date ");
      setUserDOB({
        date: "",
        month: "",
        year: "",
      });
      setIsDateValid(false);
      return null;
    } else {
      const inDateForm =
        String(date.getFullYear()) + "-" + strMonth + "-" + stringdate;
      console.log(inDateForm);
      console.log("valid date ");
      setIsDateValid(true);
      return inDateForm;
    }
  };

  const handlePAsscode = (e) => {
    console.log(e.target.value.length);

    const numRegex = /^[0-9\b]+$/;

    if (e.target.value === "") {
      console.log("inside");
      setUserPasscode({
        ...userPasscode,
        [e.target.name]: String([e.target.value]),
      });
    } else {
      if (e.target.value.length <= 4 && numRegex.test(e.target.value)) {
        if (e.target.name === "passcode") {
          setUserPasscode({
            ...userPasscode,
            passcode: String([e.target.value]),
            verPasscode: "",
          });

          if (isPasscodeMatch) {
            setIsPasscodeMatch(false);
          }
        } else {
          setUserPasscode({
            ...userPasscode,
            [e.target.name]: String([e.target.value]),
          });

          if (
            userPasscode.passcode === e.target.value &&
            userPasscode.passcode.length === 4
          ) {
            setIsPasscodeMatch(true);
          } else {
            // isPasscodeMatch(false)
            if (isPasscodeMatch) {
              setIsPasscodeMatch(false);
            }
          }
        }
      }
    }

    console.log(userPasscode);
  };

  const handleProceed = () => {
    // if (userDOB.year.length !== 4) {
    //   alert("date is not valid");
    //   setIsDateValid(false);
    // } else {

    const isDateValid = verifyUserDateOfBirth();

    if (isDateValid) {
      if (
        userPasscode.passcode.length === 4 &&
        userPasscode.passcode === userPasscode.verPasscode
      ) {
        const alpabhetRegex = /[a-zA-Z\b]+$/;

        // console.log(alpabhetRegex.test(userName));

        // if (userName.length > 2 && alpabhetRegex.test(userName)) {

        //   const userObject = {
        //     username: userName,
        //     passcode: userPasscode.passcode,
        //     userDOB: userDOB.date + "-" + userDOB.month + "-" + userDOB.year
        //   }

        //   mobileLockerAuth.handleMobileLockerUsers(userObject)

        //   setOpenDialog(true);
        // } else {
        //   alert("Please Enter Valid UserName")
        // }

        const userObject = {
          username: userName,
          passcode: userPasscode.passcode,
          userDOB: userDOB.date + "-" + userDOB.month + "-" + userDOB.year,
        };

        mobileLockerAuth.handleMobileLockerUsers(userObject);

        setOpenDialog(true);
      }
    } else {
      alert("invalid Date Of Birth");
    }
    // }
  };

  const ProceedToVerifyDetails = () => {
    // location.pathname = "/lockers/verify-details";
    // navigate(location.pathname, {replace: true})

    // alert("clicked")

    props.handleSwitchPage(true);
  };

  const closeOpenDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="loginPage-container">
      <div className="mobile-locker-content">
        <img
          className="logo-container"
          src={YLogo}
          alt="img"
          width={100}
          style={{ marginTop: "-5px" }}
        />

        <div className="mobileuser-details">
          <h5>Please Enter The Following Details</h5>
          <hr />

          {/*  
          <div className="form-container">
            <TextField
              id="outlined-password-input"
              name="passcode"
              label={"User Name : "}
              color="success"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              required
              fullWidth
              focused
            />
          </div>

          */}

          <div className="date-container-form">
            {/* <label style={{ marginBottom: "10px" }}>{language.Customerdetails.dob}</label> */}

            <label
              className="info-label-mobilelockers"
              style={{ marginBottom: "10px" }}
            >
              <b>{"Enter Your DOB"}</b>
            </label>

            <br />

            <TextField
              type="text"
              value={userDOB.date}
              name="date"
              label="Date"
              color={isDateValid ? "primary" : "error"}
              placeholder="DD"
              onChange={handleChangeEvent}
              focused
              sx={{
                width: "65px",
                margin: "5px",
              }}
            />

            <TextField
              type="number"
              value={userDOB.month}
              label="Month"
              name="month"
              color={isDateValid ? "primary" : "error"}
              placeholder="MM"
              onChange={handleChangeEvent}
              focused
              sx={{
                width: "65px",
                margin: "5px",
              }}
            />

            <TextField
              type="number"
              value={userDOB.year}
              label="Year"
              name="year"
              color={isDateValid ? "primary" : "error"}
              placeholder="YYYY"
              onChange={handleChangeEvent}
              focused
              sx={{
                width: "110px",
                margin: "5px",
              }}
            />
          </div>

          <label
            className="info-label-mobilelockers"
            style={{ marginTop: "10px" }}
          >
            <b>{"Enter 4 Digit Passcode"}</b>
          </label>

          <p className="header-subpara">
            {"(Mandatory for retrieving your items)"}
          </p>

          <div className="form-container">
            <TextField
              id="outlined-password-input"
              name="passcode"
              label={"Passcode"}
              color="success"
              variant="outlined"
              value={userPasscode.passcode}
              onChange={(e) => handlePAsscode(e)}
              type="password"
              required
              fullWidth
              focused
            />
          </div>

          <div className="form-container">
            <TextField
              id="outlined-password-input"
              name="verPasscode"
              label={"Verify Passcode"}
              color={
                userPasscode.verPasscode.length >= 1
                  ? isPasscodeMatch
                    ? "success"
                    : "error"
                  : "success"
              }
              variant="outlined"
              value={userPasscode.verPasscode}
              onChange={(e) => handlePAsscode(e)}
              type="password"
              required
              fullWidth
              focused
              helperText={
                userPasscode.verPasscode.length >= 1
                  ? isPasscodeMatch
                    ? "Passcode Matched"
                    : "Passcode didnt Match"
                  : ""
              }
            />
          </div>

          {
            // isPasscodeMatch && userName.length > 2 ?
            isPasscodeMatch ? (
              <div
                className="mob-lock-btn-container"
                style={{ marginTop: "20px" }}
              >
                <LoadingButton
                  variant="contained"
                  className="mob-locker-btn"
                  onClick={() => handleProceed()}
                  loading={isLoading}
                  endIcon={<SendIcon />}
                  fullWidth
                >
                  <span> {!isLoading ? "Proceed" : "Submitting.."} </span>
                </LoadingButton>
              </div>
            ) : (
              <div
                className="mob-lock-btn-container"
                style={{ marginTop: "20px" }}
              >
                <LoadingButton
                  variant="contained"
                  // className="mob-locker-btn"
                  // onClick={() => handleProceed()}
                  endIcon={<SendIcon />}
                  fullWidth
                  disabled
                  sx={{
                    mb: 2,
                  }}
                >
                  <span> {"Proceed"} </span>
                </LoadingButton>
              </div>
            )
          }

          {/* <div className="form-container">
            {userPasscode.passcode.length === 4 &&
              userPasscode.passcode === userPasscode.verPasscode ? (
              <div>
                {" "}
                <TextField
                  id="outlined-password-input"
                  name="verPasscode"
                  label={"Verify Passcode"}
                  color="success"
                  variant="outlined"
                  value={userPasscode.verPasscode}
                  onChange={(e) => handlePAsscode(e)}
                  type="password"
                  required
                  fullWidth
                  focused
                />
                <div
                  className="mob-lock-btn-container"
                  style={{ marginTop: "20px" }}
                >
                  <LoadingButton
                    variant="contained"
                    className="mob-locker-btn"
                    onClick={() => handleProceed()}
                    loading={isLoading}
                    endIcon={<SendIcon />}
                    fullWidth
                  >
                    <span> {!isLoading ? "Proceed" : "Submitting.."} </span>
                  </LoadingButton>
                </div>
              </div>
            ) : userPasscode.verPasscode.length < 1 ? (
              <div>
                {" "}
                <TextField
                  id="outlined-password-input"
                  name="verPasscode"
                  label={"Verify Passcode"}
                  color="success"
                  variant="outlined"
                  value={userPasscode.verPasscode}
                  onChange={(e) => handlePAsscode(e)}
                  type="password"
                  required
                  fullWidth

                  focused
                />
                <div
                  className="mob-lock-btn-container"
                  style={{ marginTop: "20px" }}
                >
                  <LoadingButton
                    variant="contained"
                    // className="mob-locker-btn"
                    // onClick={() => handleProceed()}
                    endIcon={<SendIcon />}
                    fullWidth
                    disabled
                  >
                    <span> {"Proceed"} </span>
                  </LoadingButton>
                </div>
              </div>
            ) : (
              <div>
                <TextField
                  id="outlined-password-input"
                  name="verPasscode"
                  label={"Verify Passcode"}
                  color="error"
                  variant="outlined"
                  value={userPasscode.verPasscode}
                  onChange={(e) => handlePAsscode(e)}
                  type="password"
                  required
                  fullWidth
                  focused
                  helperText="Password Dind'nt Match"
                />

                <div
                  className="mob-lock-btn-container"
                  style={{ marginTop: "20px" }}
                >
                  <LoadingButton
                    variant="contained"
                    // className="mob-locker-btn"
                    // onClick={() => handleProceed()}
                    endIcon={<SendIcon />}
                    fullWidth
                    disabled
                  >
                    <span> {"Proceed"} </span>
                  </LoadingButton>
                </div>

              </div>
            )}
          </div> */}
        </div>

        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          //   onClose={() => closeOpenDialog()}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Remeber The Passcode"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Please Remeber the Passcode That You Have Entered, Will Be Asked
              While Retrieving Your Items
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeOpenDialog()}>Re-Enter Passcode</Button>
            <Button onClick={() => ProceedToVerifyDetails()}>Proceed</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default MobileLockerUserDetails;
