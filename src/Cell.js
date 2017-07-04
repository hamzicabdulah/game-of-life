import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {
  state = {
    life: "dead"
  }

  changeLife = () => {
    //Change state of cell from dead to alive and vice versa
    this.setState({life: this.state.life === "dead" ? "alive" : "dead"});
  }

  render() {
    return (
      <div className={"Cell " + this.state.life + " " + this.props.number} onClick={this.changeLife}>
      </div>
    );
  }
}

export default Cell;
