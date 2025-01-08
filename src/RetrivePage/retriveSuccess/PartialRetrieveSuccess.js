import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../../GlobalFunctions/Auth";
import { useRetriveAuth } from "../../GlobalFunctions/RetriveAuth";
import YLogo from "../../logos/logo_yellow.png";
import EnglishLang from "../../Languages/Hindi.json"
import KannadaLang from '../../Languages/English.json';
import HindiLang from '../../Languages/Hindi.json';
import { UseLanguage } from "../../GlobalFunctions/LanguageFun";
import LogoutIcon from "@mui/icons-material/Logout";



const PartialRetrieveSuccess = () => {
  const AuthLanguage = UseLanguage();
  const language = AuthLanguage.userLanguage;
  const RetriveAuth = useRetriveAuth();
  const Auth = useAuth();
  const onLogoutClick = () => {
    Auth.logoutHandler();
    RetriveAuth.logoutHandler();
  }; 
  return (
    <div className="retr-success-container">
      <div className="retr-success-wind">
        <div className="paymentSuccess-container">
          <img className="success-svg" src={YLogo} alt="img" width={100} />
        </div>
        <div className="success-header-container">
        <h4>{language.RetrieveOption.LockIsOpenNow}</h4>
          {/* <h4> Locker Is Open Now. </h4> */}
        </div>

        <div className="partial-retr-info-container">
          <p>
            {/* <b style={{ color: "#ff0000" }}>Note :</b> */}
            <b style={{ color: "#ff0000" }}>{language.RetrieveOption.note}</b>
            {language.RetrieveOption.RetrieveDescription} 
            {/* You Selected <b> Partial Retrieve </b> and Locker Still belongs to
            you, Dont Forget To close the door */}
          </p>
        </div>

        <div className="buttons-container">
          <Button
            variant="contained"
            color="secondary"
            className="mui-btn-color-yellow"
            onClick={() => onLogoutClick()}
            endIcon={<LogoutIcon />}
            fullWidth
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartialRetrieveSuccess;
