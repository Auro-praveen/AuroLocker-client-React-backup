import React, { useEffect, useRef, useState } from "react";
import YLogo from "../../logos/logo_yellow.png";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import * as faceApi from 'face-api.js'
import { Stream } from "@mui/icons-material";
import './mobile-locker.css';
import { green } from "@mui/material/colors";
import { red } from "@material-ui/core/colors";
import { useMobileLockerAuth } from "../../GlobalFunctions/MobileLockerAuth";
import { useLocation, useNavigate } from "react-router-dom";

const WebCamAuthentication = (props) => {


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(true)
  const [stream, setStream] = useState(null)
  const [currentCapturedImage, setCurrentCapturedImage] = useState(null)
  const [previousluCapturedimage, setPreviouslyCapturedImage] = useState(null)
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false)
  const [isCameraCaptured, setIsCameraCaptured] = useState(false)
  const [captureCount, setCaptureCount] = useState(1)


  const mobileLockerAuth = useMobileLockerAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {

    const loadModels = async () => {
      await faceApi.nets.tinyFaceDetector.loadFromUri("/models").then(() => console.log("loaded")).catch((err) => console.log("something went wrong while loading the models"));
      console.log("models loaded successfullyy");
      setIsModelLoaded(true)
      startWebCam()
    }

    loadModels();

  }, []);


  const startWebCam = () => {

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((videoStream) => {

        console.log("printing here");
        videoRef.current.srcObject = videoStream;
        console.log("printing after");
        setIsCameraStarted(true)
        setStream(videoStream)
      }).catch((err) => {
        console.log("error accessing video camera : " + err);
        // setIsCameraStarted(false)
        // setOpenPermissionDialog(true)
      })

  }

  const stopWebcam = () => {

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });

      // console.log(videoRef.current.srcObject === null);

      // if (videoRef.current.srcObject != null) {
      //   videoRef.current.srcObject = null;
      // }


      setStream(null)
    }

  }


  const handleCapture = async () => {

    const canvas = canvasRef.current;
    const video = videoRef.current;
    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;

    // console.log(video.videoWidth);

    // canvas.width = 300;
    // canvas.height = 250;

    canvas.width = video.width;
    canvas.height = video.height;

    setCaptureCount(() => captureCount + 1)


    console.log(canvas.width);

    const ctx = canvas.getContext('2d');

    // logging canvas data for verification


    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ctx.drawImage(video, 0, 0, 300, 250);

    // const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);


    // console.log("clicked + " + canvas);
    // console.log(imageData);

    // console.log(canvas);

    setIsCameraCaptured(true)

    if (isModelLoaded) {

      console.log("starting face detection ");

      const detections = await faceApi.detectSingleFace(
        canvas,
        new faceApi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.2 })
      );


      console.log(detections);

      if (detections !== undefined) {
        setIsFaceDetected(detections === undefined ? false : true);
        // setCurrentCapturedImage(canvas.toDataURL('image/png'));
        // stopWebcam();
      }

      setIsCameraCaptured(true)
      setCurrentCapturedImage(canvas.toDataURL('image/png'));
      stopWebcam();

    }
  };

  const backToViewDetails = () => {
    props.handleSwitchPage(false);
  };

  const recaptureHandler = () => {

    if (captureCount > 2) {
      setCaptureCount((count) => count - 1);

    }

    setIsCameraCaptured(false)
    startWebCam();
    setPreviouslyCapturedImage(currentCapturedImage)
    setCurrentCapturedImage(null)
  }


  const handleCameraOperations = () => {
    setIsCameraStarted(false)
    setOpenPermissionDialog(false);
    startWebCam();
  }

  const handleProceedAfterCaptture = () => {

    // stopWebcam();

    console.log(currentCapturedImage);
    mobileLockerAuth.handleUserPhotoAuthentication(currentCapturedImage);
    location.pathname = "/lockers/locker-payment";


    navigate(location.pathname, { replace: true })

  }

  return (
    <div className="loginPage-container">
      <div className="mobile-locker-content">
        <img
          className="logo-container"
          src={YLogo}
          alt="img"
          width={100}
          style={{ marginTop: "-5px" }}
        />

        <hr />

        <h5>Please Take Selfie For Verification</h5>

        <div >
          {/* className="selfie-window" */}



          {/* <canvas ref={canvasRef} className={!isCameraCaptured && "no-image-canvas"} /> */}


          <canvas ref={canvasRef} className="no-image-canvas" />

          {
            isCameraCaptured ?
              <div className="selfie-window">
                <img src={currentCapturedImage} width={300} height={250} />
              </div> :

              <div>
                <div className="selfie-window">
                  <video autoPlay ref={videoRef} width={300} height={250}></video>
                </div>
                <div className="mob-lock-btn-container">
                  <Button
                    variant="contained"
                    //   className="mob-locker-btn"
                    color="success"
                    onClick={() => handleCapture()}
                    sx={{
                      marginBottom: 2,
                      width: 200
                    }}
                  // fullWidth
                  >
                    Capture
                  </Button>
                </div>
              </div>
          }

          {
            isCameraCaptured
            && (captureCount <= 2
              ? <>
                {
                  isFaceDetected ? <div><h6 style={{ color: "green" }}> Face Detected , You Can Proceed Now </h6></div>
                    : <div>
                      <h6 style={{ color: "crimson" }}>No Face Detected Please Re-Capture</h6>

                      <Button variant="outlined" color="warning" onClick={() => recaptureHandler()}>
                        Re-Capture
                      </Button></div>
                }
              </>
              :
              <>
                {isFaceDetected ? <div><h6 style={{ color: "green" }}> Face Detected , You Can Proceed Now </h6></div>
                  : <div>
                    <h6 style={{ color: "crimson" }}>No Face Detected, looks like there is a problem, you can proceed with the currently taken photo of yours or you can capture again with your face clearly visible</h6>

                    <Button variant="outlined" color="warning" onClick={() => recaptureHandler()}>
                      Re-Capture
                    </Button></div>}
              </>
            )
          }


          {
            // isCameraCaptured && <Button variant="outlined" color="warning" onClick={() => recaptureHandler()}>
            //   Re-Capture
            // </Button>
          }

        </div>

        {/* <video autoPlay ref={videoRef} width={300} height={250}></video> */}

        {
          // previousluCapturedimage && <img src={previousluCapturedimage} alt="prev-captured-image" width={280} height={250} />
        }

        <hr />

        {
          (captureCount > 2 || isFaceDetected) &&
          <div className="mob-lock-btn-container">
            <Button
              variant="contained"
              //   className="mob-locker-btn"
              color="success"
              onClick={() => handleProceedAfterCaptture()}
              sx={{
                marginBottom: 2
                // width: 200
              }}
              fullWidth
            >
              Proceed
            </Button>
          </div>
        }


      </div>

      <Dialog
        open={openPermissionDialog}
        keepMounted
        //   onClose={() => closeOpenDialog()}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Remeber The Passcode"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <b>Need WebCam Permission To Verify you, While Retrieving ,
              So Please Provide WebCam Permission.</b>
            (Incase You Blocked It Go to Settings , Site Settings, reset Permission and try Again)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCameraOperations()}>Proceed</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default WebCamAuthentication;
