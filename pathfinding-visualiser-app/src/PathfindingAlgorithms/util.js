import CellTypes from "../CellTypes";

const getNeighbours = (grid, gridDimensions, cellPosition) => {
    let neighbours = []
    for(let i=-1;i<=1;i++) {
        for(let j=-1;j<=1;j++) {
            if(!(i===0 && j===0)) {
                neighbours.push([cellPosition[0]+i, cellPosition[1]+j]);
            }
        }
    };

    neighbours = neighbours.filter(neighbour => {
        if(neighbour[0] < 0 || neighbour[0] >= gridDimensions[0] || neighbour[1] < 0 || neighbour[1] >= gridDimensions[1]) {
            return false;
        } 
        
        const cellValue = grid[cellPosition[1]][cellPosition[0]];
        if(cellValue !== CellTypes.empty) {return false;}

        return true;
    });

    return neighbours;
};

const getPathFromExplored = (explored, goal) => {
    if(explored.get(goal.toString()) === undefined) {
        return;
    }
    
    let curr = goal;
    const path = [];
    while(curr !== undefined) {
        path.push(curr);
        curr = explored.get(curr.toString());
    }

    return path;
};

const outputNodesInExplored = (explored) => {
    console.log(...explored.entries());
}

export {getNeighbours, getPathFromExplored, outputNodesInExplored};