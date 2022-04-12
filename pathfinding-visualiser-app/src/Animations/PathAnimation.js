import CellTypes from "../CellTypes";

const getGrowAnimation = (duration, delay) => `grow ${duration}s linear ${delay}s 1`;
const getGrowWithGradientAnimation = (duration, delay, cell) => {
    if(cell.isInPath) {
        return `growAndChangeColourForPathCell ${duration}s linear ${delay}s 1 normal forwards`;
    }
    else {
        return `growAndChangeColourForEmptyCell ${duration}s linear ${delay}s 1 normal forwards`;
    }
}
const getBlinkAnimation = (duration, delay) => `blink ${duration}s linear ${delay}s`;

export {getGrowAnimation, getGrowWithGradientAnimation, getBlinkAnimation};