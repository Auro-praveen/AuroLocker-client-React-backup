import React from "react";
import HospitalLogin from "./HospitalLogin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LockerOpenSuccessHospitals from "./HospitalLockerOpenSuccess";


const HospitalMainApp = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/tuckit/subscription-lockers"
            element={<HospitalLogin />}
          />
          <Route
            path="/tuckit/subscription-lockers/success"
            element={<LockerOpenSuccessHospitals />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default HospitalMainApp;
