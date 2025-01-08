import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./userAuthenticate.css";
import { useAuth } from "../../GlobalFunctions/Auth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import YLogo from "../../logos/logo_yellow.png";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import EnglishLang from "../../Languages/English.json";
import KannadaLang from "../../Languages/Kannada.json";
import HindiLang from "../../Languages/Hindi.json";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import itemsWantToStore from "../../GlobalVariable/storedItems.json";
import { useIdleTimer } from "react-idle-timer";

// import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Stack } from "@mui/material";
// import dayjs from "dayjs";

function UserAuthenticate(props) {
  const navigate = useNavigate();
  const Auth = useAuth();

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  const [itemsToStore, setItemsToStore] = useState(itemsWantToStore.English)

  // const [dob, setDob] = useState(dayjs(null));

  const [userDOB, setUserDOB] = useState({
    date: "",
    month: "",
    year: "",
  });

  const [userDob, setUserDob] = useState("");

  const [isDateValid, setIsDateValid] = useState(true);

  const [userLoginDetails, setUserLoginDetils] = useState({
    MobileNo: Auth.userDetails.MobileNo,
    userName: "",
    itemstored: "",
  });

  const location = useLocation();

  const onIdle = () => {
    Auth.logoutHandlerForSession();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 120,
  });

  // useEffect(() => {
  //   if (LangAuth.userSelectedLanguage === "English") {
  //     setItemsToStore(itemsWantToStore.English)
  //   } else if (LangAuth.userSelectedLanguage === "English") {
  //     setItemsToStore(itemsWantToStore.Kannada)
  //   }
  // }, [])

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
  });

  const redirectPath = location.pathname?.path || "/";
  const evetnChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    setUserLoginDetils({ ...userLoginDetails, [name]: e.target.value });
  };

  // const changeDobHandler = (newValue) => {
  //   console.log(newValue);
  //   setDob(newValue);
  // };

  // const handleCustDOB = (e) => {
  //   const name = e.target.name;
  //   console.log(name + " val " + e.target.value);
  //   if(name === "date"){
  //     console.log("date od month : "+ e.target.value.length)
  //     if(e.target.value.length <= 2 && e.target.value <= 31) {
  //       setUserDOB({
  //       ...userDOB,
  //       [name]: e.target.value,
  //     });
  //   }
  //   } else if(name === "month") {
  //     console.log("date od month : "+ e.target.value.length)
  //     if(e.target.value.length <= 2 && e.target.value <= 12) {
  //       setUserDOB({
  //       ...userDOB,
  //       [name]: e.target.value,
  //     });
  //   }
  //   } else {
  //     console.log("year")
  //     if(e.target.value.length <= 4 && e.target.value <= 2022) {
  //       setUserDOB({
  //         ...userDOB,
  //         [name]: e.target.value,
  //       });
  //     }
  //   }

  // };

  const getCurrentDate = () => {
    const date = new Date();

    return String(
      date.getFullYear() +
        "-" +
        String(date.getMonth() + 1) +
        "-" +
        String(date.getDate())
    );
  };

  const submitFormHandle = (e) => {
    if (userLoginDetails.userName == "") {
      alert("user name is required");
    } else if (userLoginDetails.itemstored == "") {
      alert("item stored is required");
    } else {
      if (userDOB.date === "" || userDOB.month === "" || userDOB.year === "") {
        const currentDate = getCurrentDate();

        console.log(currentDate);
        const userLogDet = {
          ...userLoginDetails,
          dob: currentDate,
        };
        Auth.existingUserHandler(userLogDet);
        navigate(redirectPath, { replace: true });
      } else {
        if (userDOB.year.length !== 4) {
          alert("date is not valid");
          setIsDateValid(false);
        } else {
          e.preventDefault();
          const isDateValid = verifyUserDateOfBirth();

          if (isDateValid) {
            if (userLoginDetails.userName && userLoginDetails.itemstored) {
              const userLogDet = {
                ...userLoginDetails,
                dob: isDateValid,
              };
              Auth.existingUserHandler(userLogDet);
              navigate(redirectPath, { replace: true });
            } else {
              alert(language.Customerdetails.plzfillDetailsAlert);
              // alert("Please Fill all the details");
            }
          } else {
            alert("invalid date");
          }
        }
      }
    }
  };

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

  // const handleBackSpace = (e) => {
  //   if (e.keyCode === 8) {
  //     setUserDob((userDob) => userDob.substring(0, userDob.length - 1));
  //   }
  // };

  // Praveen feb 15-2023
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

    console.log(strDate);
    let userEnteredDate = "";

    if (userDOB.date.length === 1) {
      userEnteredDate += 0 + String(userDOB.date) + "-";
    } else {
      userEnteredDate += String(userDOB.date) + "-";
    }

    if (userDOB.month.length === 1) {
      userEnteredDate += 0 + String(userDOB.month) + "-" + String(userDOB.year);
    } else {
      userEnteredDate += String(userDOB.month) + "-" + String(userDOB.year);
    }

    console.log(userEnteredDate);

    if (strDate !== userEnteredDate) {
      console.log("not valid date ");
      setUserDob("");
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

  // for the single input
  const verifyUserDOB = () => {
    const dob = userDob.split("-");
    const date = new Date(dob[2], dob[1] - 1, dob[0]);
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

    console.log(strDate);

    if (strDate !== userDob) {
      console.log("not valid date ");
      setUserDob("");
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

  return (
    <div className="authenticate-container">
      <div className="authenticate-container-wind">
        {/* <div className="col-md-6 col-lg-6 login-left">
                  <img src={loginBanner} className="img-fluid" alt="Login" />
                </div> */}

        <div className="page-header">
          <img className="logo-container" src={YLogo} alt="img" width={100} />
          <h3 style={{ textAlign: "center" }}>
          <strong>{language.Customerdetails.detailsenter}</strong>
            {/* <strong>Enter your details Here !!</strong> <br /> */}
            {/* (new users, onetime registration) */}
          </h3>
        </div>

        <Box
          component="form"
          sx={
            {
              // "& .MuiTextField-root": { m: 2, width: "30ch" },
              // "& .MuiTextField-root": { m: 1},
            }
          }
          // onSubmit={(e) => submitFormHandle(e)}

          autoComplete="off"
        >
          <div className="form-container">
            <TextField
              label={language.Customerdetails.UsermobNo}
              color="success"
              variant="outlined"
              value={userLoginDetails.MobileNo}
              InputProps={{
                readOnly: true,
              }}
              focused
              fullWidth
            />
          </div>

          <div className="form-container">
            <TextField
              name="userName"
              label={language.Customerdetails.UserName}
              color="primary"
              variant="outlined"
              value={userLoginDetails.userName}
              onChange={(e) => evetnChange(e)}
              required
              fullWidth
              focused
            />
          </div>

          {/* <div className="form-container">
            <TextField
              label="date of birth"
              type="date"
              name="dob"
              color="primary"
              variant="outlined"
              value={userLoginDetails.dob}
              onChange={(e) => evetnChange(e)}
              focused
              fullWidth
              required
            />
          </div> */}
          {/* <div className="form-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <MobileDatePicker
                  label="Date Of birth"
                  inputFormat="DD-MM-YYYY"
                  name="dob"
                  value={dob}
                  onChange={changeDobHandler}
                  renderInput={(params) => (
                    <TextField {...params} required focused />
                  )}
                />
              </Stack>
            </LocalizationProvider>
          </div> */}

          {/* Praveen changed feb 15-2023 */}

          <div className="date-container-form">
            <label style={{ marginBottom: "10px" }}>{language.Customerdetails.dob}</label>
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

          {/* <div className="form-container">
            <TextField
              type="text"
              value={userDob}
              label="Enter Your Date Of Birth"
              onChange={handleChangeEvent}
              color={isDateValid ? "primary" : "error"}
              placeholder="DD-MM-YYYY"
              inputProps={{ maxLength: 10 }}
              onKeyDown={handleBackSpace}
              focused
              required
              fullWidth
              helperText={isDateValid ? "" : "Date Is Not valid"}
            />
          </div> */}

          <div className="form-container">
            <FormControl required fullWidth focused>
              <InputLabel id="demo-simple-select-label">
              {language.Customerdetails.ItemStore}
                {/* Item You Want To Store */}
              </InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="itemstored"
                value={userLoginDetails.itemstored}
                label="Item You Want To Store"
                onChange={(e) => evetnChange(e)}
              >
                {itemsToStore.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="form-container">
            <Button
              className="mui-btn-color"
              variant="contained"
              onClick={(e) => submitFormHandle(e)}
              size="large"
              fullWidth
            >
              {language.TypePasscode.proceed}
              {/* Proceed */}
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default UserAuthenticate;
