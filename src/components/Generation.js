import React, { Component } from 'react';
import '../stylesheet/Generation.css';

class Generation extends Component {
  render() {
    return (
      <h2 className='Generation'>
          Generation: {this.props.generation}
      </h2>
    );  
  }
}

export default Generation;
