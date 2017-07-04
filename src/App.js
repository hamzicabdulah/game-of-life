import React, { Component } from 'react';
import './App.css';
import Cell from './Cell';

class App extends Component {
  state = {
    cellsArr: generateArray(70, 50)
  }

  render() {
    return (
      <div className="App">
        {this.state.cellsArr.map((cell) =>
          <Cell number={cell}/>
				)}
      </div>
    );
  }
}

function generateArray(columns, rows) {
  let cellsArr = [];
  let totalCells = columns * rows;

  for (var cell = 1; cell <= totalCells; cell++) {
    cellsArr.push(cell);
  }
  return cellsArr;
}

export default App;
