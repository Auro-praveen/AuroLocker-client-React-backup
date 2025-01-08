import React, { useEffect, useState } from "react";
import garuda from "../seat_availabe/LockersJson/lockers.json";
import LoginOtp from "./LoginOtp";
import { Button } from "@mui/material";

const TestKayout = () => {
  const seat = garuda.LULUB2;

  const [selectedLock, setSelectedLock] = useState("");
  const [occLocks, setOccLocks] = useState(["S2", "S8"]);

  const onSelectedLock = (lockerName) => {
    if (!occLocks.includes(lockerName)) {
      setSelectedLock(lockerName);
    }

    // alert(lockerName)
  };

  // asynch and await function using promises

  

  useEffect(() => {
    (async () => {
      try {
        const dataReturn = await waitAsync();
        console.log("returned data :: ",dataReturn);
      } catch (error) {
        console.log("err : " + error);
      }
    })();
  }, []);

  const testAsyc = () => {
    return new Promise((resolve, reject) => {
      let val = 30;

      setTimeout(() => {
        val = 40;
        if (val === 40) {
          resolve(val);
        } else {
          reject(val);
        }
      }, 3000);
    });
  };

  const waitAsync = async () => {
    try {
      console.log("inside await function");
      const data = await testAsyc();
      let dataval = Number(data) + Number(10);
      console.log("after completing await function ::== " + dataval);

      return dataval;
    } catch (error) {
      console.log(error);
    }
  };

  const seatAllot = {
    seatNoA: ["S1", "S5", "S8", "S11"],
    seatNoB: ["S2", "QR", "S12"],
    seatNoc: ["M3", "M6", "M9", "M13"],
    seatNoD: ["M4", "M7", "M10", "M14"],
  };

  return (
    <div className="layout-table-container-gal">
      <table className="grid table table-responsive">
        <tbody>
          <tr>
            {seatAllot.seatNoA.map((lock, index) =>
              seat.indexOf(lock) > -1 ? (
                <td
                  rowSpan={lock.includes("M") ? 2 : 1}
                  colSpan={lock.includes("QR") ? 2 : 1}
                  key={index}
                  onClick={() => onSelectedLock(lock)}
                  className={
                    occLocks.includes(lock)
                      ? "reserved"
                      : selectedLock === lock
                      ? "selected"
                      : "available"
                  }
                >
                  {lock}
                </td>
              ) : null
            )}
          </tr>

          <tr>
            {seatAllot.seatNoB.map((lock, index) =>
              seat.indexOf(lock) > -1 ? (
                <td
                  rowSpan={lock.includes("M") ? 2 : 1}
                  colSpan={lock.includes("QR") ? 2 : 1}
                  key={index}
                  className={
                    occLocks.includes(lock)
                      ? "reserved"
                      : selectedLock === lock
                      ? "selected"
                      : "available"
                  }
                >
                  {lock}
                </td>
              ) : null
            )}
          </tr>

          <tr>
            {seatAllot.seatNoc.map((lock, index) =>
              seat.indexOf(lock) > -1 ? (
                <td
                  rowSpan={lock.includes("M") ? 2 : 1}
                  colSpan={lock.includes("QR") ? 2 : 1}
                  key={index}
                  className="available"
                >
                  {lock}
                </td>
              ) : null
            )}
          </tr>
          <tr></tr>
          <tr>
            {seatAllot.seatNoD.map((lock, index) =>
              seat.indexOf(lock) > -1 ? (
                <td
                  rowSpan={lock.includes("M") ? 2 : 1}
                  colSpan={lock.includes("QR") ? 2 : 1}
                  key={index}
                  className="available"
                >
                  {lock}
                </td>
              ) : null
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TestKayout;
