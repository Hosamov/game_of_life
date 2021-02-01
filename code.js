
const controls = document.querySelector('.controls');
const gridContainer = document.getElementById('gridContainer');
const instructions = document.querySelector('.instructions');
let playing = false;

let rows = 50;
let cols = 50;

let grid = new Array(rows); //1st array (current)
let nextGrid = new Array(rows); //2nd array (coming up next)

let timer;
let reproductionTime = 100; //control how quickly the cells update

function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols); //create a 2d array within grid
    nextGrid[i] = new Array(cols); //create a 2d array within nextGrid
  }
}

//Reset all cells to 0 (dead state)
function resetGrids() {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) { //iterate through all rows and columns
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

//Reset all cells to 0 (dead state)
function copyAndResetGrid() {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) { //iterate through all rows and columns
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

//initialize
function initialize() { //calls any other functions needed to get the game initialized
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

//lay out the board
function createTable() { //generate table rows and columns

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
      cell.onclick = cellClickHandler;
      tr.appendChild(cell); //appending cell to the row
    }
    table.appendChild(tr); //append tr element to the table element in the outer loop
  }
  gridContainer.appendChild(table);

}

function cellClickHandler() {
  let rowcol = this.id.split('_');
  let row = rowcol[0];
  var col = rowcol[1];

  let classes = this.getAttribute('class');
  if(classes.indexOf('live') > -1) {
    this.setAttribute('class', 'dead');
    grid[row][col] = 0;
  } else {
    this.setAttribute('class', 'live');
    grid[row][col] = 1;
  }
}

function updateView() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupControlButtons() {
  //Button to start
  let startButton = document.getElementById('start');
  startButton.onclick = startButtonHandler;

  //Button to clear
  let clearButton = document.getElementById('clear');
  clearButton.onclick = clearButtonHandler;

  //Button to randomize
  let randomButton = document.getElementById('random');
  randomButton.onclick = randomButtonHandler;
}

//clear button
function clearButtonHandler() {
  console.log('Clear the game: stop playing, clear the grid');
  playing = false;
  let startButton = document.getElementById('start');
  startButton.innerHTML = 'start';

  clearTimeout(timer);

  let cellsList = document.getElementsByClassName('live'); //returns a node list (not yet an array)
  let cells = []; //declare new var for cells
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]); //push node list to an array si we can clear the data properly
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute('class', 'dead');
  }
  resetGrids();
}

//start/continue button
function startButtonHandler() {
  if(playing) {
    console.log('Pause the game');
    playing = false;
    this.innerHTML = 'continue';
    clearTimeout(timer);
  } else {
    console.log('Continue the game');
    playing = true;
    this.innerHTML = 'pause';
    play();
  }
}

//random Button
function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

//run the life game
function play() {
  computeNextGen();

  if(playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}
const rulesBtn = document.getElementById('rules');
rulesBtn.addEventListener('click', () => {
  instructions.insertAdjacentHTML('beforeend', `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <h2>Four Basic Rules:</h2>
            <ul>
              <li>Any live cell with fewer than two live neighbours dies, as if caused by under-population.</li>
              <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
              <li>Any live cell with more than three live neighbours dies, as if by overcrowding.</li>
              <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
            </ul>
            <h2>How to Play:</h2>
            <ul>
              <li>Create your own pattern by clicking on the cells of your choice or choose 'Randomize' for a random approach</li>
              <li>Click 'start' button to start the game or 'pause' to pause the game.</li>
              <li>Anytime throughout the game you may add live cells to the grid.</li>
              <li>Click 'clear' to reset the game board to entirely dead cells.</li>
              <li>Have fun experimenting!</li>
            </ul>
        </div>
    `);

  //Close Modal window button
  const modalCloseBtn = document.getElementById('modal-close-btn');
  modalCloseBtn.addEventListener('click', (e) => {
    instructions.lastElementChild.remove(); //remove it from the screen...
  });
});

//start Game
window.onload = initialize;
