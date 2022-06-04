import {getRandomInt, joinCells, getUnvisitedNeighbours, getVisitedNeighbours, popRandomElementOfSet, popRandomElementOfArray, addElementsToSet} from './mazeGenerationUtil';

const primsAlgorithm = (listOfNodesToClear, grid) => {
    const frontier = new Set();
    const visited = new Set();
    const startX = 1, startY = 1;

    visited.add(grid[startY][startX]);
    addElementsToSet(frontier, getUnvisitedNeighbours(grid, grid[startY][startX], visited))

    while(frontier.size > 0) {
        // Get random frontier node
        const selectedFrontierNode = popRandomElementOfSet(frontier);
        const unvisitedNeighbours = getVisitedNeighbours(grid, selectedFrontierNode, visited);
        visited.add(selectedFrontierNode);

        if(unvisitedNeighbours.length > 0) {
            // Choose random unvisited neighbour
            const cellInPath = popRandomElementOfArray(unvisitedNeighbours);
            visited.add(cellInPath);

            // Join current to random neighbour
            joinCells(grid, listOfNodesToClear, selectedFrontierNode.col, cellInPath.col, selectedFrontierNode.row, cellInPath.row);

            // Add any more frontier nodes
            const newFrontierNodes = getUnvisitedNeighbours(grid, selectedFrontierNode, visited);
            if(newFrontierNodes.length > 0) {
                addElementsToSet(frontier, newFrontierNodes)
            }
        }

    }

    return listOfNodesToClear;
};

export {primsAlgorithm};