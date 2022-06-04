const getRandomInt = (maxValue) => {
    return Math.floor(Math.random() * maxValue);
};

const getJoiningCellValue = (value1, value2) => {
    return value1 > value2 ? value1-1 : value2-1
};

const joinCells = (grid, listOfWalls, colStart, colEnd, rowStart, rowEnd) => {
    // Make both cells walls
    listOfWalls.push(grid[rowStart][colStart]);
    listOfWalls.push(grid[rowEnd][colEnd]);

    // Make cell between the two cells a wall]
    if(rowStart === rowEnd) {
        listOfWalls.push(grid[rowStart][getJoiningCellValue(colStart, colEnd)]);
    }
    else {
        listOfWalls.push(grid[getJoiningCellValue(rowStart, rowEnd)][colStart]);
    }

}

const getNeighbours = (grid, cell, visited, checkingForVisited = undefined) => {
    let neighbourPositions = [
        [cell.col-2, cell.row], 
        [cell.col+2, cell.row], 
        [cell.col, cell.row-2], 
        [cell.col, cell.row+2]
    ];
    // Get all positions which are in bounds
    neighbourPositions = neighbourPositions.filter(
       ([col, row]) => col >= 0 && col < grid[0].length && row >= 0 && row < grid.length
    );


    if(neighbourPositions.length === 0) {
        return [];
    }

    // Return unvisited neighbours
    const neighbouringCells = neighbourPositions.map(([col, row]) => grid[row][col]);

    return checkingForVisited === undefined 
        ?  neighbouringCells 
        : neighbouringCells.filter((neighbourCell) => checkingForVisited ? visited.has(neighbourCell) : !visited.has(neighbourCell));
}

const getUnvisitedNeighbours = (grid, cell, visited) => {
    return getNeighbours(grid, cell, visited, false);
};

const getVisitedNeighbours = (grid, cell, visited) => {
    return getNeighbours(grid, cell, visited, true);
};

const popRandomElementOfArray = (array) => {
    const randomElement = array.splice(Math.floor(Math.random()*array.length), 1);
    return randomElement[0];
};

const popRandomElementOfSet = (set) => {
    const randomIndex = getRandomInt(set.size-1);
    let counter = 0;
    for(const element of set) {
        if(counter === randomIndex) {
            set.delete(element);
            return element;
        }
        counter++;
    }
};

const addElementsToSet = (set, elements) => {
    if(elements === undefined) {
        return;
    }

    for(const element of elements) {
        set.add(element);
    }
};

export {getRandomInt, joinCells, getNeighbours, getUnvisitedNeighbours, getVisitedNeighbours, popRandomElementOfArray, popRandomElementOfSet, addElementsToSet};