import { TextField } from "@mui/material";
import React from "react";
import { LoadingButton } from "@mui/lab";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

class HospitalLoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    const {
      mobileNo,
      passcode,
      submitLoginform,
      onInputKeyEventHandler,
      submitBtnLoading,
    } = this.props;

    return (
      <div className="hospital-form-container">
        <h2 className="hospital-page-header">
          Please provide valid credentials
        </h2>
        <form onSubmit={(e) => submitLoginform(e)}>
          <TextField
            id="outlined-basic"
            label="Mobile number"
            variant="outlined"
            name="mobileNo"
            value={mobileNo}
            color="success"
            fullWidth
            required
            onChange={(e) => onInputKeyEventHandler(e)}
            sx={{
              mb: 2,
              mt: 2,
            }}
          />

          <TextField
            id="outlined-basic"
            label="Passcode"
            variant="outlined"
            name="passcode"
            value={passcode}
            color="success"
            onChange={(e) => onInputKeyEventHandler(e)}
            fullWidth
            required
            sx={{
              mb: 2,
            }}
          />

          <LoadingButton
            type="submit"
            loading={submitBtnLoading}
            variant="contained"
            className={!submitBtnLoading && "hospital-loadint-btn" }
            // color="error"
            loadingPosition="end"
            endIcon={<ThumbUpAltIcon />}
            fullWidth
            sx={{
              mb: 2,
              mt: 2,
              height: 45,
            }}
          >
            Submit
          </LoadingButton>
        </form>
      </div>
    );
  }
}

export default HospitalLoginForm;
