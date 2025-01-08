import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "../GlobalFunctions/Auth";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";

const PostpayStore = () => {
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
      <div className="post-pay-container">
        <h2 className="item-header">{language.PostPaySuccess.lockerOpen}</h2>
        <h5 className="item-sub-header">
        {language.PostPaySuccess.lockerPayDesc}
        </h5>

        <div className="btn-container-post">
          <Button
            variant="contained"
            color="secondary"
            className="btn-group"
            onClick={() => logoutHandler()}
            fullWidth
          >
            logout
          </Button>
        </div>
      </div>
    </>
  );
};
export default PostpayStore;
