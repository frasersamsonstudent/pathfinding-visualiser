import CellTypes from "../CellTypes";
import Position from "../Objects/Position";

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

const drawHorizontal = (wallPositions, colStart, colEnd, row) => {
    const gapPosition = getRandomOddNumber(colStart, colEnd);
    
    for(let i=colStart; i<=colEnd; i++) {
        if(i != gapPosition) wallPositions.push(Position(i, row));
    };
};

const drawVertical = (wallPositions, col, rowStart, rowEnd) => {
    const gapPosition = getRandomOddNumber(rowStart, rowEnd);

    for(let i=rowStart; i<=rowEnd ; i++) {
        if(i != gapPosition) wallPositions.push(Position(col, i));
    }
};

const recursiveDivision = (wallPositions, startCol, endCol, startRow, endRow) => {
    if(startCol >= endCol || startRow >= endRow || (endCol - startCol) < 2 || (endRow - startRow) < 2) {
        return;
    } 

    const isDrawingVertical = (endCol - startCol) > (endRow - startRow) ? true : false;
    
    if(isDrawingVertical) {
        const colToDrawWall = getRandomEvenNumber(startCol, endCol);
        drawVertical(wallPositions, colToDrawWall, startRow, endRow);

        // Call function recursively on sections which have been created by drawing wall
        recursiveDivision(wallPositions, startCol, colToDrawWall-1, startRow, endRow);
        recursiveDivision(wallPositions, colToDrawWall+1, endCol, startRow, endRow);
    }
    else {
        const rowToDrawWall = getRandomEvenNumber(startRow, endRow);
        drawHorizontal(wallPositions, startCol, endCol, rowToDrawWall);

        // Call function recursively on sections which have been created by drawing wall
        recursiveDivision(wallPositions, startCol, endCol, startRow, rowToDrawWall-1);
        recursiveDivision(wallPositions, startCol, endCol, rowToDrawWall+1, endRow,);
    }
};

export {recursiveDivision};