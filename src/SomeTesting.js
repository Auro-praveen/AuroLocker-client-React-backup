import React from "react";
import { useReducer } from "react";

const SomeTesting = () => {
  // for testing some promises

  // console.log("Start");

  // const asyncFunction = new Promise((resolve, reject) => {
  //   if (1 > 2) {
  //     resolve("some working");
  //   } else {
  //     reject("some error");
  //   }
  // });

  // asyncFunction
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // console.log("End");

  // console.log(" here is the async/await function");

  // console.log("started here");

  // const asyncTest = async () => {
  //   return new Promise((resolve, reject) => {
  //     if (1 == 2) {
  //       resolve("the statement is true");
  //     } else {
  //       reject("the statement is false");
  //     }
  //   });
  // };

  // const result = asyncTest();

  // result
  //   .then((out) => {
  //     console.log(out);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  //   console.log("calling async function is completed here");

  const fetchingData = async () => {
    const data = await firstOutput();

    return data;
  };

  async function firstOutput() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("someData");
      }, 2000);
    });
  }

  fetchingData()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <>
      <div>first function complonent</div>
      <UseReducesExample />
    </>
  );
};

// Reducer function to handle state updates

// one is a state that is used to change the state of the object or hook

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const UseReducesExample = () => {
  // dispatch is a function which calls the useReduces hook and state is a state that is used to change the event value
  // in this example useReducer first is a function, second is state and 3rd is a action argument for the 1st function

  /*
    TODO :- UseReducer hook is advanced version of  useState, 
      usage : - its mainly used when the next state is dependent on the previous state.
                its also used when the state has complex logic.
  */

  const countPositive = (diffState) => {
    return { count: diffState.count + 1 };
  };

  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  const [diffState, countFun] = useReducer(countPositive, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>Increment</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>Decrement</button>

      <br />
      <br />
      <br />
      <br />
      <br />
      
      <button onClick={() => countFun()}>
        Only Increment
      </button>
      <p>Only Positive Count : {diffState.count}</p>

    </div>
  );
};

export default SomeTesting;
