import React from "react";
import Webcam from "react-webcam";

const WebcamCapture = (props) => {
  const webcamRef = React.useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 416,
      height: 416,
    });
    props.updateImages(imageSrc);
  };

  return (
    <div className="box col-lg-5 card d-flex flex-column align-items-between mh-xl-75 justify-content-between shadow-sm">
      <h3 className="card-title fs-4 text-primary-2 text-center mb-3">
        Exibição
      </h3>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <div className="text-center">
        <div className="p-1 d-flex align-items-end justify-content-center mt-4" />
        <button onClick={capture} className="btn shadow mt-4">Capturar imagem</button>
      </div>
    </div>
  );
};

export default WebcamCapture;
