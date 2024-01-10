import React from "react";

import { useRef, useState, useEffect } from "react";
import "./VideoPlayer.css";

import * as faceapi from "face-api.js";
import { fabric } from "fabric";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFileChoosen, setIsFileChoosen] = useState(false);
  const faceRects = useRef([]);
  const fabricCanvas = useRef(new fabric.Canvas()); // Initialize Fabric.js canvas directly

  useEffect(() => {
    const initVideo = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };

    initVideo();
  }, []);

  // useEffect(() => {
  //   fabricCanvas.current = new fabric.Canvas(canvasRef.current);
  // }, []);

  const uploadVideo = (e) => {
    // console.log(e);
    const videoFile = e.target.files[0];
    // console.log(videoFile);

    if (videoFile) {
      const videoURL = URL.createObjectURL(videoFile);
      videoRef.current.src = videoURL;
      setIsFileChoosen(true);
    }
  };

  const handlePlayAndPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const faceDetect = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      // Create a Fabric.js canvas object
      const fabricCanvas = new fabric.Canvas(canvas);
      // console.log('resizedDetections ', resizedDetections);

      resizedDetections.forEach(detection => {
        console.log('detection ', detection);
        const { x, y, width, height } = detection.detection.box;
        
        // Create a rectangle using Fabric.js
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width: width,
          height: height,
          fill: 'transparent',
          stroke: 'red',
          strokeWidth: 2
        });

        // Add the rectangle to the Fabric.js canvas
        fabricCanvas.add(rect);
      });
    }, 100);
  };
  return (
    <div>
      <h2 className="mb-8">Welcome To Face Detection App</h2>
      <p className="mb-8">
        <i>This is creted for Quickreels assignment bpurposes</i>
      </p>
      <input type="file" accept="video/*" onChange={uploadVideo} />
      <div className="face-detection">
        <video
          ref={videoRef}
          width={640}
          height={360}
          onPlay={faceDetect}
          onEnded={handleVideoEnd}
          style={{ borderRadius: "10px" }}
        ></video>
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          style={{position: 'absolute', borderRadius: '10px'}}
         
        ></canvas>
      </div>

      {isFileChoosen ? (
        <button
          className={`pausePlayBtn ${isPlaying ? "playBtn" : "pauseBtn"}`}
          onClick={handlePlayAndPause}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      ) : (
        <h4>Upload video detect face</h4>
      )}
    </div>
  );
};

export default VideoPlayer;
