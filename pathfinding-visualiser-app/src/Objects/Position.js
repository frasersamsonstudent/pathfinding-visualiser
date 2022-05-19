const Position = (col, row) => {
    return {
        col: col,
        row: row
    }
}

const isPositionEqual = (pos1, pos2) => {
    return pos1.col === pos2.col && pos1.row === pos2.row;
}

export {isPositionEqual};
export default Position;