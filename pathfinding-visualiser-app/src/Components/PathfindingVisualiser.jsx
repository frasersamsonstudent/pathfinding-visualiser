import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './PathfindingVisualiser.css';
import CellTypes from '../CellTypes';
import GridCell from './GridCell';
import {Cell, copyCell, copyCellAndSetNewValue} from '../Objects/Cell.js';
import bfs from '../PathfindingAlgorithms/BFS';
import { getNeighbours, getPathFromExplored, isInBounds, isNodeStartOrEnd, drawOuterWalls } from '../PathfindingAlgorithms/util';
import { getBlinkAnimation, getGrowAnimation, getGrowWithGradientAnimationForEmptyCell, getGrowWithGradientAnimationForPathCell } from '../Animations/PathAnimation';
import Header from './Header';
import dijkstra from '../PathfindingAlgorithms/Dijkstra';
import { aStar } from '../PathfindingAlgorithms/Astar';
import {recursiveDivision} from '../MazeAlgorithms/RecursiveDivision';


const animationSpeed = 0.02;
const animationDuration = 0.06;

const PathfindingVisualiser = React.memo(() => {
    const [grid, setGrid] = useState([]);
    const [gridDimensions, setGridDimensions] = useState([]);
    const [startNode, setStartNode] = useState(new Cell(0, 0, CellTypes.start));
    const [endNode, setEndNode] = useState(new Cell(1, 1, CellTypes.end));
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [placingNodeType, setPlacingNodeType] = useState(undefined);
    const [isVisualising, setIsVisualising] = useState(false);
    const [isGridSolved, setIsGridSolved] = useState(false);
    const [isPlacingWeightedNodes, setIsPlacingWeightedNodes] = useState(false);


    useEffect(() => {
        //setGridDimensions([Math.max(2, Math.floor(window.innerWidth/80)), Math.max(2, Math.floor(window.innerWidth/80))]);
        setGridDimensions([25, 25])
    }, []);

    useEffect(() => {
        window.addEventListener('mousedown', e => handleMouseDownWindowEvent());
        window.addEventListener('mouseup', e => handleMouseUpWindowEvent());
        
        return () => {
            window.removeEventListener('mousedown', () => setIsMouseDown(true));
            window.removeEventListener('mouseup', () => setIsMouseDown(false));
        };
    }, []);
    
    // Create new grid when dimensions change
    useEffect(() => {
            setGrid(createGrid());
        }, [gridDimensions]
    );

    // Remove path and explored nodes when isSolved is set to false
    useEffect(
        () => {
            if(!isGridSolved) {
                removePathAndExploredFromGrid();
            };
        }, 
        [isGridSolved]
    );

    // Functions for handling the events in the window
    const handleMouseDownWindowEvent = () => {
        setIsMouseDown(true);
    };
    const handleMouseUpWindowEvent = () => {
        setIsMouseDown(false);
        setPlacingNodeType(undefined);
    }

    const createGrid = () => {
        const newGrid = [];

        for(let row=0;row<gridDimensions[1];row++) {
            newGrid.push([]);
            for(let col=0;col<gridDimensions[0];col++) {
                let cell = new Cell(col, row, CellTypes.empty);
                newGrid[row].push(cell);
            }
        }

        // Set start and end nodes in grid
        if(startNode.col >= 0 && startNode.col < gridDimensions[0] && startNode.row >= 0 && startNode.row < gridDimensions[1]) {
            newGrid[startNode.row][startNode.col].value = CellTypes.start;
        };
        if(endNode.col >= 0 && endNode.col < gridDimensions[0] && endNode.row >= 0 && endNode.row < gridDimensions[1]) {
            newGrid[endNode.row][endNode.col].value = CellTypes.end;
        };

        return newGrid
    };

    /** Used to handle the event of mouse being over cell
     * 
     * @param {int} col column of cell mouse is in 
     * @param {int} row row of cell mouse is in
     * 
     */
    const handleMouseOverCell = (col, row) => {
        if(isMouseDown) {
            handleMouseEnteringCellWhileDown(col, row);
        };
    };

    /** Handles the event of mouse being held down whilst in a cell
     * Will either replace an empty node with a wall, a wall with an empty node, or begin placing start/end node
     * @param {*} col 
     * @param {*} row 
     */
    const handleMouseEnteringCellWhileDown = (col, row) => {
        const isMovingStartOrEndNode = placingNodeType !== undefined;
        const cellTypeAtPos = grid[row][col].value;

        // Clear explored nodes from grid
        if(isGridSolved) {
            setIsGridSolved(false);
        };

        if(!isVisualising) {
            if(isMovingStartOrEndNode) {
                if(placingNodeType === CellTypes.start) {
                    moveNode(startNode, col, row, setStartNode);
                }
                else if(placingNodeType === CellTypes.end) {
                    moveNode(endNode, col, row, setEndNode);
                };
                
            }

            else if(isPlacingWeightedNodes && cellTypeAtPos === CellTypes.empty) {
                toggleWeight(col, row);
            }
    
            else {     
                if(cellTypeAtPos === CellTypes.empty) {
                    updateGridCellAtIndex(col, row, CellTypes.wall);
                }
                else if(cellTypeAtPos === CellTypes.wall) {
                    updateGridCellAtIndex(col, row, CellTypes.empty);
                }
                else if(cellTypeAtPos === CellTypes.start) {
                    setPlacingNodeType(CellTypes.startNode);
                }
                else if(cellTypeAtPos === CellTypes.end) {
                    setPlacingNodeType(CellTypes.endNode);
                };
            };
        }
    }

    const handleMousePressedDownInCell = (col, row) => {
        const cellTypeAtPos = grid[row][col].value;

        if(!isVisualising) {
            if(grid[row][col].value === CellTypes.wall) {
                updateGridCellAtIndex(col, row, CellTypes.empty);
            }
            else if(grid[row][col].value === CellTypes.empty) {
                if(isPlacingWeightedNodes) {
                    toggleWeight(col, row);
                }
                else {
                    updateGridCellAtIndex(col, row, CellTypes.wall);
                }
            }
            else if(cellTypeAtPos === CellTypes.start) {
                setPlacingNodeType(CellTypes.start);
            }
            else if(cellTypeAtPos === CellTypes.end) {
                setPlacingNodeType(CellTypes.end);
            }
            
        }
        
    }

    const updateGridCellAtIndex = (x, y, newValue) => {
        if(isGridSolved) { setIsGridSolved(false) };

        setGrid(
            grid.map((row, rowIndex) => {
                if(rowIndex !== y) {
                    return row.map(cell => cell)
                }
                return row.map((cell, colIndex) => {
                    if(colIndex === x) {
                        cell.value = newValue;
                    }
                    return cell;
                });
            })
        );
    }

    const animateGrid = (exploredPositionsMap, path) => {
        const exploredPositionsAsList = [...exploredPositionsMap.keys()];

        setAnimationForExploredCells(exploredPositionsAsList);
        if(path) {
            // After other cells will have finished animation, draw path
            setTimeout(() => markNodesAsPartOfPath(path), (exploredPositionsAsList.length*animationSpeed*1000) + animationDuration*1000);
        }
        else {
            // If path does not exist, then update isVisualising after animation is set for explored cells
            setTimeout(() => setIsVisualising(false), animationSpeed * exploredPositionsAsList.length * 1000);
        }
    }

    const markNodesAsPartOfPath = (pathPositions) => {
        pathPositions.reverse();

        pathPositions.forEach(([col, row], indexInPath) => {
            if(grid[row][col] !== undefined && !isNodeStartOrEnd(grid, col, row)) {                
                setTimeout(
                    () => {
                        const newGrid = [...grid];
                        newGrid[row][col].isInPath = true;
                        setGrid(newGrid);
                    }, 
                    indexInPath * animationSpeed * 1000
                )
            }
        });

        setTimeout(() => setIsVisualising(false), pathPositions.length * animationSpeed * 1000);
    };

    const setAnimationForExploredCells = (exploredPositionsAsList) => {
        exploredPositionsAsList.forEach((e, index) => {
            if(e !== undefined) {
                const col = e.split(',')[0], row = e.split(',')[1];

                if(!isNodeStartOrEnd(grid, col, row)) {
                    setTimeout(
                        () => {
                            const newGrid = [...grid];
                            newGrid[row][col].isInExplored = true;
                            setGrid(newGrid);
                        }, animationSpeed * index * 1000);
                };
            }
        });        
    }

    const moveNode = (nodeToMove, newCol, newRow) => {
        if(isGridSolved) {
            setIsGridSolved(false);
        };

        if(nodeToMove && !(nodeToMove.col === newCol && nodeToMove.row === newRow)) {
            if(isInBounds(grid, newCol, newRow) && !isNodeStartOrEnd(grid, newCol, newRow)) {
                const newGrid = [...grid];

                newGrid[nodeToMove.row][nodeToMove.col] = copyCellAndSetNewValue(newGrid[nodeToMove.row][nodeToMove.col], CellTypes.empty);
                
                // Place node at new position and update position values
                newGrid[newRow][newCol] = nodeToMove;
                nodeToMove.col = newCol;
                nodeToMove.row = newRow;

                setGrid(newGrid);
            }
        }
    };

    const solveGrid = (solveAlgorithm) => {
        setIsVisualising(true);
        if(isGridSolved) {
            removePathAndExploredFromGrid();
        }

        const exploredPositionsMap = solveAlgorithm(grid, startNode, endNode);
        const path = getPathFromExplored(exploredPositionsMap, endNode);
        
        animateGrid(exploredPositionsMap, path);

        setIsGridSolved(true);
    };

    /** Removes all path and explored nodes from grid, and optionally sets all cells to empty.
     * 
     */
     const clearGrid = (setToEmpty = true) => {
        if(!isVisualising) {
            const newGrid = [...grid];
            for(let i=0, rowCount = newGrid.length;i<rowCount;i++) {
                for(let j=0, colCount = newGrid[0].length;j<colCount;j++) {
                    if(setToEmpty) {
                        newGrid[i][j].value = CellTypes.empty;
                        newGrid[i][j].isWeighted = false;
                    };

                    newGrid[i][j].isInPath = false;
                    newGrid[i][j].isInExplored = false;
                }
            }

            if(setToEmpty) {
                newGrid[startNode.row][startNode.col].value = CellTypes.start;
                newGrid[endNode.row][endNode.col].value = CellTypes.end;
            }

            setGrid(newGrid);
        }
    };

    /** Set all cells to empty.
     * 
     */
    const resetGrid = () => {
        clearGrid(true);
    }

    const removePathAndExploredFromGrid = () => {
        clearGrid(false);
    }

    const toggleWeight = (col, row) => {
        const cellTypeAtPos = grid[row][col].value
        if(cellTypeAtPos !== CellTypes.start && cellTypeAtPos != CellTypes.end) {
            const newGrid = [...grid];
            newGrid[row][col].isWeighted = !newGrid[row][col].isWeighted;
            setGrid(newGrid);
        }
        
    }

    const togglePlacingWeighted = () => {
        if(placingNodeType === undefined) {
            setIsPlacingWeightedNodes(!isPlacingWeightedNodes);
        }
    }

    const generateMaze = (algorithm) => {
        clearGrid();
        drawOuterWalls(grid, setGrid, startNode, endNode);

        const newGrid = [...grid];
        const wallsToDraw = [];
        algorithm(wallsToDraw, 1, grid[0].length-2, 1, grid.length-2);

        wallsToDraw.forEach((pos) => {
            if(!isNodeStartOrEnd(grid, pos.col, pos.row)) {
                newGrid[pos.row][pos.col].value = CellTypes.wall;
            }
        });

        setGrid(newGrid);
    }

    return (
        <div className='pathfindingVisualiser'>
            <Header 
                titles = {['BFS', 'Reset', 'Remove explored', 'Toggle', 'Dijkstra', 'A Star', 'Outer walls', 'Recursive division']} 
                onClickFunctions = {
                    [
                        () => solveGrid(bfs),
                        () => resetGrid(),
                        () => removePathAndExploredFromGrid(),
                        () => togglePlacingWeighted(),
                        () => solveGrid(dijkstra),
                        () => solveGrid(aStar),
                        () => drawOuterWalls(grid, setGrid, startNode, endNode),
                        () => generateMaze(recursiveDivision)
                    ]
                } 
                isSolving = {isVisualising} 
            />

            <div 
                draggable='false' 
                className="gridContainer" 
                
                style={{'gridTemplateColumns': `repeat(${gridDimensions[0]}, 1fr)`, 'gridTemplateRows': `repeat(${gridDimensions[1]}, 1fr)`}}>
                {
                    grid.map(
                        (row, rowIndex) => {
                            return row.map((cell, columnIndex) => {
                                return <GridCell 
                                    key = {[columnIndex, rowIndex]}
                                    cell = {cell}
                                    handleMouseOver={() => handleMouseOverCell(columnIndex, rowIndex)} 
                                    handleMouseDown = {() => handleMousePressedDownInCell(columnIndex, rowIndex)}
                                    isInPath = {cell.isInPath}
                                    isInExplored = {cell.isInExplored}
                                    isWeighted = {cell.isWeighted}
                                />
                            })
                        }
                    )
                }
            </div>
        </div>
    )
    
}, (prev, curr) => {
    return true;
});

export default PathfindingVisualiser;