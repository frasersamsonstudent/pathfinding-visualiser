import {joinCells, getUnvisitedNeighbours, popRandomElementOfArray} from './mazeGenerationUtil';

const recursiveBacktrackingMaze = (listOfNodesToClear, grid) => {
    const startPoint = grid[1][1];
    mazeFunction(grid, listOfNodesToClear, startPoint, new Set([startPoint]));
    return listOfNodesToClear;
} 

const mazeFunction = (grid, listOfNodesToClear, current, visited) => {
    // Add current cell to visited
    visited.add(current);

    while(true) {
        // Choose random unvisited neighbour
        const unvisitedNeighbours = getUnvisitedNeighbours(grid, current, visited);

        if(unvisitedNeighbours.length > 0) {
            const randomNeighbour = popRandomElementOfArray(unvisitedNeighbours);
            joinCells(grid, listOfNodesToClear, current.col, randomNeighbour.col, current.row, randomNeighbour.row);

            // Call maze function recursively on neighbour cell
            mazeFunction(grid, listOfNodesToClear, randomNeighbour, visited);
        }

        else return;
    }
};

export {recursiveBacktrackingMaze};