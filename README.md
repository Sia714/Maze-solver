# Maze-solver

The project aims to create an interactive application that generates a maze and allows a user to solve it manually or automatically. The maze generation algorithm ensures a unique path from start to finish, and the player can navigate through the maze using mouse clicks. This project integrates HTML, CSS, and JavaScript to create an interactive and visually appealing interface.

### Objectives
*	Develop an algorithm to generate a maze.
*	Implement a user interface for maze generation and player movement.
*	Enable manual navigation through the maze using mouse clicks.
*	Implement an algorithm for automatic maze solving.
  
## Algorithms Used
### 1.	Maze Generation Algorithm (Prim's Algorithm):
*	Initialize a grid of cells.
*	Start from the initial cell and add its walls to a list.
*	While there are walls in the list:
    * Pick a random wall from the list.
  * If only one of the two cells divided by the wall is visited, then:
	Make the wall a passage.
	Mark the unvisited cell as part of the maze.
	Add the neighboring walls of the cell to the wall list.
2.	Player Movement Logic:
o	Capture mouse clicks to determine the target cell.
o	Check if the move is valid (i.e., there is no wall between the current cell and the target cell).
o	Update the player's position and redraw the maze and player.
3.	Maze Solving Algorithm:
o	Implement a depth-first search (DFS) to find the path from the start to the end of the maze.
