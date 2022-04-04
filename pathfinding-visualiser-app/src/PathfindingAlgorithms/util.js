import CellTypes from "../CellTypes";

const isInBounds = (grid, col, row) => {    
    if(row < 0 || row  >= grid.length || col < 0 || col >= grid[0].length) {
        return false;
    }
    return true;
};

const isEmpty = cell => {
    return cell.value !== CellTypes.wall;
}

const getNeighbours = (grid, cell) => {
    const neighbourNodes = [];
    const col = cell.col, row = cell.row;
    const potentialNeighbourPositions = [[col, row-1], [col, row+1], [col-1, row], [col+1, row]];
    
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

export {getNeighbours, getPathFromExplored };