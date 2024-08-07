// Global variables to track player position
let playerRow = 0;
let playerCol = 0;
document.getElementById('generateButton').addEventListener('click', () => {
    const rows = parseInt(document.getElementById('rowsInput').value);
    const cols = parseInt(document.getElementById('colsInput').value);
    const cellSize = parseInt(document.getElementById('cellSizeInput').value);
    
    initializeMaze(rows, cols, cellSize);
});

document.getElementById('playButton').addEventListener('click', () => {
    playerRow = 0;
    playerCol = 0;
    drawPlayer(); // Draw the player at the starting position
    enablePlayerMovement();
});

// Function to draw the player
function drawPlayer() {
    if (playerRow === maze.length - 1 && playerCol === maze[0].length - 1) {
        ctx.fillStyle='green';
    }
    else{
        ctx.fillStyle = 'blue';
    }
    const x = playerCol * currentCellSize;
    const y = playerRow * currentCellSize;
    ctx.fillRect(x + currentCellSize / 4, y + currentCellSize / 4, currentCellSize / 2, currentCellSize / 2);
}

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

let n=0;
// Function to enable player movement with arrow keys
function enablePlayerMovement() {
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase(); // Ensure lowercase comparison
        let dx = 0, dy = 0; // Movement deltas
        switch (key) {
            case 'w':
                dy = -1;
                break;
            case 's':
                dy = 1;
                break;
            case 'a':
                dx = -1;
                break;
            case 'd':
                dx = 1;
                break;
            default:
                return; 
        }
        n=n+1;
        const newRow = playerRow + dy;
        const newCol = playerCol + dx;
        if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length && !isWallBetween(playerRow, playerCol, newRow, newCol)) {
            playerRow = newRow;
            playerCol = newCol;
            console.log(playerRow,playerCol);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMaze(currentCellSize);
            drawPlayer();
        }
        if (playerRow === maze.length - 1 && playerCol === maze[0].length - 1) {
            alert("Congratulations! You solved the maze in " +n+ " moves");
        }
    });
}

function isWallBetween(row1, col1, row2, col2) {
    const dx = col2 - col1;
    const dy = row2 - row1;

    if (dx === 1) {
        return maze[row1][col1].walls[1] || maze[row2][col2].walls[3];
    } else if (dx === -1) {
        return maze[row1][col1].walls[3] || maze[row2][col2].walls[1];
    } else if (dy === 1) {
        return maze[row1][col1].walls[2] || maze[row2][col2].walls[0];
    } else if (dy === -1) {
        return maze[row1][col1].walls[0] || maze[row2][col2].walls[2];
    }
    return false;
}


function setDifficulty(rows, cols, cellSize) {
    initializeMaze(rows, cols, cellSize);
}

function showCustomForm() {
    document.getElementById('customForm').style.display = 'block';
}

let canvas, ctx, maze, cellStack, path;
const delayTime = 50;  
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false;
        this.walls = [true, true, true, true]; // top, right, bottom, left
    }
}

function initializeMaze(rows, cols, cellSize) {
    canvas = document.getElementById('mazeCanvas');
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    ctx = canvas.getContext('2d');
    maze = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => new Cell(row, col))
    );
    cellStack = [];
    path = [];  
    currentCellSize = cellSize;  
    generateMazePrim(rows, cols);
    drawMaze(cellSize);
    document.getElementById('solveButton').addEventListener('click', () => {
        if (solveMaze(0, 0, rows - 1, cols - 1)) {
            drawPathWithDelay(cellSize);
        } else {
            alert("No solution found");
        }
    });
}

function removeWall(current, next) {
    const dx = current.col - next.col;
    const dy = current.row - next.row;
    if (dx === 1) { current.walls[3] = false; next.walls[1] = false; }
    if (dx === -1) { current.walls[1] = false; next.walls[3] = false; }
    if (dy === 1) { current.walls[0] = false; next.walls[2] = false; }
    if (dy === -1) { current.walls[2] = false; next.walls[0] = false; }
}

function getUnvisitedNeighbors(cell) {
    const { row, col } = cell;
    const neighbors = [];
    const directions = [
        [-1, 0, 0, 2],
        [1, 0, 2, 0],
        [0, -1, 3, 1],
        [0, 1, 1, 3]
    ];
    for (const [dr, dc, currentWall, nextWall] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length && !maze[newRow][newCol].visited) {
            neighbors.push(maze[newRow][newCol]);
        }
    }
    return neighbors;
}

function generateMazePrim(rows, cols) {
    const walls = [];
    const startCell = maze[0][0];
    startCell.visited = true;
    // Add walls of the starting cell to the wall list
    addWallsToWallList(0, 0, walls);
    while (walls.length > 0) {
        // Pick a random wall from the list
        const randomIndex = Math.floor(Math.random() * walls.length);
        const [currentRow, currentCol, nextRow, nextCol] = walls[randomIndex];
        const currentCell = maze[currentRow][currentCol];
        const nextCell = maze[nextRow][nextCol];
        if (!nextCell.visited) {
            // Remove the wall between currentCell and nextCell
            removeWall(currentCell, nextCell);
            nextCell.visited = true;
            // Add the walls of the nextCell to the wall list
            addWallsToWallList(nextRow, nextCol, walls);
        }
        // Remove the wall from the list
        walls.splice(randomIndex, 1);
    }
}

function addWallsToWallList(row, col, walls) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length && !maze[newRow][newCol].visited) {
            walls.push([row, col, newRow, newCol]);
        }
    }
}

function drawMaze(cellSize) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[0].length; col++) {
            const cell = maze[row][col];
            const x = col * cellSize;
            const y = row * cellSize;

            ctx.beginPath();
            if (cell.walls[0]) ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y); // top
            if (cell.walls[1]) ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize); // right
            if (cell.walls[2]) ctx.moveTo(x + cellSize, y + cellSize), ctx.lineTo(x, y + cellSize); // bottom
            if (cell.walls[3]) ctx.moveTo(x, y + cellSize), ctx.lineTo(x, y); // left
            ctx.stroke();
        }
    }
}

function solveMaze(row, col, endRow, endCol) {
    const startCell = maze[row][col];
    const endCell = maze[endRow][endCol];
    const stack = [startCell];
    const visited = new Set();
    const parent = new Map();

    parent.set(startCell, null);

    while (stack.length > 0) {
        const currentCell = stack.pop();

        if (currentCell === endCell) {
            path = [];  // Clear the path array
            let cell = endCell;
            while (cell !== null) {
                path.unshift(cell);
                cell = parent.get(cell);
            }
            return true;
        }

        visited.add(currentCell);

        const neighbors = getUnvisitedAndAccessibleNeighbors(currentCell, visited);

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
                parent.set(neighbor, currentCell);
            }
        }
    }

    return false;
}

function getUnvisitedAndAccessibleNeighbors(cell, visited) {
    const { row, col } = cell;
    const neighbors = [];

    const directions = [
        [-1, 0, 0, 2], // top
        [1, 0, 2, 0], // bottom
        [0, -1, 3, 1], // left
        [0, 1, 1, 3]  // right
    ];

    for (const [dr, dc, currentWall, nextWall] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (
            newRow >= 0 && newRow < maze.length &&
            newCol >= 0 && newCol < maze[0].length &&
            !visited.has(maze[newRow][newCol]) &&
            !cell.walls[currentWall]
        ) {
            neighbors.push(maze[newRow][newCol]);
        }
    }

    return neighbors;
}

function drawPathWithDelay(cellSize) {
    let i = 0;

    function drawNextStep() {
        if (i < path.length) {
            const cell = path[i];
            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(cell.col * cellSize + cellSize / 2, cell.row * cellSize + cellSize / 2);
            } else {
                ctx.lineTo(cell.col * cellSize + cellSize / 2, cell.row * cellSize + cellSize / 2);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            i++;
            setTimeout(drawNextStep, delayTime);  // Reduced delay time
        } else {
            alert("Maze Solved!");
        }
    }

    drawNextStep();
}
