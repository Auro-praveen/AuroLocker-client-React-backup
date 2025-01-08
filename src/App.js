import "./App.css";
import LoginPage from "./loginpage/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserAuthenticate from "./loginpage/UserAuthentication/UserAuthenticate";
import RetriveLock from "./RetrivePage/RetriveLock/RetriveLock";
import { AuthProvider, useAuth } from "./GlobalFunctions/Auth";
import RequireAuth from "./GlobalFunctions/RequireAuth";
import RetrivePage from "./RetrivePage/RetrivePage";
import PayementSuccess from "./payementSuccess/PaymentSuccess";
import ConfirmOtp from "./RetrivePage/ConfirmOtp";
import { RetriveAuthProvider } from "./GlobalFunctions/RetriveAuth";
import ForgotPasscode from "./RetrivePage/ForgotPasscode";
import LoginOtp from "./loginpage/LoginOtp";
import StoreOrRetrive from "./loginpage/StoreOrRetrive";
import RetriveSuccess from "./RetrivePage/retriveSuccess/RetriveSuccess";
import RequireRetriveAuth from "./GlobalFunctions/RequireRetriveAuth";
import RetrivePayment from "./RetrivePage/retrivePayment/RetrivePayment";
import PostPay from "./payementSuccess/PostPay";
import VerifyLockOpen from "./verifyLockOpen/VerifyLockOpen";
import VerLockOpenRetrieve from "./RetrivePage/verifyLockOpenRetrive/VerLockOpenRetrieve";
import { LangContextProvider } from "./GlobalFunctions/LanguageFun";
import TermsAndCondition from "./termsAndCondition/TermsAndCondition";
import TerminalIdAuth from "./GlobalFunctions/TerminalIdAuth";
import { LockAttoting } from "./seat_availabe/LockAttoting";
import ExistingUserAuthenticate from "./loginpage/UserAuthentication/ExistingUserAuthenticate";
import RetrieveSuccessPayLater from "./RetrivePage/retriveSuccess/RetrieveSuccessPayLater";
import PartialRetrieveSuccess from "./RetrivePage/retriveSuccess/PartialRetrieveSuccess";
import { useIdleTimer } from "react-idle-timer";
import TestKayout from "./loginpage/TestKayout";
import InvoiceDownloader from "./DownloadInvoice/InvoiceDownloader";
import ErrorPath from "./WrongPath/ErrorPath";
import SomeTesting from "./SomeTesting";
import MobilelockerIntro from "./mobile-lockers/MobilelockerIntro";
import { MobileLockerAuthProvider } from "./GlobalFunctions/MobileLockerAuth";
import OtpVerification from "./mobile-lockers/mobile-lockers-user-auth/OtpVerification";
import MobileLockerUserDetails from "./mobile-lockers/mobile-lockers-user-auth/MobileLockerUserDetails";
import MobileLockersVerifyDetails from "./mobile-lockers/mobile-lockers-user-auth/MobileLockersVerifyDetails";
import WebcamCapture from "./WebcamCapture";
import TempleLockerUserConfirmation from "./mobile-lockers/mobile-locker-payment/TempleLockerUserConfirmation";
import LockerOpenVerification from "./mobile-lockers/mobile-locker-payment/LockerOpenVerification";
import LockerOpenSuccess from "./mobile-lockers/mobile-locker-payment/LockerOpenSuccess";
import MobileLockerAuthentication from "./mobile-lockers/server-connectivity/MobileLockerAuthentication";
import HospitalMainApp from "./HospitalSubscriptionModel/HospitalMainApp";
import HospitalLogin from "./HospitalSubscriptionModel/HospitalLogin";
import LockerOpenSuccessHospitals from "./HospitalSubscriptionModel/HospitalLockerOpenSuccess";

function App() {
  return (
    <div className="App">
      {/* <HospitalMainApp /> */}
      <AuthProvider>
        <RetriveAuthProvider>
          <LangContextProvider>
            <MobileLockerAuthProvider>
              <Router>
                <Routes>
                  <Route path="/storeRetrieve" element={<StoreOrRetrive />} />

                  <Route
                    path="/retrievePay"
                    element={
                      <RequireRetriveAuth>
                        <RetrivePayment />
                      </RequireRetriveAuth>
                    }
                  />

                  <Route
                    path="/retrieve"
                    element={
                      <TerminalIdAuth>
                        <RetrivePage />
                      </TerminalIdAuth>
                    }
                  />

                  <Route
                    path="/retrieveSuccess"
                    element={
                      <RequireRetriveAuth>
                        <RetriveSuccess />{" "}
                      </RequireRetriveAuth>
                      // <RetriveSuccess />
                    }
                  />

                  <Route
                    path="/retrieveSuccessPayLater"
                    element={
                      <RequireRetriveAuth>
                        <RetrieveSuccessPayLater />{" "}
                      </RequireRetriveAuth>
                    }
                  />

                  <Route
                    path="/partialRetrieve"
                    element={
                      <RequireRetriveAuth>
                        <PartialRetrieveSuccess />{" "}
                      </RequireRetriveAuth>
                    }
                  />

                  <Route
                    path="/forgotPass"
                    element={
                      <TerminalIdAuth>
                        <ForgotPasscode />
                      </TerminalIdAuth>
                    }
                  />

                  <Route
                    path="/retrieveLock"
                    element={
                      <RequireRetriveAuth>
                        <RetriveLock />
                      </RequireRetriveAuth>
                    }
                  />

                  <Route
                    path="/checkotp"
                    element={
                      <RequireRetriveAuth>
                        <ConfirmOtp />
                      </RequireRetriveAuth>
                    }
                  />

                  <Route
                    path="/verlockopenret"
                    element={
                      <RequireRetriveAuth>
                        <VerLockOpenRetrieve />
                      </RequireRetriveAuth>
                    }
                  />

                  <Route
                    path="/login"
                    element={
                      <TerminalIdAuth>
                        <LoginPage />
                      </TerminalIdAuth>
                    }
                  />

                  <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <LockAttoting />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/userAuth"
                    element={
                      <RequireAuth>
                        <UserAuthenticate />{" "}
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/exitstingUserAuth"
                    element={
                      <RequireAuth>
                        <ExistingUserAuthenticate />{" "}
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/verOtp"
                    element={
                      <RequireAuth>
                        <LoginOtp />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/success"
                    element={
                      <RequireAuth>
                        <PayementSuccess />{" "}
                      </RequireAuth>
                      // <PayementSuccess />
                    }
                  />

                  <Route
                    path="/postpay"
                    element={
                      <RequireAuth>
                        <PostPay />
                      </RequireAuth>
                      // <PostPay />
                    }
                  />

                  <Route
                    path="/verOpenLock"
                    element={
                      <RequireAuth>
                        <VerifyLockOpen />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/termsAndCond"
                    element={
                      <RequireRetriveAuth>
                        <TermsAndCondition />
                      </RequireRetriveAuth>
                    }
                  />

                  {/* <Route path="/testylay" element={<TestKayout />} /> */}
                  <Route path="/i/d" element={<InvoiceDownloader />} />

                  <Route path="/test" element={<SomeTesting />} />

                  {/** for mobile storage lockers which to be installed in temples (shirdi) */}
                  <Route
                    path="/lockers/mobile-storage"
                    element={
                      <MobileLockerAuthentication>
                        {" "}
                        <MobilelockerIntro />
                      </MobileLockerAuthentication>
                    }
                  />
                  <Route
                    path="/lockers/otp-verification"
                    element={
                      <MobileLockerAuthentication>
                        {" "}
                        <OtpVerification />{" "}
                      </MobileLockerAuthentication>
                    }
                  />
                  <Route
                    path="/lockers/user-details"
                    element={
                      <MobileLockerAuthentication>
                        {" "}
                        <MobileLockersVerifyDetails />
                      </MobileLockerAuthentication>
                    }
                  />

                  {/* <Route
                    path="/lockers/verify-details"
                    element={<MobileLockersVerifyDetails />}
                  /> */}

                  <Route
                    path="/lockers/locker-payment"
                    element={
                      <MobileLockerAuthentication>
                        <TempleLockerUserConfirmation />
                      </MobileLockerAuthentication>
                    }
                  />

                  <Route
                    path="/lockers/verify-locker-open"
                    element={
                      <MobileLockerAuthentication>
                        <LockerOpenVerification />
                      </MobileLockerAuthentication>
                    }
                    // element={<LockerOpenVerification />}
                  />

                  <Route
                    path="/lockers/booking-confirm"
                    element={
                      <MobileLockerAuthentication>
                        <LockerOpenSuccess />
                      </MobileLockerAuthentication>
                    }
                  />

                  {/* <Route
                    path="/lockers/booking-confirm"
                    element={<LockerOpenSuccess />}
                  /> */}

                  {/* <Route
                    path="web-cam"
                    element={<WebcamCapture />}
                  > */}

                  {/* </Route> */}

                  {/* For hospital doctors subscription basis */}
                  <Route
                    path="/tuckit/subscription-lockers"
                    element={<HospitalLogin />}
                  />
                  <Route
                    path="/tuckit/subscription-lockers/success"
                    element={<LockerOpenSuccessHospitals />}
                  />

                  <Route path="/*" element={<ErrorPath />} />
                </Routes>
              </Router>
            </MobileLockerAuthProvider>
          </LangContextProvider>
        </RetriveAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
