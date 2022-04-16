class Cell {
    constructor(col, row, value) {
        this.value = value;
        this.col = col;
        this.row = row;
        this.isInPath = false;
        this.isInExplored = false;
        this.isWeighted = false;
    }

    getKey() {
        return [this.col,this.row].toString();
    }
}

const copyCell = cell => {
    return new Cell(cell.col, cell.row, cell.value);
}

const copyCellAndSetNewValue = (cell, newValue) => {
    const cellCopy = copyCell(cell);
    cellCopy.value = newValue;
    return cellCopy;
};

export {Cell, copyCell, copyCellAndSetNewValue};