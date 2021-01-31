
const controls = document.querySelector('.controls');

let rows = 24;
let cols = 24;

//initialize
function initialize() { //calls any other functions needed to get the game initialized
  createTable();
}

//lay out the board
function createTable() { //generate table rows and columns
  const gridContainer = document.getElementById('gridContainer');
  if(!gridContainer){
    //Throw error
    console.error("Problem: no div for the grid table!");
  }

  const table = document.createElement('table');

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');
    for(let j = 0; j < cols; j++) { //within each tr element, add num of cells/cols
      let cell = document.createElement('td');
      cell.setAttribute('id', i + "_" + j); //create a unique id for the cell
      cell.setAttribute('class', 'dead'); //add className of 'dead' to the cell
      tr.appendChild(cell); //appending cell to the row
    }
    table.appendChild(tr); //append tr element to the table element in the outer loop
  }
  gridContainer.appendChild(table);
}

//start Game
window.onload = initialize;
