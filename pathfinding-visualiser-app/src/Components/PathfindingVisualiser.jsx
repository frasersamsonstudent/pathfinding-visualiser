import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './PathfindingVisualiser.css';
import CellTypes from '../CellTypes';
import GridCell from './GridCell';
import {Cell, copyCell, copyCellAndSetNewValue} from '../Objects/Cell.js';
import bfs from '../PathfindingAlgorithms/BFS';
import { getNeighbours, getPathFromExplored, isInBounds, isNodeStartOrEnd, printGrid } from '../PathfindingAlgorithms/util';
import { getBlinkAnimation, getGrowAnimation, getGrowWithGradientAnimationForEmptyCell, getGrowWithGradientAnimationForPathCell } from '../Animations/PathAnimation';

const PathfindingVisualiser = React.memo(() => {
    const [grid, setGrid] = useState([]);
    const [gridDimensions, setGridDimensions] = useState([]);
    const [startNode, setStartNode] = useState(new Cell(0, 0, CellTypes.start));
    const [endNode, setEndNode] = useState(new Cell(1, 1, CellTypes.end));
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [placingNodeType, setPlacingNodeType] = useState(undefined);
    const animationSpeed = 0.1;
    const animationDuration = 0.5;

    useEffect(() => {
        //setGridDimensions([Math.max(2, Math.floor(window.innerWidth/80)), Math.max(2, Math.floor(window.innerWidth/80))]);
        setGridDimensions([10, 10])
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
        },
        [gridDimensions]
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

    const handleGridItemClicked = (col, row) => {
        if(grid[row][col].value === CellTypes.wall) {
            updateGridCellAtIndex(col, row, CellTypes.empty);
        }
        else if(grid[row][col].value === CellTypes.empty) {
            updateGridCellAtIndex(col, row, CellTypes.wall);
        }
    }

    /** Used to handle the event of mouse being over cell
     * 
     * @param {int} col column of cell mouse is in 
     * @param {int} row row of cell mouse is in
     * 
     */
    const handleMouseOverCell = (col, row) => {
        if(isMouseDown) {
            handleMouseOverAndDownInCell(col, row);
        };
    };

    /** Handles the event of mouse being held down whilst in a cell
     * Will either replace an empty node with a wall, a wall with an empty node, or begin placing start/end node
     * @param {*} col 
     * @param {*} row 
     */
    const handleMouseOverAndDownInCell = (col, row) => {
        const isMovingStartOrEndNode = placingNodeType !== undefined;

        if(isMovingStartOrEndNode) {
            if(placingNodeType === CellTypes.start) {
                moveNode(startNode, col, row, setStartNode);
            }
            else if(placingNodeType === CellTypes.end) {
                moveNode(endNode, col, row, setEndNode);
            };
            
        }

        else { 
            const cellTypeAtPos = grid[row][col].value;

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

    const handleMouseDownOnCell = (col, row) => {
        const cellTypeAtPos = grid[row][col].value;

        if(cellTypeAtPos === CellTypes.start) {
            setPlacingNodeType(CellTypes.start);
        }
        else if(cellTypeAtPos === CellTypes.end) {
            setPlacingNodeType(CellTypes.end);
        }
    }

    const updateGridCellAtIndex = (x, y, newValue) => {
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

    
    /* Functions for handling animation */
    const animateGrid = (exploredPositionsMap, path) => {
        const exploredPositionsAsList = [...exploredPositionsMap.keys()];

        setAnimationForExploredCells(exploredPositionsAsList);

        // After other cells will have finished animation, draw path
        setTimeout(() => markNodesAsPartOfPath(path), (exploredPositionsAsList.length*animationSpeed*1000) + animationDuration*1000);
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
        const exploredPositionsMap = solveAlgorithm(grid, startNode, endNode);

        if(exploredPositionsMap) {
            const path = getPathFromExplored(exploredPositionsMap, endNode);
            if(path) { animateGrid(exploredPositionsMap, path); }
        }
    };

    /** Clear the grid so all cells are empty
     * 
     */
     const resetGrid = () => {
        const newGrid = [...grid];
        for(let i=0, rowCount = newGrid.length;i<rowCount;i++) {
            for(let j=0, colCount = newGrid[0].length;j<colCount;j++) {
                newGrid[i][j].value = CellTypes.empty;
                newGrid[i][j].isInPath = false;
                newGrid[i][j].animation = undefined;
                newGrid[i][j].isInExplored = false;
            }
        }

        newGrid[startNode.row][startNode.col].value = CellTypes.start;
        newGrid[endNode.row][endNode.col].value = CellTypes.end;

        setGrid(newGrid);
    };


    return (
        <div className='pathfindingVisualiser'>
            <div className='header'><h1>Header</h1></div>
                <button 
                    onClick={() => {
                        solveGrid(bfs);
                }}>
                    BFS
                </button>

                <button onClick={() => resetGrid()}>
                    reset
                </button>

                <button 
                    onClick = {() => {
                        const neighbours = getNeighbours(grid, grid[2][2]);
                        console.log(neighbours);
                    }}
                >
                    test neighbours    
                </button>


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
                                    handleGridItemClicked={() => handleGridItemClicked(columnIndex, rowIndex)} 
                                    handleMouseDown = {() => handleMouseDownOnCell(columnIndex, rowIndex)}
                                    isInPath = {cell.isInPath}
                                    isInExplored = {cell.isInExplored}
                                    animation = {cell.animation}
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