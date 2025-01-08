import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import { useRetriveAuth } from "../GlobalFunctions/RetriveAuth";
import serverUrl from "../GlobalVariable/serverUrl.json";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import YLogo from "../logos/logo_yellow.png";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { isSafari } from "react-device-detect";

function ForgotPasscode() {
  const RetriveAuth = useRetriveAuth();
  const [phoneNumber, setPhoneNumber] = useState(RetriveAuth.MobileNo);
  const [isMessgeTypeDialogueOpen, setIsMessgeTypeDialogueOpen] =
    useState(false);

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // const commonUrl = "http://192.168.0.122:8080/AuroLocker/AuroClientRequest";

  // const verifyPasscodeUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/PasscodeHandler";

  const phoneNumberHandler = (e) => {
    if (e.target.value.length > 10) {
    } else {
      setPhoneNumber(e.target.value);
    }
  };

  const askForDefaultGenerateOtpType = (param) => {
    if (param === "sms") {
      const data = {
        MobileNo: phoneNumber,
        PacketType: "retropenlocgetotp",
        terminalID: RetriveAuth.retriveLockContainer.terminalID,
        whatsup: false,
        btype: isSafari ? "Safari" : "Other"
      };

      sendOtpFunction(data);
    } else {
      const data = {
        MobileNo: phoneNumber,
        PacketType: "retropenlocgetotp",
        terminalID: RetriveAuth.retriveLockContainer.terminalID,
        whatsup: true,
        btype: isSafari ? "Safari" : "Other"
      };

      sendOtpFunction(data);
    }

    setIsMessgeTypeDialogueOpen(false);
  };

  const handleGenOtpFunction = () => {
    if (RetriveAuth.retriveLockContainer.terminalID === "FALCON") {
      setIsMessgeTypeDialogueOpen(true);
    } else {
      const data = {
        MobileNo: phoneNumber,
        PacketType: "retropenlocgetotp",
        terminalID: RetriveAuth.retriveLockContainer.terminalID,
      };

      sendOtpFunction(data);
    }
  };

  const sendOtpFunction = (data) => {
    setIsLoading(true);

    fetch(/* verifyPasscodeUrl */ serverUrl.path, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "RETOTP-200") {
          RetriveAuth.retriveMobileNoHandler(phoneNumber);
          navigate("/checkotp", { replace: true });
          setIsLoading(false);
        } else if (data.responseCode === "INVALIDMNO-201") {
          alert(language.RetrievePage.InvalidMobNo);
          // alert("invalid mobile number");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err : " + err);
      });
  };

  const closeMessageTypeDailogue = () => {
    setIsLoading(false);
    setIsMessgeTypeDialogueOpen(false);
  };

  return (
    <div className="retrive-page-container">
      <div className="forgot-passcode-wind" id="verifyOtp-win-id">
        <img className="logo-container" src={YLogo} alt="img" width={100} />
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="passcode-window">
            <div className="passcode-header">
              <h2>{language.RetrievePage.VerifyingMobNo}</h2>
              {/* <h2>Verify Your Phone Number</h2> */}
            </div>
            <div className="form-container">
              <TextField
                type="number"
                label={language.RetrievePage.mobileNo}
                maxLength={4}
                name="MobileNo"
                variant="outlined"
                color="primary"
                value={phoneNumber}
                onChange={(e) => phoneNumberHandler(e)}
                required
                focused
                fullWidth
              />
            </div>

            {isLoading ? (
              <div className="btn-container">
                <LoadingButton
                  loading
                  loadingPosition="end"
                  endIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {language.RetrievePage.generatingotp}
                  {/* generating otp ... */}
                </LoadingButton>
              </div>
            ) : (
              <div className="form-container">
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  className="mui-btn-color-yellow"
                  onClick={() => handleGenOtpFunction()}
                  fullWidth
                >
                  {language.RetrievePage.generateotp}
                  {/* generate otp */}
                </Button>
              </div>
            )}
          </div>
        </Box>
      </div>

      <>
        <Dialog
          open={isMessgeTypeDialogueOpen}
          onClose={closeMessageTypeDailogue}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ textAlign: "center", minWidth: 300, color: "#1E367B" }}
          >
            {"Get OTP Using"}
            <hr style={{ margin: 5, padding: 0 }} />
          </DialogTitle>
          <DialogContent style={{ marginTop: -10 }}>
            <DialogContentText id="alert-dialog-description">
              <Button
                variant="outlined"
                onClick={() => askForDefaultGenerateOtpType("sms")}
                sx={{
                  color: "#F17829",
                  borderColor: "#1E367B",
                  mt: 1,
                  backgroundColor: "#e6f9ff",
                }}
                endIcon={<EmailIcon color="primary" />}
                fullWidth
              >
                <b>SMS</b>
              </Button>
              <>
                <Typography component={"p"} style={{ textAlign: "center" }}>
                  OR
                </Typography>
              </>
              <Button
                variant="outlined"
                onClick={() => askForDefaultGenerateOtpType("whatsapp")}
                sx={{
                  color: "#F17829",
                  borderColor: "#1E367B",
                  mb: 2,
                  backgroundColor: "#e6f9ff",
                }}
                endIcon={<WhatsAppIcon color="primary" />}
                fullWidth
              >
                <b>Whatsapp</b>
              </Button>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
}

export default ForgotPasscode;
