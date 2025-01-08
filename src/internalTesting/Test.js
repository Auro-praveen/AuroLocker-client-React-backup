import React, { useEffect } from "react";
import "./test.css";

const Test = () => {


  const commonWidth = 40;
  const commonHeight = 40;

  const lockerObject = {
    // lockValue: [
    //   ["S1#1,1", "S2#1,1", "M3#1,2", "M4#1,2"],
    //   ["S5#1,1", "QR#1,1", "S6#1,1", "S7#1,1", "M8#1,2"],
    //   ["S9#1,1", "S10#1,1", "M11#1,2", "M12#1,2"],
    // ],

    lockValue: [
      ["S1#1,1", "S2#1,1", "M3#1,2", "M4#1,2"],
      ["S5#1,1", "S6#1,1", "M7#1,2", "M8#1,2"],
      ["S9#1,1", "QR#2,2", "S10#1,1", "M11#1,2"],
      ["S12#1,1", "NA#1,2", "S13#1,1", "M14#1,2"],
      ["L15#2,1.25", "L16#2,1.25", "L17#2,1.25", "XL18#2,2.45"],
      ["L19#2,1.25", "L20#2,1.25", "L21#2,1.25", "XL22#2,2.45"],
    ],

    // lockValue: [
    //   ["S1#1,1", "S2#1,1", "M3#1,2", "M4#1,2"],
    //   ["S5#1,1", "QR#2,2", "S7#1,1", "M8#1,2"],
    //   ["S9#1,1", "NA#2,2", "S10#1,1", "M11#1,2"],
    //   ["L15#2,1.25", "L16#2,1.25", "L17#2,1.25", "L18#2,1.25", "L19#2,1.25"],
    // ],
  };

  let count = 0;


  function renderAsLayout() {
    let completelockers = [];
    let lockerRows = [];
    let isQRWidthlarge = false;
    let lockerContainsNA = false;

    console.log("calling here");
    for (let i = 0; i < lockerObject.lockValue.length; i++) {
      // console.log(i);

      let lockerBtns = [];
      let isLockerNextToNA = false;
      let lockerNAHeight = 0;

      for (let j = 0; j < lockerObject.lockValue[i].length; j++) {
        // console.log(lockerObject.lockValue[i][j]);

        const lockerArr = lockerObject.lockValue[i][j].split("#");
        const [lockWidth, lockHeight] = lockerArr[1].split(",");

        console.log(lockWidth, lockHeight);

        if (lockerArr[0] !== "NA") {
          lockerBtns.push(
            insertButtons(
              lockWidth,
              lockHeight,
              lockerArr[0],
              count,
              isLockerNextToNA,
              lockerNAHeight
            )
          );

          isLockerNextToNA = false;
          lockerNAHeight = 0;
        }

        if (lockerArr[0] === "QR" && Number(lockWidth) === 2) {
          isQRWidthlarge = true;
        } else if (lockerArr[0] === "NA") {
          lockerContainsNA = true;
          isLockerNextToNA = true;
          lockerNAHeight = lockHeight;
        }

        count++;
      }

      if (isQRWidthlarge && lockerContainsNA) {
        isQRWidthlarge = false;
        lockerContainsNA = false;
        lockerRows.push(
          <div
            className="locker-dynamic-row"
            style={{ marginLeft: "-47px" }}
            key={i + 1000}
          >
            {lockerBtns}
          </div>
        );
      } else {
        lockerRows.push(
          <div className="locker-dynamic-row" key={i + 1000}>
            {lockerBtns}
          </div>
        );
      }
    }

    completelockers.push(
      <div className="dynamic-display-locker" key={count + 10}>
        {lockerRows}
      </div>
    );

    return completelockers;
  }

  const insertButtons = (
    lockWidth,
    lockHeight,
    lockName,
    keyVal,
    isLockerNextToNA,
    lockerNAHeight
  ) => {
    // return lockName === "NA" ? (
    //   <button
    //     style={{
    //       width:
    //         lockName.includes("QR") && Number(lockWidth) === 2
    //           ? (commonWidth + 4) * lockWidth
    //           : commonWidth * lockWidth,
    //       height:
    //         lockName.includes("M") ||
    //         lockName.includes("XL") ||
    //         (lockName.includes("QR") && Number(lockHeight) === 2)
    //           ? (commonHeight + 4) * lockHeight
    //           : commonHeight * lockHeight,
    //       border: "none",
    //       borderRadius: "5px",
    //       padding: "5px",
    //       margin: "4px",
    //       marginTop: lockName === "NA" && Number(lockHeight) === 2 && "18px",
    //       display: lockName === "NA" && "none",
    //     }}
    //     key={keyVal}
    //   >
    //     {/* {lockName} */}
    //   </button>
    // ) : (
    //   <button
    //     style={{
    //       width:
    //         lockName.includes("QR") && Number(lockWidth) === 2
    //           ? (commonWidth + 4) * lockWidth
    //           : commonWidth * lockWidth,
    //       height:
    //         lockName.includes("M") ||
    //         lockName.includes("XL") ||
    //         (lockName.includes("QR") && Number(lockHeight) === 2)
    //           ? (commonHeight + 4) * lockHeight
    //           : commonHeight * lockHeight,
    //       border: "1px solid red",
    //       borderRadius: "5px",
    //       padding: "5px",
    //       margin: "4px",
    //     }}
    //     key={keyVal}
    //   >
    //     {lockName}
    //   </button>
    // );

    return isLockerNextToNA ? (
      <button
        style={{
          width:
            lockName.includes("QR") && Number(lockWidth) === 2
              ? (commonWidth + 4) * lockWidth
              : commonWidth * lockWidth,
          height:
            lockName.includes("M") ||
            lockName.includes("XL") ||
            (lockName.includes("QR") && Number(lockHeight) === 2)
              ? (commonHeight + 4) * lockHeight
              : commonHeight * lockHeight,
          // border: "1px solid red",
          border: "none",
          boxShadow: lockName.includes("XL")
            ? "0px 0px 4px 1px #ff0000"
            : "0px 0px 4px 1px #0a943f",
          borderRadius: "5px",
          padding: "5px",
          margin: "4px",
          marginTop: lockerNAHeight * (commonHeight + 10),
          marginBottom: "4px",
        }}
        key={keyVal}
      >
        {lockName}
      </button>
    ) : (
      <button
        style={{
          width:
            lockName.includes("QR") && Number(lockWidth) === 2
              ? (commonWidth + 4) * lockWidth
              : commonWidth * lockWidth,
          height:
            lockName.includes("M") ||
            lockName.includes("XL") ||
            (lockName.includes("QR") && Number(lockHeight) === 2)
              ? (commonHeight + 4) * lockHeight
              : commonHeight * lockHeight,
          // border: "1px solid red",
          border: "none",
          boxShadow: lockName.includes("XL")
            ? "0px 0px 4px 1px #ff0000"
            : lockName.includes("QR")
            ? " 0px 0px 4px 1px #818181"
            : "0px 0px 4px 1px #0a943f",
          borderRadius: "5px",
          padding: "5px",
          margin: "4px",
          // marginTop :
        }}
        key={keyVal}
      >
        {lockName}
      </button>
    );
  };

  return <div className="test-outerlayout">{renderAsLayout()}</div>;
};

export default Test;
