import React, { Component } from 'react';
import '../stylesheet/Button.css';

class Button extends Component {
  render() {
    return (
      <button className='Button' onClick={this.props.onClickFunc}>
          {this.props.name}
      </button>
    );  
  }
}

export default Button;
