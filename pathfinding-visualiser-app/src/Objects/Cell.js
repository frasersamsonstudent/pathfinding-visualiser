class Cell {
    constructor(col, row, value) {
        this.value = value;
        this.col = col;
        this.row = row;
        this.isInPath = false;
    }

    getKey() {
        return [this.col,this.row].toString();
    }
}

export default Cell;