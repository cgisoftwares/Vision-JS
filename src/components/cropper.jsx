import React from "react";
import MultiCrops from "react-multi-crops";

class Cropper extends React.Component {
  constructor(props) {
    super(props);

    this.cropsRef = React.createRef();
    this.labelInputRef = React.createRef();

    this.state = {
      coordinateLabel: "",
      focusedCoordinate: "",
      coordinates: props.imageAndCoordinates.coordinates,
      selectedColor: "#8c8c8c",
    };

    this.gray = "#8c8c8c";
    this.violet = "#741AAC";
    this.red = "#E43D40";
    this.green = "#1DC690";
    this.yellow = "#f9d030";
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.setState({
        coordinates: this.props.imageAndCoordinates.coordinates,
      });
    } else if (prevState.coordinates !== this.state.coordinates) {
      let cropBoxes = [];

      this.cropsRef.current.container.childNodes.forEach((element) => {
        if (element.localName !== "img") {
          cropBoxes.push(element);
        }
      });

      cropBoxes.forEach((element, index) => {
        if (this.state.coordinates[index].label) {
          element.childNodes[0].innerHTML = this.state.coordinates[index].label;
        }
      });
    }
  }

  changeCoordinate = (coordinate, index, coordinates) => {
    this.cropsRef.current.container.childNodes.forEach((element) => {
      if (element.localName !== "img") {
        element.onclick = () => this.handleCropClick(element);
      }
    });

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
    image.src = this.props.imageAndCoordinates.src;

    canvas.width = degrees % 180 === 0 ? image.width : image.height;
    canvas.height = degrees % 180 === 0 ? image.height : image.width;

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(image, image.width / -2, image.height / -2);

    this.props.updateSelectedImage(
      {
        src: canvas.toDataURL(),
        coordinates: this.state.coordinates,
      },
      this.props.imageAndCoordinates.index
    );
  }

  handleCurrentNameChange = (event) => {
    let newLabel = event.target.value;
    let { focusedCoordinate, coordinates } = this.state;
    if (focusedCoordinate?.childNodes) {
      focusedCoordinate.childNodes[0].innerHTML = newLabel;

      let coordinateIndex = this.getCurrentCoordinateIndex(focusedCoordinate);
      coordinates[coordinateIndex].label = newLabel;
    }

    this.setState({
      coordinates,
      focusedCoordinate,
      coordinateLabel: newLabel,
    });
  };

  handleCropClick = (element) => {
    let coordinateIndex = this.getCurrentCoordinateIndex(element);
    let { coordinates, selectedColor } = this.state;
    coordinates[coordinateIndex].label = element.childNodes[0].innerHTML;

    element.style.background = selectedColor;
    this.setState({
      coordinates,
      focusedCoordinate: element,
      coordinateLabel: element.childNodes[0].innerHTML,
    });

    this.labelInputRef.current.focus();
  };

  getCurrentCoordinateIndex(element) {
    let siblings = [];

    if (element.parentElement?.childNodes) {
      element.parentElement.childNodes.forEach((sibling) =>
        siblings.push(sibling)
      );
    }
    siblings.shift();

    return siblings.indexOf(element);
  }

  handleColorChange = (color) => {
    let selectedColor = this.state.selectedColor;
    if (selectedColor !== color) {
      selectedColor = color;
      this.setState({ selectedColor });
    }
  };

  saveSelection() {
    let coordinates = this.state.coordinates;
    if (coordinates) {
      this.props.updateSelectedImage(
        {
          src: this.props.imageAndCoordinates.src,
          coordinates,
        },
        this.props.imageAndCoordinates.index
      );

      let annotations = coordinates.map((coordinate) => {
        const { id, ...annotations } = coordinate;

        return annotations;
      });

      let selection = {
        annotations,
        image: this.props.imageAndCoordinates.src,
      };
      console.log(JSON.stringify(selection));
      //TODO: send the selection object as a request
    }
  }

  setImageBackgroundColor(color) {
    this.cropsRef.current.container.childNodes.forEach((element) => {
      if (element.localName === "img") {
        element.style = ` -webkit-filter: opacity(.5) drop-shadow(0 0 0 ${color}) `;
      }
    });
  }

  render() {
    return (
      <div className="box card col-lg-4 shadow-sm text-center d-flex flex-column justify-content-between align-items-between">
        <h3 className="card-title fs-4 text-primary-2 mb-3">Rotulação</h3>
        <MultiCrops
          src={this.props.imageAndCoordinates.src}
          coordinates={this.state.coordinates}
          onChange={this.changeCoordinate}
          onDelete={this.deleteCoordinate}
          ref={this.cropsRef}
        />

        <input
          type="text"
          value={this.state.coordinateLabel}
          onChange={this.handleCurrentNameChange}
          ref={this.labelInputRef}
        />
        <div>
          <div className="d-flex justify-content-around colors">
            <button
              className="shadow-sm border-0 rounded p-3 m-1 w-25"
              style={{ backgroundColor: this.gray }}
              onClick={() => this.handleColorChange(this.gray)}
            />
            <button
              className="shadow-sm border-0 rounded p-3 m-1 w-25"
              style={{ backgroundColor: this.violet }}
              onClick={() => this.handleColorChange(this.violet)}
            />
            <button
              className="shadow-sm border-0 rounded p-3 m-1 w-25"
              style={{ backgroundColor: this.red }}
              onClick={() => this.handleColorChange(this.red)}
            />
            <button
              className="shadow-sm border-0 rounded p-3 m-1 w-25"
              style={{ backgroundColor: this.green }}
              onClick={() => this.handleColorChange(this.green)}
            />
            <button
              className="shadow-sm border-0 rounded p-3 m-1 w-25"
              style={{ backgroundColor: this.yellow }}
              onClick={() => this.handleColorChange(this.yellow)}
            />
          </div>
          <div className="p-1 d-flex justify-content-center mt-4">
            <button
              className="btn shadow me-4"
              type="submit"
              value=""
              onClick={() => this.saveSelection()}
            >
              Salvar seleção
            </button>

            <button className="btn shadow" onClick={() => this.rotateImage()}>
              Rodar imagem
            </button>

            <button
              className="btn shadow ms-4"
              onClick={() =>
                this.setImageBackgroundColor(this.state.selectedColor)
              }
            >
              Preencher imagem
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Cropper;
