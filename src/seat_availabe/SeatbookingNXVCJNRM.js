import React, { useState } from "react";
import "./seat.css";
// import Seatbooking1 from "./Seatbooking1";
import SubmitLock from "../SubmitSelectedLock/SubmitLock";
import { BiRupee, BiWindows } from "react-icons/bi";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Col from "react-bootstrap/Col";
import Lockers from "./LockersJson/lockers.json";
import Button from "@mui/material/Button";
import { useAuth } from "../GlobalFunctions/Auth";
import { useEffect } from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import YLogo from "../logos/logo_yellow.png";

import Grid from "@mui/material/Grid";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// for the image showing window

import SmallItems from "../utils/small.png";
import mediumItems from "../utils/medium.png";
import largeItems from "../utils/large.png";
import xLargeItems from "../utils/xlarge.png";

import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SeatbookingNXVCJNRM = () => {
  const Auth = useAuth();

  const [lockerDetails, setLockerDetails] = useState({
    // seat: allLocks,
    seat: Lockers.NXVCJNRM,
    seatAvailable: Auth.userDetails.AvailableLocker,
    // seatAvailable: [],
    // seatReserved: ["L11", "L10"],
    seatSelected: "",
    userSelectedLock: "",
    noOfHours: "",
    totMinutes: "",
    totPayableAmount: "",

    // for seat numbers
    // seatNoA: ["L1", "S2", "S3", "S4", "S5", "L6"],
    // seatNoB: ["S7", "S8", "S9", "S10"],
    // seatNoc: ["L11", "L12", "S13", "S14", "L17", "L18"],
    // seatNoD: ["S15", "S16"],
    // seatNoE: ["L19", "L20", "L21", "L22", "L23", "L24"],

    // seatNoA: ["S1", "S2", "S3", "S4", "L1", "L2"],
    // seatNoB: ["S5", "S6", "QR", "L3", "L4"],
    // seatNoc: ["M1", "M2", "L5", "L6"],
    // seatNoD: ["S7", "S8", "XL1", "XL2"],
    // seatNoE: ["M3", "M4", "M5", "M6"],

    // seatNoA: ["S1", "S5", "S9", "S12", "L15", "L19"],
    // seatNoB: ["S2", "S6", "QR", "L16", "L20"],
    // seatNoc: ["M3", "M7", "L17", "L21"],
    // seatNoD: ["S10", "S13", "XL18", "XL22"],
    // seatNoE: ["M4", "M8", "M11", "M14"],

    seatNoA: ["S1", "S5", "L8"],
    seatNoB: ["S2", "QR", "L9"],
    seatNoc: ["M3", "M6", "L10"],
    seatNoD: ["XL11"],
    seatNoE: ["M4", "M7"],
  });

  const [passcode, setPasscode] = useState("");
  const [verifyPasscode, setVerifyPasscode] = useState("");
  const [passcodeMatch, setPasscodeMatch] = useState(false);

  // only for showing to user
  const [minSelected, setMinSelected] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [hoursAndAmountOfLock] = useState({
    noHours: Auth.userDetails.hours,
    smallLockHoursAmount: Auth.userDetails.smallLockPriceHours,
    mediumLockHoursAmount: Auth.userDetails.mediumLockPriceHours,
    largeLockHoursAmount: Auth.userDetails.largeLockPriceHours,
    extraLargeHoursAmount: Auth.userDetails.extraLargePriceHours,

    smallPerMinuteAmount: Auth.userDetails.smallLockPriceMinute,
    mediumPerMinuteAmount: Auth.userDetails.mediumLockPriceMinute,
    largePerMinuteAmount: Auth.userDetails.largeLockPriceMinute,
    extraLargeMinuteAmount: Auth.userDetails.extraLargePriceMinute,
  });
  const [userSelectedTime, setUserSelectedTime] = useState();

  useEffect(() => {
    let availLocks = [...lockerDetails.seatAvailable];
    let seatBooked = [];
    const bookedSeat = lockerDetails.seat.map((arr) => {
      if (Auth.userDetails.AvailableLocker.indexOf(arr) === -1) {
        seatBooked.push(arr);
      }
    });
    console.log(Auth.occupiedLocks);

    if (Auth.occupiedLocks !== null) {
      Auth.occupiedLocks.map((lock) => {
        if (!lockerDetails.seatSelected.includes(lock)) {
          seatBooked.push(lock);

          const index = availLocks.indexOf(lock);

          if (index > -1) {
            availLocks.splice(index, 1);
          }
        }
      });
      console.log(availLocks);
    }

    console.log(seatBooked);
    setLockerDetails({
      ...lockerDetails,
      seatSelected: seatBooked,
      seatAvailable: availLocks,
    });
  }, []);

  // useEffect(() => {
  //   window.addEventListener("beforeunload", (event) => {
  //     event.preventDefault();
  //     return (event.returnValue =
  //       "Do not refresh the page, All Details will be lossed");
  //   });
  // });

  // for the time and amount selection window
  const [confirmLocks, setConfirmLocks] = useState(false);

  // for the form verification
  const [verificationFormStatus, setVerificationFormStatus] = useState(false);

  // for visibility of lockers layout
  const [locksContainerStatus, setLocksContainerStatus] = useState(true);

  // for the passcode window
  const [passcodeWindow, setPasscodeWindow] = useState(false);

  const onClickData = (seat) => {
    //for selected lock
    setLockerDetails({
      ...lockerDetails,
      userSelectedLock: seat,
    });
  };

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  function checktrue(row) {
    if (lockerDetails.seatSelected.indexOf(row) > -1) {
      return false;
    } else {
      return true;
    }
  }

  function handleSubmited() {
    if (lockerDetails.userSelectedLock) {
      setConfirmLocks(true);
      // setLockerDetails(true);
      setLockerDetails({ ...lockerDetails, seatReserved: [] });
      setLocksContainerStatus(false);
      priceOfLock();
    } else {
      alert(language.LockerReservationPage.selectLockerAlert);
      // alert("please select a lock");
    }
  }

  function inputEventManager(e) {
    alert(e.target.value);
    setLockerDetails({ ...lockerDetails, [e.target.name]: e.target.value });
  }

  const verifyEventHandler = () => {
    setConfirmLocks(false);

    // if (Auth.seatBookCount > 0) {
    //   setVerificationFormStatus(true);
    // } else {
    //   setPasscodeWindow(true);
    // }

    setPasscodeWindow(true);
  };

  const proceedPasscodeFunction = () => {
    setPasscodeWindow(false);
    setVerificationFormStatus(true);
  };

  const priceOfLock = () => {
    if (lockerDetails.userSelectedLock.includes("S")) {
    } else if (lockerDetails.userSelectedLock.includes("M")) {
    } else if (lockerDetails.userSelectedLock.includes("L")) {
    }
  };

  const handleOccupiedLocks = () => {
    console.log("called");
    if (Auth.occupiedLocks) {
      let availLocks = [...lockerDetails.seatAvailable];
      let seatBooked = [...lockerDetails.seatSelected];
      Auth.occupiedLocks.map((lock) => {
        if (!lockerDetails.seatSelected.includes(lock)) {
          seatBooked.push(lock);

          const index = availLocks.indexOf(lock);

          if (index > -1) {
            availLocks.splice(index, 1);
          }
        }
        console.log(availLocks);
        console.log(seatBooked);
        setLockerDetails({
          ...lockerDetails,
          userSelectedLock: "",
          seatSelected: seatBooked,
          seatAvailable: availLocks,
        });
      });

      // if (!lockerDetails.seatSelected.includes(Auth.occupiedLocks)) {
      //   const seatBooked = [...lockerDetails.seatSelected, Auth.occupiedLocks];
      //   let availLocks = [...lockerDetails.seatAvailable];
      //   const index = availLocks.indexOf(Auth.occupiedLocks);

      //   if (index > -1) {
      //     availLocks.splice(index, 1);
      //   }
      //   console.log(availLocks);
      //   console.log(seatBooked);
      //   setLockerDetails({
      //     ...lockerDetails,
      //     userSelectedLock: "",
      //     seatSelected: seatBooked,
      //     seatAvailable: availLocks,
      //   });
      // }
    }
  };

  const displayChooseLocks = () => {
    console.log(language.LockerReservationPage.chooseLocksAgain);
    // console.log("choose locks again");
    setPasscode("");
    setVerifyPasscode("");
    setLockerDetails({
      ...lockerDetails,
      totMinutes: "",
      totPayableAmount: "",
    });
    setUserSelectedTime("");
    handleOccupiedLocks();
    setLocksContainerStatus(true);
    setVerificationFormStatus(false);
  };

  const timeInMinutesFun = (e) => {
    e.preventDefault();
    const val = e.target.value;
    setUserSelectedTime("");

    if (lockerDetails.userSelectedLock.includes("S")) {
      const totPrice = val * hoursAndAmountOfLock.smallPerMinuteAmount;
      setLockerDetails({
        ...lockerDetails,
        totMinutes: val,
        totPayableAmount: Math.round(totPrice / 100),
      });
      setTotalAmount(Math.round(totPrice / 100));
    } else if (lockerDetails.userSelectedLock.includes("M")) {
      const totPrice = val * hoursAndAmountOfLock.mediumPerMinuteAmount;
      setLockerDetails({
        ...lockerDetails,
        totMinutes: val,
        totPayableAmount: Math.round(totPrice / 100),
      });
      setTotalAmount(Math.round(totPrice / 100));
    } else if (lockerDetails.userSelectedLock.includes("XL")) {
      const totPrice = val * hoursAndAmountOfLock.extraLargeMinuteAmount;
      setLockerDetails({
        ...lockerDetails,
        totMinutes: val,
        totPayableAmount: Math.round(totPrice / 100),
      });
      setTotalAmount(Math.round(totPrice / 100));
    } else if (lockerDetails.userSelectedLock.includes("L")) {
      const totPrice = val * hoursAndAmountOfLock.largePerMinuteAmount;
      setLockerDetails({
        ...lockerDetails,
        totMinutes: val,
        totPayableAmount: Math.round(totPrice / 100),
      });
      setTotalAmount(Math.round(totPrice / 100));
    }

    if (val > 60) {
      const inHour = Math.floor(val / 60);
      const forMinute = val % 60;

      if (forMinute === 60) {
        setMinSelected(inHour + 1 + " hour " + forMinute * 0);
      } else {
        setMinSelected(inHour + " hour " + forMinute);
      }
    } else {
      setMinSelected(val);
    }
  };

  const radioButtonEventFun = (val) => {
    const valArr = val.split(",");
    setUserSelectedTime(valArr[0]);
    setLockerDetails({
      ...lockerDetails,
      totMinutes: valArr[0] * 60,
      totPayableAmount: valArr[1],
    });
    setMinSelected(0);
    setTotalAmount(0);
  };

  const passCodeWindowVisibility = (e) => {
    e.preventDefault();

    const val = e.target.value;
    const reg = /\d+/g; // regex for only number

    // if (val.match(reg)) {
    //   alert("number : ", val)
    // } else {
    //   alert("text : ", val)
    // }

    if (e.target.value.length <= 4) {
      setPasscode(e.target.value);

      if (e.target.value === verifyPasscode) {
        setPasscodeMatch(true);
      } else {
        setPasscodeMatch(false);
      }
    }
  };

  const passCodeClickHandler = () => {
    if (passcode.length === 4) {
      setPasscodeWindow(false);
      setVerificationFormStatus(true);
    } else {
      alert(language.TypePasscode.fourdigitpasscodeAlert);
      // alert("passcode shoud be of 4 digit");
    }
  };

  const backToTimeFun = () => {
    setPasscodeWindow(false);
    setConfirmLocks(true);
  };

  // total locks booked count if already booked once no passcode window opens
  // const seatCountFun = (count) => {
  //   const totCount = seatBookCount + count;
  //   alert(totCount);
  //   setSeatBookCount(totCount);
  // };

  // to verify the passcode

  const verifyPasscodeFun = (e) => {
    if (passcode.length === 4) {
      if (e.target.value.length <= 4) {
        setVerifyPasscode(e.target.value);
        if (passcode === e.target.value) {
          setPasscodeMatch(true);
        } else {
          setPasscodeMatch(false);
        }
      }
    } else {
      alert(language.TypePasscode.fourdigitpasscodeAlert);
      // alert("passcode should be of 4 digit");
    }
  };

  const backToLocksFun = () => {
    setConfirmLocks(false);
    setLocksContainerStatus(true);
    setPasscode("");
    setVerifyPasscode("");
    setLockerDetails({
      ...lockerDetails,
      totMinutes: 0,
      totPayableAmount: 0,
    });
    setUserSelectedTime("");
  };

  const backToPasscodeFun = () => {
    setPasscodeWindow(true);
    setVerificationFormStatus(false);
  };
  return (
    <div className="shadow-container">
      {Auth.seatBookCount === 3 ? (
        <>
          <div className="limitExceed">
            <h3 className="blue-text">
              {language.LockerReservationPage.YouBookedAll3Locker}
              {/* You Have Booked All 3 Locks, Try After Retrieving The Locks. */}
            </h3>
            <h4 className="yellow-text">
              {language.LockerReservationPage.ThankYou}{" "}
            </h4>
            {/* <h3 className="blue-text">
                You Have Booked All 3 Locks, Try After Retrieving The Locks.
              </h3>
              <h4 className="yellow-text"> Thank You! </h4> */}
            <Button
              color="primary"
              className="mui-btn-color"
              variant="contained"
              onClick={() => Auth.logoutHandler()}
              fullWidth
            >
              {language.LockerReservationPage.close}
              {/* Close */}
            </Button>
          </div>
        </>
      ) : (
        <>
          <DrawGrid
            seat={lockerDetails.seat}
            available={lockerDetails.seatAvailable}
            reserved={lockerDetails.seatReserved}
            selected={lockerDetails.seatSelected}
            onClickData={onClickData.bind(this)}
            checktrue={checktrue.bind(this)}
            userSelected={lockerDetails.userSelectedLock}
            handleSubmited={handleSubmited.bind(this)}
            noOfHours={lockerDetails.noOfHours}
            inputEventManager={inputEventManager.bind(this)}
            verifyData={verifyEventHandler.bind(this)}
            confirmLock={confirmLocks}
            lockerContainerStatus={locksContainerStatus}
            seatNoA={lockerDetails.seatNoA}
            seatNoB={lockerDetails.seatNoB}
            seatNoC={lockerDetails.seatNoc}
            seatNoD={lockerDetails.seatNoD}
            seatNoE={lockerDetails.seatNoE}
            minuts={minSelected}
            totAmount={totalAmount}
            timeInMinutesFun={timeInMinutesFun.bind(this)}
            radioButtonEvent={radioButtonEventFun.bind(this)}
            hours={hoursAndAmountOfLock.noHours}
            smallLockMinute={hoursAndAmountOfLock.smallPerMinuteAmount}
            mediumLockMinute={hoursAndAmountOfLock.mediumPerMinuteAmount}
            largeLockMinute={hoursAndAmountOfLock.largePerMinuteAmount}
            extraLargeLockMinute={hoursAndAmountOfLock.extraLargeMinuteAmount}
            smallLockHoursAmnt={hoursAndAmountOfLock.smallLockHoursAmount}
            mediumLockHoursAmnt={hoursAndAmountOfLock.mediumLockHoursAmount}
            largeLockHoursAmnt={hoursAndAmountOfLock.largeLockHoursAmount}
            extraLargeLockHoursAmnt={hoursAndAmountOfLock.extraLargeHoursAmount}
            userSelectedTime={userSelectedTime}
            totalTimeSelected={lockerDetails.totMinutes}
            totalAmountOfSelectedTime={lockerDetails.totPayableAmount}
            backToLocks={backToLocksFun}
            SubsriprionType={Auth.subscriptionType}
          />

          <SubmitLock
            noOfHours={lockerDetails.totMinutes}
            userSelected={lockerDetails.userSelectedLock}
            verifyDocStatus={verificationFormStatus}
            pricePerHour={lockerDetails.totPayableAmount}
            choosingLocksStatus={displayChooseLocks}
            passcode={passcode}
            backToPasscode={backToPasscodeFun}
          />

          <PassCodeWindow
            passcodeEvenetHandler={passCodeWindowVisibility.bind(this)}
            passcode={passcode}
            passCodeWindStatus={passcodeWindow}
            passcodeClickHandler={passCodeClickHandler}
            backToSeat={backToTimeFun}
            verifyPasscode={verifyPasscode}
            verifyPasscodeFun={verifyPasscodeFun.bind(this)}
            passcodeMatch={passcodeMatch}
            proceedPasscodeHandler={proceedPasscodeFunction}
          />
        </>
      )}
    </div>
  );
};

function DrawGrid(props) {
  const Auth = useAuth();
  const [open, setOpen] = useState(false);
  const [openWind, setOpenWind] = useState(false);

  const [openImgSuggetionDail, setOpenImgSuggetionDail] = useState(false);
  const [lockerType, setLockerType] = useState("");

  const [imageForDesc, setImageForDesc] = useState();
  const handleCloseEvent = () => {
    setOpenWind(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenWind(false);
  };

  function onClickSeat(seat) {
    openImgSuggestionWindow(seat);
    props.onClickData(seat);
  }

  const closeImgSuggestionWindow = () => {
    setOpenImgSuggetionDail(false);
  };

  const openImgSuggestionWindow = (seat) => {
    if (seat.includes("XL")) {
      setImageForDesc(xLargeItems);
      setLockerType("Extra Large");
    } else if (seat.includes("L")) {
      setImageForDesc(largeItems);
      setLockerType("Large");
    } else if (seat.includes("M")) {
      setImageForDesc(mediumItems);
      setLockerType("Medium");
    } else if (seat.includes("S")) {
      setImageForDesc(SmallItems);
      setLockerType("Small");
    }

    setOpenImgSuggetionDail(true);
  };

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  return (
    <>
      <div>
        <Dialog
          open={openImgSuggetionDail}
          TransitionComponent={Transition}
          keepMounted
          onClose={closeImgSuggestionWindow}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            style={{
              color: "#1E367B",
              padding: "8px",
              fontSize: "18px",
              margin: "8px 8px -10px 8px",
              marginBottom: "-10px",
              textAlign: "center",
            }}
          >
            <b style={{ color: "crimson" }}>{"Size - " + lockerType}</b>
            <br />
            <b>
              {language.LockerReservationPage.itemsToStore} {lockerType}
              {" " + language.LockerReservationPage.itemToStoreContn}
            </b>

            <hr
              style={{
                marginBottom: "2px",
                marginTop: "5px",
              }}
            />
          </DialogTitle>
          <DialogContent>
            <div className="desc-img-container">
              <img
                className="locker-container-ref-img"
                src={imageForDesc}
                alt="img"
              ></img>
            </div>
          </DialogContent>
          <hr
            style={{
              marginBottom: "2px",
              marginTop: "5px",
            }}
          />
          <DialogActions>
            <Button
              onClick={closeImgSuggestionWindow}
              variant="outlined"
              color="primary"
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Col>
        <div
          className={!props.lockerContainerStatus ? "lockers-container" : ""}
        >
          <div className="grid-container">
            <img
              className="logo-container"
              src={YLogo}
              alt="logo"
              width={100}
            />
            {/* <div className="logout-btn">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => Auth.logoutHandler()}
                >
                  {language.LockerReservationPage.logoutBtn}
                </Button>
              </div> */}
            <div className="close-container-seatBooking">
              <IconButton
                // className="close-btn"
                color="primary"
                onClick={() => handleClickOpen()}
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
                id="responsive-dialog-title"
                color="#1E367B"
                padding={5}
              >
                {"Are You Sure You Want To Leave?"}
              </DialogTitle>
              <DialogActions>
                <Button color="info" variant="outlined" onClick={handleClose}>
                  No
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => Auth.logoutHandler()}
                  autoFocus
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <h1 className="lrs-header">
              {language.LockerReservationPage.lockerReservationTitle}
              {/* Choose locker to store */}
            </h1>
            <div className="locker-description">
              <div className="locker-desc-row">
                <div className="avail-lock-box" />
                <p className="locker-descript">
                  {language.LockerReservationPage.availablelocks}
                </p>
                {/* <p className="locker-descript">Available</p> */}
              </div>
              <div className="locker-desc-row">
                <div className="occupied-lock-box" />
                <p className="locker-descript">
                  {language.LockerReservationPage.occupiedlocks}
                </p>
                {/* <p className="locker-descript">Occupied</p> */}
              </div>
              <div className="locker-desc-row">
                <div className="selected-lock-box" />
                <p className="locker-descript">
                  {language.LockerReservationPage.selectedlocks}
                </p>
                {/* <p className="locker-descript">Selected</p> */}
              </div>
            </div>
            <div className="layout-table-container-pmccngf">
              <table className="grid table table-responsive">
                <tbody>
                  {/* <tr>
                    {props.seatNoA.map((row) => (
                      <td
                        rowSpan={row === "L1" || row === "L6" ? 2 : null}
                        className={
                          props.userSelected === row
                            ? "selected"
                            : props.available.indexOf(row) > -1
                            ? "available"
                            : "reserved"
                        }
                        key={row}
                        onClick={
                          props.checktrue(row) ? (e) => onClickSeat(row) : null
                        }
                      >
                        {row}{" "}
                      </td>
                    ))}
                  </tr>
  
                  <tr>
                    {props.seatNoB.map((row) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          className={
                            props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={row}
                          onClick={
                            props.checktrue(row) ? (e) => onClickSeat(row) : null
                          }
                        >
                          {row}{" "}
                        </td>
                      ) : null
                    )}
                  </tr>
  
                  <tr>
                    {props.seatNoC.map((row) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          rowSpan={
                            row === "L11" ||
                            row === "L12" ||
                            row === "L17" ||
                            row === "L18"
                              ? 2
                              : null
                          }
                          className={
                            props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={row}
                          onClick={
                            props.checktrue(row) ? (e) => onClickSeat(row) : null
                          }
                        >
                          {row}{" "}
                        </td>
                      ) : null
                    )}
                  </tr>
  
                  <tr>
                    {props.seatNoD.map((row) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          className={
                            props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={row}
                          onClick={
                            props.checktrue(row) ? (e) => onClickSeat(row) : null
                          }
                        >
                          {row}{" "}
                        </td>
                      ) : null
                    )}
                  </tr>
  
                  <tr>
                    {props.seatNoE.map((row) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          className={
                            props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={row}
                          onClick={
                            props.checktrue(row) ? (e) => onClickSeat(row) : null
                          }
                        >
                          {row}{" "}
                        </td>
                      ) : null
                    )}
                  </tr> */}

                  <tr>
                    {props.seatNoA.map((row, index) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          rowSpan={
                            row.includes("M") || row.includes("QR")
                              ? 2
                              : row.includes("XL")
                              ? 3
                              : 1
                          }
                          colSpan={
                            row.includes("L") ||
                            row.includes("XL") ||
                            row.includes("QR")
                              ? 2
                              : 1
                          }
                          className={
                            row.includes("QR")
                              ? "qr-container"
                              : props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={index}
                          onClick={
                            props.checktrue(row)
                              ? (e) => onClickSeat(row)
                              : null
                          }
                        >
                          {row}
                        </td>
                      ) : null
                    )}
                  </tr>

                  <tr>
                    {props.seatNoB.map((row, index) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          rowSpan={
                            row.includes("M") ? 2 : row.includes("XL") ? 3 : 1
                          }
                          colSpan={
                            row.includes("L") || row.includes("XL") ? 2 : 1
                          }
                          className={
                            row.includes("QR")
                              ? "qr-container"
                              : props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={index}
                          onClick={
                            props.checktrue(row)
                              ? (e) => onClickSeat(row)
                              : null
                          }
                        >
                          {row}
                        </td>
                      ) : null
                    )}
                  </tr>

                  <tr>
                    {props.seatNoC.map((row, index) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          rowSpan={
                            row.includes("M") || row.includes("QR")
                              ? 2
                              : row.includes("XL")
                              ? 3
                              : 1
                          }
                          colSpan={
                            row.includes("L") ||
                            row.includes("XL") ||
                            row.includes("QR")
                              ? 2
                              : 1
                          }
                          className={
                            row.includes("QR")
                              ? "qr-container"
                              : props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={index}
                          onClick={
                            props.checktrue(row)
                              ? (e) => onClickSeat(row)
                              : null
                          }
                        >
                          {row}
                        </td>
                      ) : null
                    )}
                  </tr>

                  <tr>
                    {props.seatNoD.map((row, index) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          rowSpan={
                            row.includes("M") || row.includes("QR")
                              ? 2
                              : row.includes("XL")
                              ? 3
                              : 1
                          }
                          colSpan={
                            row.includes("L") ||
                            row.includes("XL") ||
                            row.includes("QR")
                              ? 2
                              : 1
                          }
                          className={
                            row.includes("QR")
                              ? "qr-container"
                              : props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={index}
                          onClick={
                            props.checktrue(row)
                              ? (e) => onClickSeat(row)
                              : null
                          }
                        >
                          {row}
                        </td>
                      ) : null
                    )}
                  </tr>

                  <tr>
                    {props.seatNoE.map((row, index) =>
                      props.seat.indexOf(row) > -1 ? (
                        <td
                          rowSpan={
                            row.includes("M") || row.includes("QR")
                              ? 2
                              : row.includes("XL")
                              ? 3
                              : 1
                          }
                          colSpan={
                            row.includes("L") ||
                            row.includes("XL") ||
                            row.includes("QR")
                              ? 2
                              : 1
                          }
                          className={
                            row.includes("QR")
                              ? "qr-container"
                              : props.userSelected === row
                              ? "selected"
                              : props.available.indexOf(row) > -1
                              ? "available"
                              : "reserved"
                          }
                          key={index}
                          onClick={
                            props.checktrue(row)
                              ? (e) => onClickSeat(row)
                              : null
                          }
                        >
                          {row}
                        </td>
                      ) : null
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="btn-container">
            <Button
              type="button"
              variant="contained"
              className="mui-btn-color"
              onClick={() => props.handleSubmited()}
              fullWidth
            >
              {language.LockerReservationPage.confirmBookingBtn}
            </Button>
          </div>
        </div>
      </Col>

      {/* price for number of hours */}

      <div
        className={
          props.confirmLock ? "locks-container" : "locks-container-invisible"
        }
      >
        <div className="backbtn-container">
          <IconButton
            className="back-btn"
            color="secondary"
            onClick={props.backToLocks}
          >
            <ArrowBackIosIcon fontSize="medium" />
          </IconButton>
          <br />
        </div>

        <div className="close-container">
          <IconButton
            className="close-btn"
            color="secondary"
            onClick={() => handleCloseEvent()}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
          <br />
        </div>
        <Dialog
          open={openWind}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" color="#1E367B" padding={5}>
            {"Are You Sure You Want To Leave?"}
          </DialogTitle>
          <DialogActions>
            <Button color="info" variant="outlined" onClick={handleClose}>
              No
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => Auth.logoutHandler()}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* <div className="form-container"> */}
        <div>
          <h1 className="choose-time-header">
            {language.LockerStoreingTime.LockerStoreingTimeTitle}
          </h1>

          <div className="hours-range-container">
            <h6 className="header-payment-det">{props.minuts + " minutes"}</h6>

            {props.SubsriprionType !== "RENT" && (
              <>
                <h6 className="header-payment-det">
                  <BiRupee className="rupee-icon" />
                  {props.totAmount}
                </h6>
                <br />
              </>
            )}

            <div>
              <input
                className="input-range"
                type="range"
                min={30}
                max={600}
                step={10}
                defaultValue={30}
                onChange={(e) => props.timeInMinutesFun(e)}
              />
            </div>
          </div>

          <div className="hours-price-container">
            {/* <div> */}
            {/* <Box>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {Array.from(Array(6)).map((_, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <Button color="info" variant="contained" fullWidth>
                        xs=2
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box> */}

            {props.userSelected.includes("S") ? (
              <>
                {props.hours.map((hour, index) => (
                  <button
                    className={
                      props.userSelectedTime == hour
                        ? "hours-container-click"
                        : "hours-container"
                    }
                    onClick={() =>
                      props.radioButtonEvent(
                        hour + "," + props.smallLockHoursAmnt[index]
                      )
                    }
                  >
                    <h6 className="header-payment-det">{hour + " hour"}</h6>

                    {props.SubsriprionType !== "RENT" && (
                      <p className="header-payment-para">
                        <BiRupee className="rupee-icon" />
                        {props.smallLockHoursAmnt[index]}
                      </p>
                    )}
                  </button>
                ))}
              </>
            ) : props.userSelected.includes("M") ? (
              <>
                {props.hours.map((hour, index) => (
                  <button
                    className={
                      props.userSelectedTime == hour
                        ? "hours-container-click"
                        : "hours-container"
                    }
                    onClick={() =>
                      props.radioButtonEvent(
                        hour + "," + props.mediumLockHoursAmnt[index]
                      )
                    }
                  >
                    <h6 className="header-payment-det">{hour + " hour"}</h6>
                    {props.SubsriprionType !== "RENT" && (
                      <p className="header-payment-para">
                        <BiRupee className="rupee-icon" />
                        {props.mediumLockHoursAmnt[index]}
                      </p>
                    )}
                  </button>
                ))}
              </>
            ) : props.userSelected.includes("XL") ? (
              <>
                {props.hours.map((hour, index) => (
                  <button
                    className={
                      props.userSelectedTime == hour
                        ? "hours-container-click"
                        : "hours-container"
                    }
                    onClick={(e) =>
                      props.radioButtonEvent(
                        hour + "," + props.extraLargeLockHoursAmnt[index]
                      )
                    }
                  >
                    <h6 className="header-payment-det">{hour + " hour"}</h6>
                    {props.SubsriprionType !== "RENT" && (
                      <p className="header-payment-para">
                        <BiRupee className="rupee-icon" />
                        {props.extraLargeLockHoursAmnt[index]}
                      </p>
                    )}
                  </button>
                ))}
              </>
            ) : props.userSelected.includes("L") ? (
              <>
                {props.hours.map((hour, index) => (
                  <button
                    className={
                      props.userSelectedTime == hour
                        ? "hours-container-click"
                        : "hours-container"
                    }
                    onClick={(e) =>
                      props.radioButtonEvent(
                        hour + "," + props.largeLockHoursAmnt[index]
                      )
                    }
                  >
                    <h6 className="header-payment-det">{hour + " hour"}</h6>
                    {props.SubsriprionType !== "RENT" && (
                      <p className="header-payment-para">
                        <BiRupee className="rupee-icon" />
                        {props.largeLockHoursAmnt[index]}
                      </p>
                    )}
                  </button>
                ))}
              </>
            ) : null}
          </div>

          <div className="btn-container">
            {
              // && prompt.totalTimeSelected
              props.totalAmountOfSelectedTime ? (
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  className="mui-btn-color"
                  type="button"
                  onClick={props.verifyData}
                  fullWidth
                >
                  {language.LockerStoreingTime.nextBtn}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  color="secondary"
                  type="button"
                  disabled
                  fullWidth
                >
                  {language.LockerStoreingTime.nextBtn}
                  {/* Next */}
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

function PassCodeWindow(props) {
  const [showPasscode, setShowPasscode] = useState(false);
  const [showVerifyPasscode, setShowVerifyPasscode] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMandatoryDailogue, setOpenMandatoryDailogue] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Auth = useAuth();

  const handleClickShowPassword = () => {
    setShowPasscode(!showPasscode);
  };

  const handleShowPasswordVerify = () => {
    setShowVerifyPasscode(!showVerifyPasscode);
  };

  const handleCloseMandatory = () => {
    setOpenMandatoryDailogue(false);
  };

  const openCloseMandatory = () => {
    setOpenMandatoryDailogue(true);
  };

  const confirmAndProceed = () => {
    setOpenMandatoryDailogue(false);
    props.passcodeClickHandler();
  };

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  return (
    <div className="passcode-wind-container">
      {props.passCodeWindStatus && (
        <>
          <div className="pass-backbtn-container">
            <IconButton
              className="back-btn"
              color="secondary"
              onClick={props.backToSeat}
            >
              <ArrowBackIosIcon fontSize="medium" />
            </IconButton>
            <br />
          </div>

          <div className="pass-close-container">
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
              id="responsive-dialog-title"
              color="#1E367B"
              padding={5}
            >
              {"Are You Sure You Want To Leave?"}
            </DialogTitle>
            <DialogActions>
              <Button color="info" variant="outlined" onClick={handleClose}>
                No
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => Auth.logoutHandler()}
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <div className="passcode-container">
            {Auth.seatBookCount > 0 ? (
              <>
                <h3>{language.TypePasscode.AlreadyGenerated}</h3>
                {/* <h3>You Have Already Generated the Passcode </h3> */}
                <div className="btn-container">
                  <Button
                    variant="contained"
                    className="mui-btn-color"
                    onClick={props.proceedPasscodeHandler}
                    endIcon={<VerifiedUserIcon />}
                    fullWidth
                  >
                    {language.TypePasscode.proceed}
                    {/* proceed */}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h4 className="page-header-four">
                  {language.TypePasscode.PasscodeTitle}{" "}
                </h4>
                <h6 className="page-header-six">
                  {" "}
                  {language.TypePasscode.MandatoryMsg}
                  {/* Mandatory for retrieving your items */}
                </h6>

                <div className="pass-form-container">
                  <Box
                    component="form"
                    sx={{
                      // "& .MuiTextField-root": { m: 1, width: "33ch" },
                      "& .MuiTextField-root": { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      label={language.TypePasscode.enterPasscode}
                      // label="Enter Passcode"
                      color="success"
                      name="passcode"
                      type="number"
                      variant="outlined"
                      value={props.passcode}
                      onChange={(e) => props.passcodeEvenetHandler(e)}
                      fullWidth
                      focused
                    />

                    {props.passcodeMatch &&
                    props.verifyPasscode.length === 4 ? (
                      <TextField
                        label={language.TypePasscode.reconfirmPasscode}
                        // label="reconfirm passcode"
                        type="number"
                        color="success"
                        variant="outlined"
                        name="verifyPasscode"
                        value={props.verifyPasscode}
                        onChange={(e) => props.verifyPasscodeFun(e)}
                        fullWidth
                        focused
                      />
                    ) : (
                      <TextField
                        label={language.TypePasscode.reconfirmPasscode}
                        // label="reconfirm passcode"
                        color="error"
                        variant="outlined"
                        type="number"
                        name="verifyPasscode"
                        value={props.verifyPasscode}
                        onChange={(e) => props.verifyPasscodeFun(e)}
                        fullWidth
                        focused
                      />
                    )}

                    <div className="btn-container">
                      {props.passcodeMatch &&
                      props.verifyPasscode.length === 4 ? (
                        <Button
                          variant="contained"
                          className="mui-btn-color"
                          // onClick={props.passcodeClickHandler}
                          onClick={openCloseMandatory}
                          endIcon={<VerifiedUserIcon />}
                          fullWidth
                        >
                          {language.TypePasscode.confirmBtn}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          // onClick={props.passcodeClickHandler}
                          // endIcon={<VerifiedUserIcon />}
                          fullWidth
                          disabled
                        >
                          {language.TypePasscode.confirmBtn}
                        </Button>
                      )}
                    </div>
                  </Box>
                </div>
                <Dialog
                  open={openMandatoryDailogue}
                  onClose={handleCloseMandatory}
                  aria-labelledby="responsive-dialog-title"
                >
                  {/* <DialogTitle id="responsive-dialog-title">
                          {"PASSCODE"}
                        </DialogTitle> */}
                  <DialogContent>
                    <DialogContentText>
                      {language.TypePasscode.rememberAlert}
                      {/* Please Remember the passcode And do not share with anyone. */}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color="info"
                      variant="outlined"
                      onClick={confirmAndProceed}
                      autoFocus
                    >
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SeatbookingNXVCJNRM;
