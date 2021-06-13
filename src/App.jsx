import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WebcamComponent from "./components/webcam";
import ScreenshotList from "./components/screenshotList";
import Cropper from "./components/cropper";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImage: {},
      imagesAndCoordinates: [],
    };

    this.handleImageChange.bind(this);
    this.updateSelectedImage.bind(this);
  }

  handleImageChange = (image) => {
    this.setState((state) => ({
      imagesAndCoordinates: [
        ...state.imagesAndCoordinates,
        { src: image, coordinates: [] },
      ],
    }));
  };

  updateSelectedImage = (image, index) => {
    image.index = index;
    let imagesAndCoordinates = this.state.imagesAndCoordinates;
    imagesAndCoordinates[index] = image;

    this.setState({
      imagesAndCoordinates,
      selectedImage: image,
    });
  };

  render() {
    return (
      <div className="App">
        <header className="nav justify-content-start align-items-center">
          <h1 className="my-0 fs-5 fw-bold text-white mx-4">Vision</h1>
        </header>

        <section className="container-fluid">
          <div className="row h-100 gap-1 d-flex align-items-between my-3 mx-1">
            <WebcamComponent
              updateImages={this.handleImageChange}
              images={this.state.imagesAndCoordinates}
            />

            <div className="col d-flex flex-column gap-4">
              <div className="box card col shadow-sm">
                <h3 className="card-title fs-4 text-primary-2 text-center mb-3">
                  Imagens Capturadas
                </h3>
                <div className="p-1 images">
                  <ScreenshotList
                    images={this.state.imagesAndCoordinates}
                    updateSelectedImage={this.updateSelectedImage}
                  >
                    images
                  </ScreenshotList>
                </div>
              </div>
              <div className="box model card col d-flex justify-content-between shadow-sm ">
                <h3 className="card-title fs-4 text-primary-2 text-center mb-4">
                  Modelo
                </h3>
                <div className="d-flex flex-lg-row gap-4">
                  <button className="col btn shadow">Treinar</button>
                  <button className="col btn shadow">Baixar</button>
                </div>
              </div>
            </div>

            <Cropper
              imageAndCoordinates={this.state.selectedImage}
              updateSelectedImage={this.updateSelectedImage}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
