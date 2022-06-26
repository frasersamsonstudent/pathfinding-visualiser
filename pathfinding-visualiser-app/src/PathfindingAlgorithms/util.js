import CellTypes from "../CellTypes";
import Position from "../Objects/Position";

const isInBounds = (grid, col, row) => {    
    if(row < 0 || row  >= grid.length || col < 0 || col >= grid[0].length) {
        return false;
    }
    return true;
};

const isNodeStartOrEnd = (grid, checkingCol, checkingRow) => {
    const cellType = grid[checkingRow][checkingCol].value;
    if(cellType === CellTypes.start || cellType === CellTypes.end) {
        return true;
    }
    return false;
};

const isEmpty = cell => {
    return cell.value !== CellTypes.wall;
}

const getNeighbours = (grid, cell) => {
    const neighbourNodes = [];
    const col = cell.col, row = cell.row;
    const potentialNeighbourPositions = [[col, row+1], [col+1, row], [col, row-1], [col-1, row]];
    
    // Add valid nodes to neighbourNodes
    potentialNeighbourPositions.forEach(([neighbourCol, neighbourRow]) => {
        if(isInBounds(grid, neighbourCol, neighbourRow) && isEmpty(grid[neighbourRow][neighbourCol])) {
            neighbourNodes.push(grid[neighbourRow][neighbourCol]);
        }
    })

    return neighbourNodes;
};

const getPathFromExplored = (explored, goal) => {
    if(goal !== undefined) {
        if(explored.get(goal.getKey()) === undefined) {
            return;
    }
    
      let curr = goal.getKey();
      const path = [];
      while(curr !== undefined) {
          path.push(curr.split(','));
          curr = explored.get(curr)
      }
  
      return path;
    }
};

const drawOuterWalls = (grid, setGrid, startNode, endNode) => {
    const newGrid = [...grid];

    // Draw vertical walls
    for(let row=0; row < grid.length; row++) {
        newGrid[row][0].value = CellTypes.wall;
        newGrid[row][grid.length-1].value = CellTypes.wall;
    }

    // Draw horizontal walls
    for(let col=1; col < grid.length-1; col++) {
        newGrid[0][col].value = CellTypes.wall;
        newGrid[grid.length-1][col].value = CellTypes.wall;
    }

    // Replace start and end node
    newGrid[startNode.row][startNode.col].value = CellTypes.start;
    newGrid[endNode.row][endNode.col].value = CellTypes.end;

    setGrid(newGrid)
};

/** Draws outer walls around the grid, with a delay between renders to animate.
 * Asynchronous, promise will be resolved when drawing is finished.
 * 
 * @param {*} grid              grid of cells
 * @param {*} setGrid           setter for grid
 * @param {*} setIsVisualising  setter for visualising
 * @param {*} animationSpeed    delay between updates (in milliseconds)
 * @returns                     promise which is resolved when animating is finished
 */
const drawOuterWallsAndAnimate = async (grid, setGrid, setIsVisualising, animationSpeed) => {
    return new Promise(function(resolve, reject) {
        setIsVisualising(true);
        const wallsToDraw = [];

        // Draw vertical walls
        for(let row=0; row < grid.length; row++) {
            wallsToDraw.push(Position(0, row));
            wallsToDraw.push(Position(grid[0].length-1, row));
        }

        // Draw horizontal walls
        for(let col=1; col < grid[0].length-1; col++) {
            wallsToDraw.push(Position(col, 0));
            wallsToDraw.push(Position(col, grid.length-1));
        }

        wallsToDraw.forEach((wallPos, index) => {
            setTimeout(() => {
                if(!isNodeStartOrEnd(grid, wallPos.col, wallPos.row)) {
                    const newGrid = [...grid];
                    newGrid[wallPos.row][wallPos.col].value = CellTypes.wall;
                    setGrid(newGrid);
                }
            }, animationSpeed * index * 1000);
        });

        const endOfDrawing = animationSpeed * wallsToDraw.length * 1000;
        setTimeout(() => {
            setIsVisualising(false);
            resolve();
        }, endOfDrawing);
    });
    
};

export {getNeighbours, getPathFromExplored, isInBounds, isNodeStartOrEnd, drawOuterWalls, drawOuterWallsAndAnimate};