import React from "react";

const ScreenshotList = (props) => {
  return (
    props.images &&
    props.images.map(function(img, i) {
      return (
        <img
          key={i}
          onClick={() => props.updateSelectedImage(props.images[i])}
          alt="screenshot"
          src={img}
        />
      );
    })
  );
};

export default ScreenshotList;
