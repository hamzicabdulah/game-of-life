import React, { Component } from 'react';
import '../stylesheet/App.css';
import Header from './Header';
import Cell from './Cell';
import Button from './Button';
import Generation from './Generation';

let rows = 50, columns = 70;

const buttons = {
  mainButtons: ['Run', 'Pause', 'Clear'],
  speedButtons: ['Slow', 'Medium', 'Fast'],
  sizeButtons: ['50x30', '70x50', '100x80']
}

class App extends Component {

  state = {
    interval: '',
    intervalSpeed: 50,
    cells: generateCells(columns, rows),
    cellsNeighbors: generateNeighbors(columns, rows),
    gamePaused: true,
    generation: 0
  }

  componentDidMount() {
    this.Run();
  }

  render() {
    return (
      <div className="App" style={{width: (columns * 11 + 50) + 'px'}}>
        <Header />
        <div className="mainButtons">
          {buttons.mainButtons.map((button) =>
            //Since all button functions have the same names as the actual buttons, they can be accessed with this[button]
            <Button name={button} onClickFunc={() => this[button]()}/>
          )}    
        </div>
        <div className="container" style={{
          width: (columns * 11 - 0.1) + 'px',
          gridTemplateColumns: 'repeat(' + columns + ', 11px)'
        }}>
          {Object.keys(this.state.cells).map((number) =>
            <Cell number={number} life={this.state.cells[number]} changeLife={() => this.changeLife(number)}/>
          )}
        </div>
        <div className="bottomButtons">
          <div className="sizeButtons">
            {buttons.sizeButtons.map((button) =>
              <Button name={button} onClickFunc={() => this.changeSize(button)}/>
            )}    
          </div>
          <div className="speedButtons">
            {buttons.speedButtons.map((button) =>
              //Since all button functions have the same names as the actual buttons, they can be accessed with this[button]
              <Button name={button} onClickFunc={() => this.changeSpeed(button)}/>
            )}    
          </div>
        </div>
        <Generation generation={this.state.generation} />
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
        this.setState({cells: cells, generation: this.state.generation + 1});
      }
    });

    if(this.tableEmpty()) {
      this.Pause();
      this.setState({generation: 0});
    } 
  }
  
  killOrGiveBirth = (number) => {
    //Make a cell dead or alive with external functions
    let cellsToCheck = this.state.cellsNeighbors[number];
    let aliveNeighbors = 0;

    cellsToCheck.forEach((cellNum) => {
      if (this.state.cells[cellNum] === 'alive' || this.state.cells[cellNum] === 'born') aliveNeighbors++;
    });

    return deadOrAlive(this.state.cells[number], aliveNeighbors);
  }

  tableEmpty = () => {
    //Check every cell in the table and return false if any one of them is alive, otherwise return true
    for(var key in this.state.cells) {
      if(this.state.cells[key] !== 'dead') {
        return false;
      };
    }
    return true;
  }

  Run = () => {
    if(this.state.gamePaused) {
      this.setState({interval: setInterval(this.nextGen, this.state.intervalSpeed), gamePaused: false});
    }
  }

  Pause = () => {
    if(!this.state.gamePaused) {
      clearInterval(this.state.interval);
      this.setState({gamePaused: true});
    }
  }

  Clear = () => { 
    //Pause the game and change every cell's life property to "dead"
    this.Pause();
    var cells = {};

    Object.keys(this.state.cells).forEach((cell) => {
      cells[cell] = 'dead';
    });

    this.setState({cells: cells, generation: 0});
  }

  changeSize = (size) => {
    //Change the number of columns and rows and generate a new table
    // eslint-disable-next-line
    columns = +(size.split('x')[0]), rows = +(size.split('x')[1]);
    this.setState({cells: generateCells(columns, rows), cellsNeighbors: generateNeighbors(columns, rows), generation: 0});
    this.Run();
  }
  
  changeSpeed = (speed) => {
    //Change the interval speed of the game
    clearInterval(this.state.interval);

    const speedIntervals = {
      'Slow': 400,
      'Medium': 200,
      'Fast': 50
    };

    this.setState({intervalSpeed: speedIntervals[speed]});
    if (!this.state.gamePaused) this.setState({interval: setInterval(this.nextGen, speedIntervals[speed])});
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

function generateNeighbors(columns, rows) {
  //Generate an object with cell numbers as keys and neighbor cells arrays as values
  let cells = {};
  let totalCells = columns * rows;

  for (var cell = 1; cell <= totalCells; cell++) {
    cells[cell] = neighborCells(cell, columns, rows);
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

function neighborCells(number, columns, rows) {
  //Return an array of cell numbers of the neighbors of a cell with a specific number given as argument
  let neighborsArray = [];

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
  if(cellLife !== 'dead' && (aliveNeighbors === 3 || aliveNeighbors === 2)) {
    return 'alive';
  } else if(aliveNeighbors === 3) {
    return 'born';
  } else {
    return 'dead';
  }
}

export default App;
