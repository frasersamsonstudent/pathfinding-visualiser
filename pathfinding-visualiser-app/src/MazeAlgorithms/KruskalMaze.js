import CellTypes from "../CellTypes";
import {DisjointSet, union, isSameSet} from "../Objects/DisjointSet";
import Position from "../Objects/Position";
import { getColAndRowFromKey } from "../Objects/Cell";

const inBounds = (grid, col, row) => {
    return col >= 0 && col < grid[0].length && row >= 0 && row < grid.length;
}

const getNeighours = (grid, position) => {
    const [col, row] = getColAndRowFromKey(position);

    const neighbours = [[col, row+1], [col+1, row], [col, row-1], [col-1, row]];

    return neighbours.filter(
        ([col, row]) => inBounds(grid, col, row)
    );
    
};

const getDisjointedNeighbour = (grid, mapOfSets, position) => {
    const disjointedNeighbours = [];

    for(neighbour of getNeighours(grid, position)) {
        if(mapOfSets.get(position) !=  mapOfSets.get(neighbour.toString())) {
            disjointedNeighoburs.push(neighbour);
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

const joinCells = (listOfWalls, colStart, colEnd, rowStart, rowEnd) => {
    // Make both cells walls
    listOfWalls.add(new Position(colStart, rowStart));
    listOfWalls.add(new Position(colEnd, rowEnd));

    // Make cell between the two cells a wall]
    if(rowStart === rowEnd) {
        listOfWalls.add(new Position(colStart + ((colStart - colEnd) / 2), rowStart));
    }
    else {
        listOfWalls.add(new Position(colStart, rowStart + ((rowEnd - rowStart) / 2)));
    }
   
}

const getListOfNodesForAlgorithm = grid => {
    const positions = [];

    // Only return cells at odd positions, within bounds of an outer wall
    for(let row = 1; row < grid.length; row += 2) {
        for(let col = 1; col < grid[0].length; col += 2) {
            positions.push(grid[col][row].getKey());
        }
    }

    return positions;
}

const kruskalMaze = (grid, listOfWalls) => {
    const listOfNodePositions = getListOfNodesForAlgorithm(grid);
    const setOfNodePositions = new Set(listOfNodePositions);


    disjointSet = new DisjointSet(listOfNodePositions);

    while(setOfNodePositions.size > 0) {
        const randomNodePosition = getRandomElementOfSet(setOfNodePositions);
        const [col, row] = getColAndRowFromKey(randomNodePosition);
        setOfNodePositions.delete(randomNodePosition);

        const disjointedNeighbour = getDisjointedNeighbour;
        if(disjointedNeighbour !== null) {
            const [disjointedCol, disjointedRow] = disjointedNeighbour;
            joinCells(listOfWalls, col, disjointedCol, row, disjointedRow);
        }
    }
}

const getRandomElementOfSet = set => {
    return [...set][Math.floor(Math.random() * set.size)];
};