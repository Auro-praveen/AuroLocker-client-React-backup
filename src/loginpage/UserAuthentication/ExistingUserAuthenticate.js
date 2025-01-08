import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, Container } from "reactstrap";
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

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EnglishLang from "../../Languages/English.json";
import KannadaLang from "../../Languages/Kannada.json";
import HindiLang from "../../Languages/Hindi.json";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import itemsWantToStore from "../../GlobalVariable/storedItems.json";
import { useIdleTimer } from "react-idle-timer";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ExistingUserAuthenticate = () => {
  const navigate = useNavigate();
  const Auth = useAuth();

  const [userLoginDetails, setUserLoginDetils] = useState({
    MobileNo: Auth.userDetails.MobileNo,
    userName: Auth.userDetails.userName,
    dob: Auth.userDetails.dob,
    itemstored: "",
  });

  const [alertHandler, setAlertHandler] = useState({
    openAlert: false,
    vertical: "top",
    horizontal: "center",
  });

  const [itemsToStore, setItemsToStore] = useState(itemsWantToStore.English)

  const { openAlert, vertical, horizontal } = alertHandler;

  const [openDailogue, setOpenDailogue] = useState(false);

  const location = useLocation();

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

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
  //   } else if (LangAuth.userSelectedLanguage === "Kannada") {
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
    if (Auth.existingUserBalanceAmount) {
      setOpenDailogue(true);
    } else {
      setOpenDailogue(false);
    }

    // if using date instead of text to read the date

    // console.log("before mod : "+Auth.userDetails.dob)
    // const date = new Date(Auth.userDetails.dob)
    // let month = String(date.getMonth()+(1));
    // let dayDate = String(date.getDate());

    // if (month.length < 2) {
    //     month='0'+month
    // }
    // if (dayDate.length < 2) {
    //     dayDate = '0'+dayDate
    // }

    // const formatDate = date.getFullYear()+"-"+month+"-"+dayDate;
    // console.log("after format : "+formatDate)
    // setUserLoginDetils({
    //     ...userLoginDetails,
    //     dob:formatDate
    // })

    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  }, []);

  const redirectPath = location.pathname?.path || "/";
  const evetnChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    console.log(e.target.value);
    setUserLoginDetils({
      ...userLoginDetails,
      [name]: e.target.value,
    });
  };

  const submitFormHandle = (e) => {
    e.preventDefault();
    if (userLoginDetails.itemstored) {
      Auth.existingUserHandler(userLoginDetails);
      navigate(redirectPath, { replace: true });
    } else {
      setAlertHandler({
        ...alertHandler,
        openAlert: true,
      });
    }
  };

  const onCloseAlert = () => {
    setAlertHandler({
      ...alertHandler,
      openAlert: false,
    });
  };

  const closeDailogueHandler = () => {
    setOpenDailogue(false);
  };

  return (
    <div className="authenticate-container">
      <div className="authenticate-container-wind">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={onCloseAlert}
            anchorOrigin={{ vertical, horizontal }}
          >
            <Alert
              onClose={onCloseAlert}
              severity="warning"
              sx={{ width: "100%" }}
            >
               {language.Customerdetails.SelectItemAlert}
              {/* Please Choose the item you want to store */}
            </Alert>
          </Snackbar>
        </Stack>
        <div className="page-header">
          <img className="logo-container" src={YLogo} alt="img" width={100} />
          <h3 style={{ textAlign: "center" }}>
          <strong>{language.Customerdetails.detailsenter}</strong>
            {/* <strong>Enter your details Here !!</strong> */}
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
          noValidate
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
              InputProps={{
                readOnly: true,
              }}
              required
              fullWidth
              focused
            />
          </div>

          <div className="form-container">
            <TextField
              label={language.Customerdetails.dob}
              type="text"
              name="dob"
              color="primary"
              variant="outlined"
              value={userLoginDetails.dob}
              onChange={(e) => evetnChange(e)}
              InputProps={{
                readOnly: true,
              }}
              focused
              fullWidth
            />
          </div>

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
                label={language.Customerdetails.ItemStore}
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
              {language.Customerdetails.proceed}
              {/* Proceed */}
            </Button>
          </div>
        </Box>
      </div>

      <Dialog
        open={openDailogue}
        // onClose={() => closeDailogueWindow()}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
        {language.Customerdetails.pendingBalance}
          {/* {"Balance Pending From Your Previus Locker Usage"} */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <strong>{language.Customerdetails.note}</strong>
              {language.Customerdetails.pending}<strong> {"Rs "+ Auth.existingUserBalanceAmount +".00"}</strong> {language.Customerdetails.pendingTwo}
              {language.Customerdetails.existingUserBalanceAmount}
            {/* <strong>NOTE : </strong>
            Pending due of{" "}
            <strong>
              {" "}
              {"Rs " + Auth.existingUserBalanceAmount + ".00"}
            </strong>{" "}
            from previus transaction. Amount will be added to current
            transaction during checkout. */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="info"
            variant="outlined"
            onClick={() => closeDailogueHandler()}
            autoFocus
          >
            {language.Customerdetails.ok}
            {/* OK */}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExistingUserAuthenticate;
