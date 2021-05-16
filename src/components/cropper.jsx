import React from "react";
import MultiCrops from "react-multi-crops";

class Cropper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [],
    };
  }

  changeCoordinate = (coordinate, index, coordinates) => {
    this.setState({
      coordinates,
    });
  };

  deleteCoordinate = (coordinate, index, coordinates) => {
    this.setState({
      coordinates,
    });
  };

  rotateImage() {
    let degrees = 90;
    const canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let image = new Image();
    image.src = this.props.img;

    canvas.width = degrees % 180 === 0 ? image.width : image.height;
    canvas.height = degrees % 180 === 0 ? image.height : image.width;

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(image, image.width / -2, image.height / -2);

    this.props.updateSelectedImage(canvas.toDataURL());
  }

  saveSelection() {
    let annotations = this.state.coordinates.map((coordinate) => {
      delete coordinate.id;
      return { ...coordinate };
    });

    let selection = {
      classes: ["DEFEITO", "MANCHA"],
      data: [
        {
          image: this.props.img,
          annotations,
        },
      ],
    };

    //TODO: send the selection object as request
  }

  render() {
    return (
      <div>
        <MultiCrops
          src={this.props.img}
          coordinates={this.state.coordinates}
          onChange={this.changeCoordinate}
          onDelete={this.deleteCoordinate}
        />
        <div className="p-1 d-flex align-items-end justify-content-center mt-4">
          <button
            className="btn btn-warning shadow"
            type="submit"
            value=""
            onClick={() => this.saveSelection()}
          >
            Salvar seleção
          </button>

          <button
            className="btn btn-warning shadow"
            onClick={() => this.rotateImage()}
          >
            Rodar imagem
          </button>
        </div>
      </div>
    );
  }
}

export default Cropper;
