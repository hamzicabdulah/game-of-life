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
        {this.state.cellsArr.map((row) =>
					<div className="Row">
            {row.map((cell) => 
              <Cell />
            )}
          </div>
				)}
      </div>
    );
  }
}

function generateArray(columns, rows) {
  let cellsArr = [];
  for (var row = 1; row <= rows; row++) {
    cellsArr.push([]);
  }
  cellsArr.forEach((row) => {
    for (var col = 1; col <= columns; col++) {
      row.push(col);
    }
  })
  return cellsArr;
}

export default App;
