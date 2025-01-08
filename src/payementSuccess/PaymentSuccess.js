import React, { useEffect, useState } from "react";
import "./payment.css";
import Success from "../utils/success.png";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../GlobalFunctions/Auth";
import VerifyLockOpen from "../verifyLockOpen/VerifyLockOpen";
import LoginIcon from "@mui/icons-material/Login";
import bLogo from "../logos/tuckit_blue_text.png";
import { useIdleTimer } from "react-idle-timer";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import AppFooter from "../loginpage/AppFooter";
import SocialMediaLinks from "../loginpage/SocialMediaLinks";

/*
  @Auther Praveenkumar
  page is redirected to here if the payment is success
  customer can choose another locker if total locker count is less than 3

*/

function PayementSuccess() {
  const Auth = useAuth();
  const navigate = useNavigate();

  const onLogoutClick = () => {
    Auth.logoutHandler();
  };

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  const onIdle = () => {
    Auth.logoutHandlerForSession();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      Math.ceil(getRemainingTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // someFun();

    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });

  // const someFun

  return (
    <>
        <div className="pay-success-container">
          <div className="success-wind">
            <div className="paymentSuccess-container">
              <img className="success-svg" src={Success} alt="img" width={100} />

              <div className="success-header-container">
                <h2 className="pay-success-header">
                  {language.PaymentSuccessful.PaymentSuccessfull}
                </h2>
                <h6>{language.PaymentSuccessful.thankLabel} </h6>
                
                <img
                  className="logo-container-success"
                  src={bLogo}
                  alt="*logo"
                  width={100}
                />
                <h6>{language.PaymentSuccessful.niceday}</h6>
                {/* <h2 className="pay-success-header">Payment Successfull</h2>
            <h6>Thank you for using </h6> 
            <img className="logo-container-success" src={bLogo} alt="*logo" width={100} />
            <h6>have a nice day</h6> */}
              </div>

              <SocialMediaLinks />

              {/* Praveen changed here august 27 2024 */}
              {Auth.subscriptionType !== "RENT" && (
                <div className="buttons-container">
                  <Link to="/">
                    {" "}
                    <Button
                      variant="contained"
                      className="mui-btn-color-yellow"
                      endIcon={<LoginIcon />}
                      fullWidth
                    >
                      {language.PaymentSuccessful.chooseAnotherLockerBtn}
                      {/* Choose Another Locker */}
                    </Button>
                  </Link>
                </div>
              )}

              <div className="buttons-container">
                <Button
                  variant="contained"
                  className="mui-btn-color"
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
        </div>
      {/* <AppFooter /> */}
    </>
  );
}

export default PayementSuccess;
