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
      coordinates: [],
      selectedColor: ""
    };

    this.gray = '#e9e9e9';
    this.violet = '#741AAC';
    this.red = '#E43D40';
    this.green = '#1DC690';
    this.yellow = '#f9d030';
  }

  changeCoordinate = (coordinate, index, coordinates) => {
    this.cropsRef.current.container.childNodes.forEach((element) => {
      if (element.localName !== "img") {
        element.onclick = () => this.handleCropClick(element, element.childNodes[0].innerHTML);
      }
    });

    coordinates[index].label = this.state.coordinateLabel;
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

  handleCurrentNameChange = (event) => {
    let newLabel = event.target.value;
    let focusedCoordinate = this.state.focusedCoordinate;
    if (focusedCoordinate) {
      focusedCoordinate.childNodes[0].innerHTML = newLabel;
    }
    this.setState({ focusedCoordinate, coordinateLabel: newLabel });
  };

  handleCropClick = (element, index) => { 
    element.style.background = this.state.selectedColor;
    this.setState({
      focusedCoordinate: element,
      coordinateLabel: element.childNodes[0].innerHTML,
    });

    this.labelInputRef.current.focus();
  };

  handleColorChange = (color) => {
    let selectedColor = this.state.selectedColor;
    if(selectedColor !== color){
      selectedColor = color;
      this.setState({selectedColor}); 
    } else{
      selectedColor = '#8c8c8c';
      this.setState({selectedColor});
    }
  };

  saveSelection() {
    let coordinates = this.state.coordinates;
    let annotations = coordinates.map((coordinate) => {
      const { id, label, ...annotations } = coordinate;

      return annotations;
    });

    let labels = coordinates.map((coordinate) => {
      return coordinate.label;
    });

    let uniqueLabels = Array.from(new Set(labels));

    let selection = {
      classes: uniqueLabels,
      data: [
        {
          image: this.props.img,
          annotations,
        },
      ],
    };

    console.log(selection);

    //TODO: send the selection object as request
  }

  setImageBackgroundColor(color) {
    this.cropsRef.current.container.childNodes.forEach((element) => {
      if (element.localName == "img") {
        element.style = ` -webkit-filter: opacity(.5) drop-shadow(0 0 0 ${color}) `
      }
    });
  }

  render() {
    return (
      <div className="box card col-lg-4 shadow-sm text-center d-flex flex-column justify-content-between align-items-between">
        <h3 className="card-title fs-4 text-primary-2 mb-3">Rotulação</h3>
        <MultiCrops
          src={this.props.img}
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
            <button className="shadow-sm border-0 rounded p-3 m-1 w-25" 
            style={{backgroundColor: this.gray}}
            onClick={() => this.handleColorChange(this.gray)}/>
            <button className="shadow-sm border-0 rounded p-3 m-1 w-25" 
            style={{backgroundColor: this.violet}}
            onClick={() => this.handleColorChange(this.violet)}/>
            <button className="shadow-sm border-0 rounded p-3 m-1 w-25" 
            style={{backgroundColor: this.red}}
            onClick={() => this.handleColorChange(this.red)}/>
            <button className="shadow-sm border-0 rounded p-3 m-1 w-25" 
            style={{backgroundColor: this.green}}
            onClick={() => this.handleColorChange(this.green)}/>
            <button className="shadow-sm border-0 rounded p-3 m-1 w-25" 
            style={{backgroundColor: this.yellow}}
            onClick={() => this.handleColorChange(this.yellow)}/>
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

            <button className="btn shadow ms-4" onClick={() => this.setImageBackgroundColor(this.state.selectedColor)}>
              Preencher imagem
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Cropper;
