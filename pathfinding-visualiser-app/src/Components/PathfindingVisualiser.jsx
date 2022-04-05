import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './PathfindingVisualiser.css';
import CellTypes from '../CellTypes';
import GridCell from './GridCell';
import {Cell, copyCell, copyCellAndSetNewValue} from '../Objects/Cell.js';
import bfs from '../PathfindingAlgorithms/BFS';
import { getNeighbours, getPathFromExplored, isInBounds, isNodeStartOrEnd } from '../PathfindingAlgorithms/util';
import { getBlinkAnimation, getGrowAnimation } from '../Animations/PathAnimation';

const PathfindingVisualiser = React.memo(() => {
    const [grid, setGrid] = useState([]);
    const [gridDimensions, setGridDimensions] = useState([]);
    const [startNode, setStartNode] = useState(new Cell(0, 0, CellTypes.start));
    const [endNode, setEndNode] = useState(new Cell(1, 1, CellTypes.end));
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [movingNodeType, setMovingNodeType] = useState(undefined);

    useEffect(() => {
        setGridDimensions([Math.max(2, Math.floor(window.innerWidth/80)), Math.max(2, Math.floor(window.innerWidth/80))]);
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
        setMovingNodeType(undefined);
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

    const handleMouseOver = (x, y) => {
        if(isMouseDown) {
            // Check if currently moving a node
            if(movingNodeType !== undefined) {
                if(movingNodeType === CellTypes.start) {
                    moveNode(startNode, x, y, setStartNode);
                }
                else if(movingNodeType === CellTypes.end) {
                    moveNode(endNode, x, y, setEndNode);
                };
            }

            else {
                const cellType = grid[y][x].value;
                console.log("CELL TYPE: ", cellType);

                if(cellType === CellTypes.empty) {
                    updateGridCellAtIndex(x, y, CellTypes.wall);
                }
                else if(cellType === CellTypes.wall) {
                    updateGridCellAtIndex(x, y, CellTypes.empty);
                }
                else if(cellType === CellTypes.start) {
                    setMovingNodeType(CellTypes.startNode);
                }
                else if(cellType === CellTypes.end) {
                    setMovingNodeType(CellTypes.endNode);
                };
            }     
        };
    };

    const handleMouseDownOnCell = (col, row) => {
        const cellTypeAtPos = grid[row][col].value;

        if(cellTypeAtPos === CellTypes.start) {
            setMovingNodeType(CellTypes.start);
        }
        else if(cellTypeAtPos === CellTypes.end) {
            setMovingNodeType(CellTypes.end);
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

    const markNodesAsPartOfPath = (pathPositions) => {
        pathPositions.reverse();
        const newGrid = [...grid];

        pathPositions.forEach(([col, row], indexInPath) => {
            newGrid[row][col].isInPath = true;
            newGrid[row][col].animation = getGrowAnimation(0.5, 0.15 * indexInPath);
        });

        setGrid(newGrid);
    };

    const moveNode = (nodeToMove, newCol, newRow) => {
        console.log("node moving: ", nodeToMove)
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

    return (
        <div className='pathfindingVisualiser'>
            <div className='header'><h1>Header</h1></div>
                <button 
                    onClick={() => {
                        const explored = bfs(grid, startNode, endNode);
                        const path = getPathFromExplored(explored, endNode);
                        markNodesAsPartOfPath(path);
                }}>
                    BFS
                </button>
                <button
                    onClick={() => {
                        moveNode(startNode, 3, 3, setStartNode);
                        console.log(grid);
                    }}
                >
                    Move start to (3, 3)
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
                                    columnIndex={columnIndex} 
                                    rowIndex={rowIndex} 
                                    cellValue={cell.value} 
                                    handleMouseOver={() => handleMouseOver(columnIndex, rowIndex)} 
                                    handleGridItemClicked={() => handleGridItemClicked(columnIndex, rowIndex)} 
                                    handleMouseDown = {() => handleMouseDownOnCell(columnIndex, rowIndex)}
                                    isInPath = {cell.isInPath}
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

const compare1dArr = (arr1, arr2) => {
    if(arr1.length !== arr2.length) {return false;}
    for(let i=0;i<arr1.length;i++) {
        if(arr1[i] !== arr2[i]) {return false;}
    }
    return true
}

const compare2dArr = (arr1, arr2) => {
    if(!(arr1 && arr2)) {return false;}
    if(arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) {return false;}
    return true;
};

export default PathfindingVisualiser;