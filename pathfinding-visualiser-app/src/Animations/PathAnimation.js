const getGrowAnimation = (duration, delay) => `grow ${duration}s linear ${delay}s`;
const getGrowWithGradientAnimation = (duration, delay) => `growAndChangeColour ${duration}s linear ${delay}s`;
const getBlinkAnimation = (duration, delay) => `blink ${duration}s linear ${delay}s`;

export {getGrowAnimation, getGrowWithGradientAnimation, getBlinkAnimation};