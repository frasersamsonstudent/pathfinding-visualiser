import CellTypes from "../CellTypes";
import {DisjointSet, union, isSameSet} from "../Objects/DisjointSet";
import Position, {isPositionEqual} from "../Objects/Position";
import { getColAndRowFromKey } from "../Objects/Cell";

const inBounds = (grid, col, row) => {
    return col >= 0 && col < grid[0].length && row >= 0 && row < grid.length;
}

const getNeighours = (grid, position) => {
    const col = position.col, row = position.row;

    let neighbours = [[col, row+2], [col+2, row], [col, row-2], [col-2, row]];

    neighbours =  neighbours.filter(
        ([col, row]) => inBounds(grid, col, row)
    );

    return neighbours.map((neighbourAsArr) => grid[neighbourAsArr[1]][neighbourAsArr[0]]);
    
};

const getDisjointedNeighbour = (grid, mapOfSets, position) => {
    const disjointedNeighbours = [];

    for(let neighbour of getNeighours(grid, position)) {
        console.log(mapOfSets, position, neighbour, "are these different sets? : ", mapOfSets.get(position) !==  mapOfSets.get(neighbour.toString()));
        if(mapOfSets.get(position) !==  mapOfSets.get(neighbour)) {
            disjointedNeighbours.push(neighbour);
        }
    }

    if(disjointedNeighbours.length === 0) {
        return null;
    }
    else if(disjointedNeighbours.length === 1) {
        return disjointedNeighbours[0];
    }

    // Return random disjointed neighbour
    return disjointedNeighbours[Math.floor(Math.random() * disjointedNeighbours.length)];
}

const joinCells = (grid, listOfWalls, colStart, colEnd, rowStart, rowEnd) => {
    // Make both cells walls
    listOfWalls.push(grid[colStart][rowStart]);
    listOfWalls.push(grid[colEnd][rowEnd]);

    // Make cell between the two cells a wall]
    if(rowStart === rowEnd) {
        listOfWalls.push(grid[colStart + ((colStart - colEnd) / 2)][rowStart]);
    }
    else {
        listOfWalls.push(grid[colStart][rowStart + ((rowEnd - rowStart) / 2)]);
    }
   
}

const getListOfNodesForAlgorithm = grid => {
    const positions = [];

    // Only return cells at odd positions, within bounds of an outer wall
    for(let row = 1; row < grid.length; row += 2) {
        for(let col = 1; col < grid[0].length; col += 2) {
            positions.push(grid[col][row]);
        }
    }

    return positions;
}

const kruskalMaze = (listOfWalls, grid) => {
    const listOfNodePositions = getListOfNodesForAlgorithm(grid);
    const setOfNodePositions = new Set(listOfNodePositions);

    const disjointSet = new DisjointSet(listOfNodePositions);

    while(setOfNodePositions.size > 0) {
        const randomNodePosition = getRandomElementOfSet(setOfNodePositions);
        let col = randomNodePosition.col, row = randomNodePosition.row;
        setOfNodePositions.delete(randomNodePosition);

        const disjointedNeighbour = getDisjointedNeighbour(grid, disjointSet.mapOfSets, randomNodePosition);
        if(disjointedNeighbour !== null) {
            joinCells(grid, listOfWalls, col, disjointedNeighbour.col, row, disjointedNeighbour.row);
            union(disjointSet.mapOfSets, randomNodePosition, disjointedNeighbour, isPositionEqual);
        }
    }
    console.log(listOfWalls)
}

const getRandomElementOfSet = set => {
    return [...set][Math.floor(Math.random() * set.size)];
};

export {kruskalMaze};