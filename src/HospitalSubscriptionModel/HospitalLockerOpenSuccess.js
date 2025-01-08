import React from "react";
import yellowTextLogo from "../logos/tuckit_yellow_text_c.png";

class LockerOpenSuccessHospitals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hospital-lockers-main-container">
        <div className="hospital-locker-item-containers">
          <div className="hospital-header-logo-container">
            <img
              src={yellowTextLogo}
              alt="logo"
              className="hospital-logo-container"
              width={200}
            />
          </div>

          <div className="mobileLocker-success-continer">
            <h2 className="hospital-page-header"> Locker door is open now </h2>

            <img
              src={"/logos/locker-open3.png"}
              alt="payment-success"
              width={180}
              height={150}
            />

            <h6
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Your locker is open now,
            </h6>
            <h6
              style={{
                color: "#1E367B",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Thank you for using Tuckit.in locker services
            </h6>

            <h6
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Secure, Simple and Stress-free
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

export default LockerOpenSuccessHospitals;
