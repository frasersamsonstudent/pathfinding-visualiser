import CellTypes from "../CellTypes";

const getRandomNumInRange = (startInclusive, endInclusive, increment) => {
    const range = Array.from({ length: (endInclusive - startInclusive) / increment + 1}, (_, i) => startInclusive + (i * increment));
};

const getRandomOddNumber = (start, end) => {
    let value = Math.floor(Math.random() * ((end-start)+1)) + start;
    
    // If value is even, add 1 to make odd
    value += value % 2 === 0 ? 1 : 0;
    
    if(value > end) {
        value -=2;
    };

    return value;
};

const getRandomEvenNumber = (start, end) => {
    let value = Math.floor(Math.random() * ((end-start)+1)) + start;
    
    // If value is odd, add 1 to make even
    value += value % 2 === 1 ? 1 : 0;
    
    if(value > end) {
        value -=2;
    };

    return value;
}

const drawHorizontal = (grid, setGrid, colStart, colEnd, row) => {
    const gapPosition = getRandomOddNumber(colStart, colEnd);
    const newGrid = [...grid];

    for(let i=colStart; i<=colEnd; i++) {
        if(i != gapPosition) newGrid[row][i].value = CellTypes.wall;
    };

    setGrid(newGrid);
};

const drawVertical = (grid, setGrid, col, rowStart, rowEnd) => {
    const gapPosition = getRandomOddNumber(rowStart, rowEnd);
    const newGrid = [...grid];

    for(let i=rowStart; i<=rowEnd ; i++) {
        if(i != gapPosition) newGrid[i][col].value = CellTypes.wall
    }

    setGrid(newGrid);
};

const drawRandomWallInBounds = (grid, setGrid, startCol, endCol) => {
    const drawCol = getRandomEvenNumber(startCol, endCol);
    drawVertical(grid, setGrid, drawCol, 1, grid.length-2);
}

const recursiveDivision = (grid, setGrid, startCol, endCol, startRow, endRow) => {
    if(!grid || startCol >= endCol || startRow >= endRow || (endCol - startCol) < 2 || (endRow - startRow) < 2) {
        return;
    } 

    const isDrawingVertical = (endCol - startCol) > (endRow - startRow) ? true : false;
    
    if(isDrawingVertical) {
        const colToDrawWall = getRandomEvenNumber(startCol, endCol);
        drawVertical(grid, setGrid, colToDrawWall, startRow, endRow);

        // Call function recursively on sections which have been created by drawing wall
        recursiveDivision(grid, setGrid, startCol, colToDrawWall-1, startRow, endRow);
        recursiveDivision(grid, setGrid, colToDrawWall+1, endCol, startRow, endRow);
    }
    else {
        const rowToDrawWall = getRandomEvenNumber(startRow, endRow);
        drawHorizontal(grid, setGrid, startCol, endCol, rowToDrawWall);

        // Call function recursively on sections which have been created by drawing wall
        recursiveDivision(grid, setGrid, startCol, endCol, startRow, rowToDrawWall-1);
        recursiveDivision(grid, setGrid, startCol, endCol, rowToDrawWall+1, endRow,);
    }
};
export {recursiveDivision};