import React, { useState } from "react";
import "./calculation.css";

 function Calculation() {
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [result, setResult] = useState("");

  const handleFirst = (e) => setFirst(e.target.value);
  const handleSecond = (e) => setSecond(e.target.value);

  const handleMultiply = (e) => setResult(first * second);
  const handleDivide = (e) => setResult(first / second);

  return (


    <React.Fragment>
      {/* <div>
        <label htmlFor="first">First Number</label>
        <input
          onChange={handleFirst}
          type="number"
          value={first}
          name="first"
        />
      </div> */}

<div className="main row h-100 justify-content-center align-items-center">
<label >First Number</label>
      <div className="input-group">
        <input type="number" id="firstname" className="inputField" autoComplete="off" required />
        <label htmlFor="name" className="labels"> Seats</label>
      </div>
    </div>

      <div>
        <label htmlFor="second">Second Number</label>
        <input
          onChange={handleSecond}
          type="number"
          value={second}
          name="second"
        />
      </div>
      <div>
        <button onClick={handleMultiply}>Submit</button>
        {/* <button onClick={handleDivide}>Divide</button> */}
      </div>
      <div>The Result is: {result}</div>
    </React.Fragment>
  );
}
export default Calculation;