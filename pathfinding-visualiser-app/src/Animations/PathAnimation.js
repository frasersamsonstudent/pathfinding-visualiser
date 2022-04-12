import CellTypes from "../CellTypes";

const getGrowAnimation = (duration, delay) => `grow ${duration}s linear ${delay}s 1`;

const getGrowWithGradientAnimationForEmptyCell = (duration, delay) => {
    return `growAndChangeColourForEmptyCell ${duration}s linear ${delay}s 1 normal forwards`;
}

const getGrowWithGradientAnimationForPathCell = (duration, delay) => {
    return `growAndChangeColourForPathCell ${duration}s linear ${delay}s 1 normal forwards`;
}

const getBlinkAnimation = (duration, delay) => `blink ${duration}s linear ${delay}s`;

export {getGrowAnimation, getGrowWithGradientAnimationForEmptyCell, getGrowWithGradientAnimationForPathCell, getBlinkAnimation};