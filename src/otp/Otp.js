import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Link, NavLink } from "react-router-dom";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import { UseLanguage } from "../GlobalFunctions/LanguageFun";
// import './styles.css'
// import loginBanner from '../../assets/images/login-banner.png'; //commented
// import { API_URL } from '../../redux-services/api/api.js';
// import { API } from '../../utils/networkApi.js';
const optionsRdBtn = ["Male", "Female"];
function Otp(props) {
  const state = {
    divcontainer: false,
  };
  const [otp, setOtp] = useState(state);
  const [seconds, setSeconds] = useState(60);
  const [sendOTPhideShow, setSendOTPhideShow] = useState(false);
  const [sendOTPDisable, setSendOTPDisable] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [resendOTPhideShow, setResendOTPhideShow] = useState(true);

  useEffect(() => {
    setSendOTPhideShow(false);
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
      // setSendOTPhideShow(true);
      setResendOTPhideShow(true);
    } else {
      setSeconds(0);
      setSendOTPhideShow(true);
      setResendOTPhideShow(false);
    }
  });

  // history path
  const nextPath = (path) => {
    props.history.push(path);
  };

  // const handleSignup = async(data) =>{
  //   try{
  //     const result = await API.post(API_URL.VERIFY_OTP,data);
  //     let response = await result.data;
  //     console.log("response values of the signup",response);
  //     if(response.status === 200){
  //       toaster('success', response.message);
  //       nextPath('/home/login')
  //     }

  //   }
  //   catch( error){
  //     toaster('error', error);
  //   }

  // }

  // const handleSendOTP = async() =>{
  //   try{
  //     if(phoneNumberError === null){
  //       setSendOTPDisable(true);
  //       const data ={
  //         "phone": `${phoneNumber}`
  //       }
  //       const result = await API.post(API_URL.SEND_OTP,data);
  //       let response = await result.data;
  //       console.log("response values of the send otp",response);
  //       if(response.status === 200){
  //         toaster('success', response.message);
  //         setOtp({divcontainer:!otp.divcontainer});
  //       }
  //     }

  //   }
  //   catch( error){
  //     toaster('error', error.message);
  //   }

  // }

  const validate = (values) => {
    const errors = {};
    if (!values.phone) {
      errors.phone = "Phone number must not be empty";
    } else if (values.phone.length < 10 || values.phone.length > 10) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!values.otp) {
      errors.otp = "OTP must not be empty";
    } else if (values.otp.length < 4 || values.otp.length > 4) {
      errors.otp = "OTP must be 4 characters";
    }

    if (!values.mpin) {
      errors.mpin = "Mpin must not be empty";
    } else if (values.mpin.length < 4 || values.mpin.length > 4) {
      errors.mpin = "Mpin must be 4 characters";
    }

    if (!values.firstname) {
      errors.firstname = "First Name must not be empty";
    } else if (values.firstname.length < 1) {
      errors.firstname = "Please enter atleast 1 character";
    }

    if (!values.lastname) {
      errors.lastname = "Last Name must not be empty";
    } else if (values.lastname.length < 1) {
      errors.lastname = "Please enter atleast 1 character";
    }

    if (!values.gender) {
      errors.gender = "Gender must not be empty";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      phone: "",
      otp: "",
      firstname: "",
      lastname: "",
      mpin: "",
      gender: "",
    },
    validate,
    onSubmit: (values) => {
      //   alert(JSON.stringify(values, null, 2))
      const data = {
        phone: values.phone,
        otp: values.otp,
        firstname: values.firstname,
        lastname: values.lastname,
        mpin: values.mpin,
        gender: values.gender,
      };
      console.log("data register submitted", data);

      // handleSignup(data);

      //uncomented praveen
    },
  });

  //comment  praveeen

  // const handleResendOTP = async() =>{

  //    try{
  //     setSeconds(60);
  //     setSendOTPhideShow(true);
  //     setSendOTPDisable(true);
  //     const data ={
  //       "phone": `${phoneNumber}`
  //     }
  //     const result = await API.post(API_URL.RESEND_OTP,data);
  //     let response = await result.data;
  //     console.log("response values of the resend otp",response);
  //     if(response.status === 200){
  //       toaster('success', response.message);

  //     }

  //   }
  //   catch( error){
  //     toaster('error', error);
  //   }
  // }

  {
    /*const [counter,setCounter]=useState(180);

//Timer

    useEffect(()=>{
const timer = 
    
    (counter > 0) && setInterval(()=>setCounter(counter,-1),1000);
return()=>clearInterval(timer);
 },[counter]);*/
  }
  {
    /*const [timer1, setTimer1] = useState(false);
  const [time, setTime] = useState({});
  const [seconds, setSeconds] = useState(60);
const[loading,setLoading] = useState(false);
   useEffect(()=>{
    document.body.classList.add('account-page');
    return ()=>{
        document.body.classList.remove('account-page');
    }
   }, []) 
   let timer=0;
        
   const countDown = async() =>{
    // Remove one second, set state so a re-render happens.
    let sec = seconds - 1;
     setTime(secondsToTime(sec));
     setSeconds(sec);
     
    //  console.warn(" timer", sec);
    //  console.warn(" timer second", seconds);

    // Check if we're at zero.
    if (sec == 0) {
      clearInterval(timer);
      setTimer1(false);
    }
  }
  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));
    
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }
  useEffect(() => {
    if(timer1){

      let timeLeftVar = secondsToTime(seconds);
      setTime(timeLeftVar);
      if(timer == 0 && seconds > 0) {
        timer = setInterval(() =>{
          countDown()},1000);      
      }

    }

    
     return () => {    
      clearInterval(timer);
      // setData(initialData);
      setLoading(false);
      //on_change_text();
    }
  },[timer1,seconds
    , loading
  ]);
*/
  }

  // var HandleSendOTP = e =>
  // {
  //     setOtp({divcontainer:!otp.divcontainer});
  // }
  const x = otp.divcontainer;

  const handleRadioOptn = (event) => {
    // setPhoneNumber(event.target.value);
    // console.log("data ",event.target.value);
    formik.setFieldValue("gender", event.target.value);
  };

  const onBlurPhone = (event) => {
    if (!event.target.value) {
      setPhoneNumberError("Phone number must not be empty");
    } else if (
      event.target.value.length < 10 ||
      event.target.value.length > 10
    ) {
      setPhoneNumberError("Phone number must be 10 digits");
    } else {
      setPhoneNumberError(null);
      setPhoneNumber(event.target.value);

      formik.setFieldValue("phone", event.target.value);
    }
  };
  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="account-content">
              <div className="row align-items-center justify-content-center">
                <div className="col-md-7 col-lg-6 login-left">
                  {/* <img src={loginBanner} className="img-fluid" alt="Doccure Register" />	 */}
                </div>
                <div className="col-md-12 col-lg-6 login-right">
                  <div className="login-header">
                    <h3>User Register </h3>
                  </div>

                  <form onSubmit={formik.handleSubmit}>
                    {sendOTPhideShow == false ? (
                      <h6 className="text-muted">
                        Enter your mobile number and click on SEND OTP for OTP
                      </h6>
                    ) : null}
                    <div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control "
                          id="mobile"
                          placeholder="Mobile Number"
                          // value={phoneNumber}
                          // onChange={(event) => onChangePhone(event)}
                          onBlur={(event) => onBlurPhone(event)}
                        />
                        {/* <label className="focus-label  " htmlFor="mobile" >
                                                
                                                 Mobile Number 
                                                </label> */}
                      </div>
                      {phoneNumberError !== null ? (
                        <div className="error">{phoneNumberError}</div>
                      ) : formik.touched.phone && formik.errors.phone ? (
                        <div className="error">{formik.errors.phone}</div>
                      ) : null}
                    </div>
                    {/*} <div className="col-4">*/}

                    {/*</div>*/}
                    <button
                      // className="btn-primary btn-block btn-sm login-btn"
                      className={
                        sendOTPDisable == true
                          ? "btn-secondary btn-block btn-sm login-btn"
                          : "btn-primary btn-block btn-sm login-btn"
                      }
                      type="button"
                      // onClick={handleSendOTP}
                      // disabled={sendOTPhideShow}
                      disabled={sendOTPDisable}
                    >
                      {" "}
                      {x ? "Send OTP" : "Send OTP"}
                    </button>

                    {x && (
                      <>
                        {/*} <span>00:{counter}</span>*/}

                        <div className="resendotp">
                          <strong>Resend OTP in</strong>{" "}
                          <span
                            style={{
                              color: "green",
                              fontWeight: "bold",
                              align: "center",
                            }}
                          >
                            {" "}
                            00:{seconds}
                          </span>
                        </div>

                        {resendOTPhideShow == false ? (
                          <h6 className="text-muted">
                            Click on RESEND OTP for OTP to be sent again
                          </h6>
                        ) : null}

                        <button
                          // className="btn-primary btn-block btn-sm login-btn mb-3"
                          className={
                            resendOTPhideShow == true
                              ? "btn-secondary btn-block btn-sm login-btn mb-3"
                              : "btn-primary btn-block btn-sm login-btn mb-3"
                          }
                          type="button"
                          // onClick={() =>handleResendOTP()}
                          disabled={resendOTPhideShow}
                        >
                          {" "}
                          {"Resend OTP"}
                        </button>

                        <div>
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control "
                              id="otp"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.otp}
                              placeholder="Enter OTP"
                            />
                            {/* <label className="focus-label" htmlFor="otp">Enter OTP</label> */}
                          </div>
                          {formik.touched.otp && formik.errors.otp ? (
                            <div className="error">{formik.errors.otp}</div>
                          ) : null}
                        </div>

                        <div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control "
                              id="firstname"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.firstname}
                              placeholder="First Name"
                            />
                            {/* <label className="focus-label" htmlFor="firstname">First Name   </label> */}
                          </div>
                          {formik.touched.firstname &&
                          formik.errors.firstname ? (
                            <div className="error">
                              {formik.errors.firstname}
                            </div>
                          ) : null}
                        </div>
                        <div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control  "
                              id="lastname"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.lastname}
                              placeholder="Last Name"
                            />
                            {/* <label className="focus-label" htmlFor="lastname">Last Name</label> */}
                          </div>
                          {formik.touched.lastname && formik.errors.lastname ? (
                            <div className="error">
                              {formik.errors.lastname}
                            </div>
                          ) : null}
                        </div>

                        <div className="">
                          <div className="form-group">
                            <label>Gender</label>
                            <div className="row">
                              {optionsRdBtn.map((options, idxo) => (
                                <div
                                  key={idxo}
                                  className="text-primary col-md-3"
                                  id={idxo}
                                >
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id={`optnRd[${idxo}]`}
                                    value={options}
                                    name={`optnameVal`}
                                    onChange={(event) => {
                                      handleRadioOptn(event);
                                    }}
                                  />
                                  <label>{options}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control floating"
                              id="mpin"
                              maxLength={4}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.mpin}
                              placeholder="Enter MPIN"
                            />
                            {/* <label className="focus-label" htmlFor="mpin">Enter MPIN</label> */}
                          </div>
                          {formik.touched.mpin && formik.errors.mpin ? (
                            <div className="error">{formik.errors.mpin}</div>
                          ) : null}
                        </div>
                      </>
                    )}

                    <div className="text-right mt-3">
                      <Link to="/home/login" className="forgot-link">
                        Already have an account?
                      </Link>
                    </div>
                    <button
                      className="btn btn-primary btn-block btn-lg login-btn"
                      type="submit"
                    >
                      Signup
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
