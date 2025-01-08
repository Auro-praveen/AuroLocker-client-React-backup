import React from "react";
import Success from "../../utils/success.png";
import Button from "@material-ui/core/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import "./retriveSuccess.css";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import TuckitTextLogo from '../../logos/tuckit_blue_text.png'
import EnglishLang from "../../Languages/English.json";
import KannadaLang from "../../Languages/Kannada.json";
import HindiLang from "../../Languages/Hindi.json";
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import { useAuth } from "../../GlobalFunctions/Auth";
import AppFooter from "../../loginpage/AppFooter";
import SocialMediaLinks from "../../loginpage/SocialMediaLinks";


/* 

  @Auther Praveenkumar 

  For Retrieving the locker
  After a successfull locker retrieve by taking the payment or for the locker without any pending payment

*/


function RetriveSuccess() {
  const RetriveAuth = useRetriveAuth();
  const Auth = useAuth();
  const onLogoutClick = () => {
    Auth.logoutHandler();
    RetriveAuth.logoutHandler();
  };

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  return (
    <>
      <div className="retr-success-container">

        <div className="retr-success-wind">


          <div style={{marginBottom: "15px", marginTop:"5px"}}>
            
          </div>

          <div className="paymentSuccess-container">
            <img className="success-svg" src={Success} alt="img" width={100} />
          </div>
          <div className="success-header-container">
            <h4>{language.SelectLockerRetrievePage.RetrieveSuccess}
              {/* Thank you for using */}

              {/* <strong className="brand-name">TUCKIT</strong>{" "} */}
            </h4>
            <img className="tuckit-text-logo" src={TuckitTextLogo} alt="log" width={100} />
            <h6>{language.SelectLockerRetrievePage.ThankYou}</h6>
            {/* <h6>have a nice day !</h6> */}
          </div>
          {/* <br /> */}

          <SocialMediaLinks />  

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
      {/* <AppFooter /> */}
    </>
  );
}

export default RetriveSuccess;
