import CellTypes from "../CellTypes";

const isOutOfBounds = (grid, cell) => {
    const [row, col] = cell;
    
    if(row < 0 || row  >= grid.length || col < 0 || col >= grid[0].length) {
        return true;
    }
    return false;
}
const getNeighbours = (grid, gridDimensions, cellPosition) => {
    let neighbours = []

    // Create array of possible neighbours
    for(let i=-1;i<=1;i++) {
        for(let j=-1;j<=1;j++) {
            if(!(i===0 && j===0)) {
                neighbours.push([cellPosition[0]+i, cellPosition[1]+j]);
            }
        }
    };

    // Filter out invalid neighbours
    neighbours = neighbours.filter(neighbour => {
        if(neighbour === undefined) {
            return false;
        }
        if(isOutOfBounds(grid, neighbour));
        
        
        return true;
    });

    return neighbours;
};

const getPathFromExplored = (explored, goal) => {
    if(goal !== undefined) {
        if(explored.get(goal.toString()) === undefined) {
            return;
    }
    
      let curr = goal.toString();
      const path = [];
      while(curr !== undefined) {
          path.push(curr);
          curr = explored.get(curr.toString());
      }
  
      return path;
    }
};

const outputGrid = (grid, path) => {
    const pathDraw = [];
    for(let x=0;x < grid.length;x++) {
        pathDraw.push([])
        for(let y=0;y < grid[0].length;y++) {
            pathDraw[x].push(path.includes([x, y].toString()) ? 'x' : '0');
      }
    }
    
    console.log(pathDraw);
};
  
const outputNodesInExplored = (explored) => {
    console.log(...explored.entries());
}

export {getNeighbours, getPathFromExplored, outputNodesInExplored, outputGrid };