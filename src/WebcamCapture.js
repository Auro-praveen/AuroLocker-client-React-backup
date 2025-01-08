import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false)
  const [stream, setStream] = useState(null)

  useEffect(() => {

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models").then(() => console.log("loaded")).catch((errr) => console.log("some error occured : " + errr));
      setIsModelLoaded(true);

      startVideo();

    };

    loadModels();

  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setIsCameraStarted(true)
        setStream(stream)
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
        setIsCameraStarted(false)



      });
  };

  const callBackToWebcam = async () => {

  }

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });

      console.log("Stopping the video");

      videoRef.current.srcObject = null;
      setStream(null)
    }
  }



  const handleCapture = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;

    canvas.width = 300;
    canvas.height = 250;

    const ctx = canvas.getContext('2d');

    // logging canvas data for verification


    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ctx.drawImage(video, 0, 0, 300, 250);

    // const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);


    // console.log("clicked + " + canvas);
    // console.log(imageData);

    // console.log(canvas);

    if (isModelLoaded) {

      console.log("starting face detection ");

      const detections = await faceapi.detectSingleFace(
        canvas,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.2 })
      );


      console.log(detections);

      if (detections !== undefined) {
        setIsFaceDetected(detections === undefined ? false : true);
        stopVideo();
      }


    }
  };


  return (

    <div>
      <div>


        <video ref={videoRef} autoPlay width="300" height="250" />

        <canvas ref={canvasRef} />


      </div>



      <button onClick={handleCapture}>Capture Photo</button>
      {isFaceDetected !== null && (
        <div>
          {isFaceDetected ? (
            <p>Face detected!</p>
          ) : (
            <p>No face detected. Please try again.</p>
          )}
        </div>
      )}{" "}

      {
        !isCameraStarted &&
        <div>
          Please Provide Web Camera Permission and Provide a photo for verification
          <button onClick={startVideo}>
            proceed
          </button>
        </div>
      }


    </div>
  );

};

export default WebcamCapture;
