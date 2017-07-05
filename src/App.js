import React, { Component } from 'react';
import './App.css';
import Cell from './Cell';

let rows = 50;
let columns = 70;

class App extends Component {
  state = {
    cells: generateCells(columns, rows)
  }

  componentDidMount() {
    this.interval = setInterval(this.nextGen, 150);
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          {Object.keys(this.state.cells).map((number) =>
            <Cell number={number} life={this.state.cells[number]} changeLife={() => this.changeLife(number)}/>
          )}
        </div>
      </div>
    );
  }

  changeLife = (number) => {
    //Set life of cell with a given number to dead if it is alive, and vice versa
    let cells = this.state.cells;
    cells[number] = cells[number] === 'dead' ? 'alive' : 'dead';
    this.setState({cells: cells});
  }

  nextGen = () => {
    //Go through every cell and update their life with "dead" or "alive", depending on their neighbor cells
    //The cells object must use an additional function to clone this.state.cells, because cells=this.state.cells points to the same object
    let cells = cloneObject(this.state.cells);
    Object.keys(cells).forEach((number) => {
      cells[number] = this.killOrGiveBirth(number);
      
      if(+number === columns * rows) {
        this.setState({cells: cells});
      }
    });
  }
  
  killOrGiveBirth = (number) => {
    let cellsToCheck = neighborCells(number, columns, rows);
    let aliveNeighbors = 0;

    cellsToCheck.forEach((cellNum) => {
      if (this.state.cells[cellNum] === 'alive') aliveNeighbors++;
    });

    return deadOrAlive(this.state.cells[number], aliveNeighbors);
  }
  
}

function generateCells(columns, rows) {
  //Generate an object with cell numbers as keys and cell lives/states (dead/alive) as values
  let cells = {};
  let totalCells = columns * rows;

  for (var cell = 1; cell <= totalCells; cell++) {
    //When first generating, assign dead or alive state to a cell randomly
    cells[cell] = ['alive', 'dead'][Math.floor(Math.random() * 2)];
  }
  return cells;
}

function cloneObject(object) {
  let objectCopy = {};

  Object.keys(object).forEach((key) => {
    objectCopy[key] = object[key];
  });

  return objectCopy;
}

function neighborCells(numberStr, columns, rows) {
  //Return an array of cell numbers of the neighbors of a cell with a specific number given as argument
  let neighborsArray = [];
  let number = +numberStr;

  if(number % columns !== 0) {
    //If cell has a neighbor on the right, push it to the array
    neighborsArray.push(number + 1);
  }
  if(number !== 1 && (number - 1) % columns !== 0) {
    //If cell has a neighbor on the left, push it to the array
    neighborsArray.push(number - 1);
  }
  if(number > columns) {
    //If cell has a neighbor right above it, push it to the array
    neighborsArray.push(number - columns);
    if(number % columns !== 0) {
      //If cell has a neighbor on the right side above it, push it to the array
      neighborsArray.push(number + 1 - columns);
    }
    if(number !== 1 && (number - 1) % columns !== 0) {
      //If cell has a neighbor on the left side above it, push it to the array
      neighborsArray.push(number - 1 - columns);
    }
  }
  if(number < columns * rows - columns) {
    //If cell has a neighbor right below it, push it to the array
    neighborsArray.push(number + columns);
    if(number % columns !== 0) {
      //If cell has a neighbor on the right side below it, push it to the array
      neighborsArray.push(number + 1 + columns);
    }
    if(number !== 1 && (number - 1) % columns !== 0) {
      //If cell has a neighbor on the left side below it, push it to the array
      neighborsArray.push(number - 1 + columns);
    }
  }

  return neighborsArray;
}

function deadOrAlive(cellLife, aliveNeighbors) {
  //Return dead if cell should die, or alive if cell should be born (depending on the aliveNeighbors)
  if(aliveNeighbors === 3 || (aliveNeighbors === 2 && cellLife === 'alive')) {
    return 'alive';
  } else {
    return 'dead';
  }
}

export default App;
