import React from "react";
import "./termsCondDes.css";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function TermsAndCondition() {
  return (
    <div className="terms-condition">
      <div className="terms-container">
      <IconButton className="terms-cond-close-btn" aria-label="delete">
        <CloseIcon color="primary" />
      </IconButton>
        <h2 className="page-header">Terms And Condition</h2>
        <p className="terms-text">We are Not Responsible for anything</p>
        <p className="terms-text">This is our terms and condition accept it</p>
      </div>
    </div>
  );
}

export default TermsAndCondition;
