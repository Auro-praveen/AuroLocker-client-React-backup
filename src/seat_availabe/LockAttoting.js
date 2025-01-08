import React from "react";
import { useAuth } from "../GlobalFunctions/Auth";
import SeatbookingGAL from "./SeatbookingGAL";
import SeatBookingLulu from "./SeatBookingLulu";
import { useIdleTimer } from "react-idle-timer";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SeatbookingLulub2 from "./SeatbookingLulub2";
import SeatBookingGaruda from "./SeatbookingGaruda";
import SeatbookingNexus from "./SeatbookingNexus";
import SeatbookingORN from "./SeatbookingORN";
import SeatBookingNXSNKN from "./SeatBookingNXSNKN";
import SeatbookingNXSNKNupdated from "./SeatbookingNXSNKNupdated";
import SeatbookingNXhyd2 from "./SeatbookingNXhyd2";
import SeatbookingMMBLR1 from "./SeatbookingMMBLR1";
import SeatbookingORN2 from "./SeatbookingORN2";
import SeatbookingMMBLR3 from "./SeatbookingMMBLR3";
import SeatBookingPMCBB1 from "./SeatBookingPMCBB1";
import SeatBookingPMCCNBL from "./SeatBookingPMCCNBL";
import SeatBookingPMCCNGF from "./SeatBookingPMCCNGF";
import SeatbookingNXPAVMZ from "./SeatbookingNXPAVMZ";
import SeatbookingNXPAVMZupdLayout from "./SeatbookingNXPAVMZupdLayout";
import SeatbookingNXSWB1 from "./SeatbookingNXSWB1";
import SeatbookingMOAEDENB1 from "./SeatbookingMOAEDENB1";
import SeatbookingMOALUXLL from "./SeatbookingMOALUXLL";
import SeatbookingMOAWAST2 from "./SeatbookingMOAWAST2";
import SeatbookingMOAEAST1 from "./SeatbookingMOAEAST1";
import SeatbookingFMCALIGF from "./SeatbookingFMCALIGF";
import SeatbookingHLCALIGF from "./SeatbookingHLCALIGF";
import { SeatbookingNXSNKNB1 } from "./SeatbookingNXSNKNB1";

import SeatbookingCommonLayout from "./SeatbookingCommonLayout";
import SeatbookingNXVCJNRM from "./SeatbookingNXVCJNRM";
import SeatbookingAHCEBGF from "./SeatbookingAHCEBGF";
import SeatbookingNXVCNB1 from "./SeatbookingNXVCNB1";
import SeatbookingAHCEB2F from "./SeatbookingAHCEB2F";
import SeatbookingLULUHYDUG from "./SeatbookingLULUHYDUG";
import DynamicLayout from "./DynamicLayout";

/*
  @Auther Praveenkumar
  all the terminalId's seat allotment is done here and the page with that terminalID renders here

  from here to payment confirmation rendered to same page with child parent relationship
  seatBooking can be reduced more lines because amount, hour , passcodes are common to all the pages, but while creating
  the project our archetecture was for single terminalID, so this method felt easy although we can reduce hundreds of lines from proper approach

  from choosing locker to payment is shown in this sinle page and other pages ,
  this is the parent component and the termninal id selection mapping are the children class and the purther contains child 
  class for passcode generation, amount selection and amount payment
*/

export const LockAttoting = () => {
  const Auth = useAuth();
  const terminalID = Auth.userDetails.terminalID;
  const navigate = useNavigate();

  const onIdle = () => {
    Auth.logoutHandlerForSession();
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 8,
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
  }, []);

  return (
    <>
      {terminalID === "ORN43" ? (
        <SeatbookingORN />
      ) : //SeatbookingORN    SeatbookingNXVCNB1
      terminalID === "LULU" ? (
        <SeatBookingLulu />
      ) : terminalID === "PSITPL" ? (
        <SeatbookingGAL />
      ) : // changed from here to alter in the language
      terminalID === "LULUB2" ||
        terminalID === "LULUB1" ||
        terminalID === "FALCON" ||
        terminalID === "NXWFLD" ||
        terminalID === "BHMMLR" ||
        terminalID === "ORNUTUB" ||
        terminalID === "NXHYD1" ||
        terminalID === "AMRHYD" ||
        terminalID === "MJMJPN" ||
        terminalID === "DSLHYD1" ||
        terminalID === "LULUHYD" ||
        terminalID === "ORN1" ||
        terminalID === "HLCALIB2" ||
        terminalID === "GGCALILG" ||
        terminalID === "UPTOWN" ? (
        <SeatbookingLulub2 />
      ) : terminalID === "NXSNKN" ? (
        <SeatbookingNXSNKNupdated />
      ) : terminalID === "NXFIZA" ||
        terminalID === "GAL" ||
        terminalID === "NCCMYS" ? (
        <SeatBookingNXSNKN />
      ) : terminalID === "GARUDA" ? (
        <SeatBookingGaruda />
      ) : terminalID === "NEXUS" ? (
        <SeatbookingNexus />
      ) : terminalID === "NXHYD2" ? (
        <SeatbookingNXhyd2 />
      ) : terminalID === "MMBLR1" ||
        terminalID === "FORUMKOLG" ||
        terminalID === "MMBLR2" ||
        terminalID === "NXVIJM" ||
        terminalID === "DSLHYD2" ||
        terminalID === "G2122" ? (
        <SeatbookingMMBLR1 />
      ) : terminalID === "ORN2" || terminalID == "FALCON1" ? (
        <SeatbookingORN2 />
      ) : terminalID === "MMBLR3" || terminalID === "NXSNKNLG" ? (
        <SeatbookingMMBLR3 />
      ) : terminalID === "PMCBB1" || terminalID === "VEGCITB1" ? (
        <SeatBookingPMCBB1 />
      ) : terminalID === "PMCCNBL" ||
        // terminalID === "NXVCNB1" ||
        terminalID === "NXWESTUB" ||
        terminalID === "ELPROCST" ||
        terminalID === "NXSW2F" ||
        terminalID === "NXSWUG" ||
        terminalID === "ELPROCSL" ? (
        <SeatBookingPMCCNBL />
      ) : terminalID === "PMCCNGF" ||
        terminalID === "NXWESTG2" ||
        terminalID === "MOALPE" ? (
        <SeatBookingPMCCNGF />
      ) : terminalID === "NXPAVMZ" ? (
        <SeatbookingNXPAVMZupdLayout />
      ) : terminalID === "NXSWLG" ? (
        <SeatbookingNXPAVMZ />
      ) : terminalID === "NXSWB1" ? (
        <SeatbookingNXSWB1 />
      ) : terminalID === "MOAEDENB1" ? ( //  MOAEDENB1
        <SeatbookingMOAEDENB1 />
      ) : terminalID === "MOALUXLL" || terminalID === "MOAWEST1" ? (
        <SeatbookingMOALUXLL />
      ) : terminalID === "MOAWEST2" || terminalID === "LULUHYDLG" ? (
        <SeatbookingMOAWAST2 />
      ) : terminalID === "MOAEAST1" ? ( //   MOAEAST1
        <SeatbookingMOAEAST1 />
      ) : terminalID === "FMCALIGF" ? (
        <SeatbookingFMCALIGF />
      ) : terminalID === "HLCALIGF" ? (
        <SeatbookingHLCALIGF />
      ) : terminalID === "NXSNKNB1" ? (
        <SeatbookingNXSNKNB1 />
      ) : terminalID === "NXVCNB1" ? (
        <SeatbookingNXVCNB1 />
      ) : terminalID === "NXVCJNRM" || terminalID === "NXVCARCR" ? (
        <SeatbookingNXVCJNRM />
      ) : terminalID === "AHCEBGF" ? (
        <SeatbookingAHCEBGF />
      ) : terminalID === "AHCEB2F" ? (
        <SeatbookingAHCEB2F />
      ) : terminalID === "LULUHYDUG" ? ( // LULUHYDUG
        <SeatbookingLULUHYDUG />
      ) : (
        <DynamicLayout terminalID={terminalID} />
        // <SeatbookingCommonLayout terminalID={terminalID}  />
        // "QR CODE IS WRONG PLEASE CONTACT THE ADMIN"
      )}
    </>
  );
};
