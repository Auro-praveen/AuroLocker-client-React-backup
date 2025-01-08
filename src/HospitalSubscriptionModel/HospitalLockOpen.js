import React, { useEffect, useRef, useState } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { LoadingButton } from "@mui/lab";
import { useLocation, useNavigate } from "react-router-dom";

function HospitalLockOptn(props) {
  const [count, setCount] = useState(20);
  const [isButtonLoading, setIsButtonLoadin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const interval = useRef(null);

  useEffect(() => {
    handleLockerOpenRequest();

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  const handleLockerOpenRequest = async () => {
    if (!isButtonLoading) {
      setCount(20);
      setIsButtonLoadin(true);
    }

    const lockopenReqObject = {
      PacketType: "wfLopenstore",
      MobileNo: props.MobileNo,
      LockerNo: props.lockerNo,
      terminalID: "",
    };

    startTimer();

    // const result = await props
    //   .requestToServer(lockopenReqObject)
    //   .then((data) => data.json())
    //   .catch((err) => {
    //     console.log("error : " + err);
    //     clearIntervalFun();

    //   });

    // if (result) {
    //   if (result.responsecode === "RALOP-200") {
    //     location.pathname = "/tuckit/subscription-lockers/success";
    //     clearIntervalFun();
    //     navigate(location.pathname, { replace: true });
    //   } else {
    //     alert("something went wrong, please try again");
    //     clearIntervalFun();
    //   }
    // }
  };

  function clearIntervalFun() {
    clearInterval(interval.current);
    setCount(0);
    setIsButtonLoadin(false);
  }

  const startTimer = async() => {

    let num = 20;
    
    interval.current = setInterval(() => {
      if (num > 0) {

        setCount((prevVal) => {
          if (prevVal - 1 <= 0) {
            clearIntervalFun();
          } else {
            return prevVal - 1;
          }
        });
        num = num - 1;
      } else {
        console.log("inside else " + count);

        clearIntervalFun();
      }
    }, 1000);
  };

  return (
    <>
      <div className="hospital-form-container">
        <h2 className="hospital-page-header">Door opening in</h2>

        <div className="hospital-lockopencount">
          <h1 className="hospital-lockopen-counter">{count}</h1>
        </div>

        <LoadingButton
          type="submit"
          loading={isButtonLoading}
          variant="contained"
          className={!isButtonLoading && "hospital-loadint-btn" }
          color="error"
          loadingPosition="end"
          endIcon={<LockOpenIcon />}
          onClick={() => handleLockerOpenRequest()}
          fullWidth
          sx={{
            mb: 2,
            mt: 2,
            height: 38,
          }}
        >
          {isButtonLoading ? "Door opening" : "open door"}
        </LoadingButton>
      </div>
    </>
  );
}

export default HospitalLockOptn;
