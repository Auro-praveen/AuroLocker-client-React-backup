import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useAuth } from "../GlobalFunctions/Auth";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import YLogo from "../logos/logo_yellow.png";
import "./payment.css";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import AppFooter from "../loginpage/AppFooter";

/*
  @Auther Praveenkumar
    If the payment is not done for some reason and the customer wants to store the locker by clicking post pay
    this page is gonna load up for successfull locker open, but payment is still pending and will be carried further
*/

function PostPay() {
  const Auth = useAuth();
  const navigate = useNavigate();

  const LangAuth = UseLanguage();
  const language = LangAuth.userLanguage;

  const logoutHandler = () => {
    Auth.logoutHandler();
  };

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
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return (event.returnValue =
        "Do not refresh the page, All Details will be lossed");
    });
  });

  return (
    <>
      <div className="app-final-container">

        <div className="post-pay-container">
          <img className="logo-container" src={YLogo} alt="img" width={100} />
          <h2 className="item-header-postpay">
            {language.PostPaySuccess.lockerOpen}
          </h2>
          <h5 className="item-sub-header">
            {language.PostPaySuccess.lockerPayDesc}
          </h5>

          <div className="btn-container-post">
            <Button
              variant="contained"
              color="secondary"
              className="mui-btn-color"
              onClick={() => logoutHandler()}
              fullWidth
            >
              {language.PostPaySuccess.close}
            </Button>
          </div>
        </div>

      </div>
      {/* <AppFooter /> */}
    </>
  );
}

export default PostPay;
