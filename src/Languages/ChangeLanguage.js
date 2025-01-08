import { Box, FormControl, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./changeLanguage.css";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
import StateWiseTerminalID from "./statewise-lang/StateWiseTerminalID.json";

const ChangeLanguage = (props) => {
  const LangAuth = UseLanguage();
  const chooseLanguage = LangAuth.userSelectedLanguage;

  const [state, setState] = useState(LangAuth.stateWiseLangDetails.state);

  const chooseLanguageFun = (e) => {
    LangAuth.changeUserLanguageFun(e.target.value);
  };

  useEffect(() => {
    console.log(props.terminalid + "   " + LangAuth.stateWiseLangDetails.state);

    if (
      !LangAuth.stateWiseLangDetails.state &&
      !LangAuth.stateWiseLangDetails.terminalid &&
      LangAuth.stateWiseLangDetails.terminalid !== props.terminalid
    ) {
      getStateFromTerminalid(props.terminalid);
    }
  }, [props.terminalid]);

  const getStateFromTerminalid = (termid) => {
    Object.entries(StateWiseTerminalID["state-wise-terminalid"]).map(
      (object) => {
        if (object[0] === termid) {
          if (
            StateWiseTerminalID["language-updated-states"].includes(object[1])
          ) {
            setState(object[1]);
          }

          LangAuth.handleStatewiseLanguage({
            terminalid: object[0],
            state: object[1],
          });
        }
      }
    );
  };

  return (
    <div>
      {/* For dynamic */}
      {/* {state && (
        <div className="choose-lang-container">
          <label className="language-label">Choose your preferred language</label>
          <Box>
            <FormControl size="small" className="language-change-select">
              <Select
                //   labelId="demo-simple-select-label"
                //   id="demo-simple-select"
                value={chooseLanguage}
                className="language-select"
                // label="Change Language Here"
                onChange={(e) => chooseLanguageFun(e)}
              >
                {StateWiseTerminalID["state-wise-lang"][state].map(
                  (langs, index) => (
                    <MenuItem value={langs} key={index + 1}>
                      {StateWiseTerminalID["OtherLanguages-mapped"][langs]}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>
        </div>
      )} */}

      <div className="choose-lang-container">
        <label className="language-label">Choose your preferred language</label>
        <Box>
          <FormControl size="small" className="language-change-select">
            <Select
              //   labelId="demo-simple-select-label"
              //   id="demo-simple-select"
              value={chooseLanguage}
              className="language-select"
              // label="Change Language Here"
              onChange={(e) => chooseLanguageFun(e)}
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Kannada">ಕನ್ನಡ</MenuItem>
              <MenuItem value="Hindi">हिंदी</MenuItem>
              <MenuItem value="Malayalam">മലയാളം</MenuItem>
              <MenuItem value="Marathi">मराठी</MenuItem>
              <MenuItem value="Gujarati">ગુજરાતી</MenuItem>
              <MenuItem value="Telugu">తెలుగు</MenuItem>
              <MenuItem value="Tamil">தமிழ்</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};

export default ChangeLanguage;
