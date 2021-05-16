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
          <input
            className="btn btn-warning shadow"
            type="submit"
            value="Salvar seleção"
            onClick={() => this.saveSelection()}
          />
        </div>
      </div>
    );
  }
}

export default Cropper;
