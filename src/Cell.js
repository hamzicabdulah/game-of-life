import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {
  render() {
    return (
      <div className={"Cell " + this.props.life + " " + this.props.number} onClick={this.props.changeLife}>
      </div>
    );  }

}

export default Cell;
