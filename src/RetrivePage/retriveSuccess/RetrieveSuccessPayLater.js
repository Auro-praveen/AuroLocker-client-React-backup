import React, { useState } from "react";
import { useAuth } from "../../GlobalFunctions/Auth";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import TuckitTextLogo from "../../logos/tuckit_blue_text.png";
import EnglishLang from "../../Languages/Hindi.json"
import KannadaLang from '../../Languages/English.json';
import HindiLang from '../../Languages/Hindi.json';
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import YLogo from "../../logos/logo_yellow.png";
import { Collapse,Alert } from "@mui/material";
import Button from "@material-ui/core/Button";
import LogoutIcon from "@mui/icons-material/Logout";

/* 
  @Auther Praveenkumar

  For retreiving the locker for pay loter options
  can use this after 3 failed 3 attempts

*/

const RetrieveSuccessPayLater = () => {

    const [isError, setIsError] = useState(true)
  const RetriveAuth = useRetriveAuth();
  const Auth = useAuth();
  const onLogoutClick = () => {
    Auth.logoutHandler();
    RetriveAuth.logoutHandler();
  };

  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;

  const closeErrorAlert = () => {
    setIsError(false)
  }
  return (
    <div className="retr-success-container">
      <div className="retr-success-wind">

      <Collapse in={isError}>
              <Alert variant="standard" severity="warning" onClose={() => closeErrorAlert()}>
              {language.RetrieveOption.paymentdue}
                {/* Your Payment Is Due!, And The Amount is carried further */}
              </Alert>
            </Collapse>
        <div className="paymentSuccess-container">
          <img className="success-svg" src={YLogo} alt="img" width={100} />
        </div>
        <div className="success-header-container">
          <h4>
          {language.SelectLockerRetrievePage.RetrieveSuccess}
            {/* Thank you for using */}
            {/* <strong className="brand-name">TUCKIT</strong>{" "} */}
          </h4>
          <img
            className="tuckit-text-logo"
            src={TuckitTextLogo}
            alt="log"
            width={100}
          />
          <h6>{language.SelectLockerRetrievePage.ThankYou}</h6>
          {/* <h6>have a nice day !</h6> */}
        </div>
        <br />

        <div className="buttons-container">
          <Button
            variant="contained"
            color="secondary"
            className="mui-btn-color-yellow"
            onClick={() => onLogoutClick()}
            endIcon={<LogoutIcon />}
            fullWidth
          >
            {language.SelectLockerRetrievePage.close}
            {/* Close */}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RetrieveSuccessPayLater;
