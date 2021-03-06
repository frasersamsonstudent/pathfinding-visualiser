import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './PathfindingVisualiser.css';
import CellTypes from '../CellTypes';
import GridCell from './GridCell';
import {Cell, copyCell, copyCellAndSetNewValue, getColAndRowFromKey} from '../Objects/Cell.js';
import bfs from '../PathfindingAlgorithms/BFS';
import { getNeighbours, getPathFromExplored, isInBounds, isNodeStartOrEnd, drawOuterWallsAndAnimate } from '../PathfindingAlgorithms/util';
import { getBlinkAnimation, getGrowAnimation, getGrowWithGradientAnimationForEmptyCell, getGrowWithGradientAnimationForPathCell } from '../Animations/PathAnimation';
import Header from './Header';
import dijkstra from '../PathfindingAlgorithms/Dijkstra';
import { aStar } from '../PathfindingAlgorithms/Astar';
import {recursiveDivision} from '../MazeAlgorithms/RecursiveDivision';
import { kruskalMaze } from '../MazeAlgorithms/KruskalMaze';
import {primsAlgorithm} from '../MazeAlgorithms/PrimsAlgorithm';
import { recursiveBacktrackingMaze } from '../MazeAlgorithms/BacktrackingMaze';
import { pathfinding, maze } from '../enums';

const animationSpeed = 0.02;
const animationDuration = 0.06;
const wallDrawingSpeed = 0.02;
let isNodeUnderneathStartAWall = false;
let isNodeUnderneathEndAWall = false;
const minimumGridWidth = 7, minimumGridHeight = 7;

const PathfindingVisualiser = () => {
    const [grid, setGrid] = useState([]);
    const [gridDimensions, setGridDimensions] = useState([]);
    const [startNode, setStartNode] = useState(new Cell(0, 0, CellTypes.start));
    const [endNode, setEndNode] = useState(new Cell(1, 1, CellTypes.end));
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [placingNodeType, setPlacingNodeType] = useState(undefined);
    const [isVisualising, setIsVisualising] = useState(false);
    const [isGridSolved, setIsGridSolved] = useState(false);
    const [isPlacingWeightedNodes, setIsPlacingWeightedNodes] = useState(false);
    const [selectedPathfindingAlgorithm, setSelectedPathfindingAlgorithm] = useState(undefined);
    const [selectedMazeAlgorithm, setSelectedMazeAlgorithm] = useState(undefined);
    const cellRef = useRef([]);

    useEffect(() => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const numPixelsForCell = window.innerWidth > 2000 ? 70 : 45;

        // Calculate how many cells should be in x and y dimensions
        let numCellsInRow = Math.floor(windowWidth / numPixelsForCell), numCellsInCol = Math.floor(windowHeight / numPixelsForCell);
        if(numCellsInRow % 2 === 0) {
            numCellsInRow -= 1;
        }
        if(numCellsInCol % 2 === 0) {
            numCellsInCol -= 1;
        }

        // Check if width or height is less than minimum
        if(numCellsInRow < minimumGridWidth) {numCellsInRow = minimumGridWidth};
        if(numCellsInCol < minimumGridHeight) {numCellsInCol = minimumGridHeight};

        setGridDimensions([numCellsInRow, numCellsInCol]);
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
            cellRef.current = cellRef.current.slice(0, gridDimensions[0] * gridDimensions[1]);
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

    // Get a cell from a 1 dimensional array from a column and a row 
    const get1DPositionFromCoordinate = (col, row, numItemsInRow) => {
        return (row * numItemsInRow) + col;
    };

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
                let isWallAtNewPosition = grid[row][col].value === CellTypes.wall;

                if(placingNodeType === CellTypes.start) {
                    moveNode(startNode, col, row, setStartNode);
                    isNodeUnderneathStartAWall = isWallAtNewPosition;

                }
                else if(placingNodeType === CellTypes.end) {
                    moveNode(endNode, col, row, setEndNode);
                    isNodeUnderneathEndAWall = isWallAtNewPosition;
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
        exploredPositionsAsList.forEach((exploredPositionKey, index) => {
            if(exploredPositionKey !== undefined) {
                const [col, row] = getColAndRowFromKey(exploredPositionKey);

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
                
                let replacingCellValue = CellTypes.empty;
                if(nodeToMove.value === CellTypes.start && isNodeUnderneathStartAWall) replacingCellValue = CellTypes.wall;
                if(nodeToMove.value === CellTypes.end && isNodeUnderneathEndAWall) replacingCellValue = CellTypes.wall;

                newGrid[nodeToMove.row][nodeToMove.col] = copyCellAndSetNewValue(newGrid[nodeToMove.row][nodeToMove.col], replacingCellValue);
                
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

    const fillGridWithWalls = () => {
        const newGrid = grid.map(
            row => row.map(cell => {
                if(!isNodeStartOrEnd(grid, cell.col, cell.row))
                    cell.value = CellTypes.wall;
                return cell;
            })
        );

        setGrid(newGrid);
    }

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

    const createMazeWithDefaultArguments = () => {
        switch(selectedMazeAlgorithm) {
            case maze.BACKTRACKING:
                generateMaze(recursiveBacktrackingMaze, [grid], false, false);
                break;
            case maze.KRUSKAL:
                generateMaze(kruskalMaze, [grid], false, false);
                break;
            case maze.PRIMS:
                generateMaze(primsAlgorithm, [grid], false, false);
                break;
            case maze.DIVISION:
                generateMaze(recursiveDivision, [1, grid[0].length-2, 1, grid.length-2]);
                break;
        }
    };   

    const solveGridWithSelectedAlgorithm = () => {
        switch(selectedPathfindingAlgorithm) {
            case pathfinding.BFS:
                solveGrid(bfs);
                break;
            case pathfinding.DIJKSTRA: 
                solveGrid(dijkstra);
                break;
            case pathfinding.ASTAR:
                solveGrid(aStar);
                break;
        }
    };

    /** Generates a maze using a passed algorithm.
     * Draws outer walls and then maze within.
     * 
     * algorithmArgs - arguments to be passed to maze generation function (first passes wallsToDraw, and then args)
     */
    const generateMaze = async (algorithm, algorithmArgs, shouldDrawOuterWall = true, isDrawingWalls = true) => {
        if(isGridSolved) {
            removePathAndExploredFromGrid();
        }
        
        isDrawingWalls 
            ? clearGrid()
            : fillGridWithWalls();
            
        if(shouldDrawOuterWall) {
            await drawOuterWallsAndAnimate(grid, setGrid, setIsVisualising, animationSpeed);
        }

        const positionsToDraw = [];

        setIsVisualising(true);
        algorithm(positionsToDraw, ...algorithmArgs);
        drawCells(positionsToDraw, isDrawingWalls ? CellTypes.wall : CellTypes.empty);
    }
    
    const drawCells = (positionsToDrawWall, valueToDraw = CellTypes.wall) => {
        setIsVisualising(true);

        positionsToDrawWall.forEach((pos, index) => {
            if(!isNodeStartOrEnd(grid, pos.col, pos.row)) {
                setTimeout(() => {
                    const newGrid = [...grid];
                    newGrid[pos.row][pos.col].value = valueToDraw
                    setGrid(newGrid);
                }, index * wallDrawingSpeed * 1000);
            }
        });

        const totalAnimationTime = positionsToDrawWall.length * wallDrawingSpeed * 1000;
        setTimeout(() => setIsVisualising(false), totalAnimationTime);
    }

    return (
        <div className='pathfindingVisualiser'>
            <Header                 
                isSolving = {isVisualising}
                toggleWeighted = {() => togglePlacingWeighted()}
                isPathfindingDisabled = {isVisualising || selectedPathfindingAlgorithm === undefined}
                isMazeDisabled = {isVisualising || selectedMazeAlgorithm === undefined}
                pathfindingIDToName = {
                    { 
                        [pathfinding.BFS]: "Breadth First Search",
                        [pathfinding.DIJKSTRA]: "Dijkstra",
                        [pathfinding.ASTAR]: "A*"
                    }
                }
                mazeIDToName = {
                    {
                        [maze.DIVISION]: "Recursive Division", 
                        [maze.KRUSKAL]: "Kruskal",
                        [maze.PRIMS]: "Prims",
                        [maze.BACKTRACKING]: "Recursive Backtracking"
                    }
                }
                solveGrid = { () => solveGridWithSelectedAlgorithm() }
                createMaze = { () => createMazeWithDefaultArguments() }
                clearMaze = { () => clearGrid() }
                selectedPathfindingAlgorithm = {selectedPathfindingAlgorithm}
                selectedMazeAlgorithm = {selectedMazeAlgorithm}
                setSelectedPathfindingAlgorithm = { (algorithm) => setSelectedPathfindingAlgorithm(algorithm) }
                setSelectedMazeAlgorithm = { (algorithm) => setSelectedMazeAlgorithm(algorithm) }
                isVisualising = {isVisualising
                }
            />

            <button 
                onClick = {() => {
                    cellRef.current[0].className = "gridItem wallCell"; /* Update cells during animation by accessing ref, and then at end actually upgrade full grid potentially so correct props passed etc */
                }
            }>
                test button
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
                                    handleMouseDown = {() => handleMousePressedDownInCell(columnIndex, rowIndex)}
                                    isInPath = {cell.isInPath}
                                    isInExplored = {cell.isInExplored}
                                    isWeighted = {cell.isWeighted}
                                    cellRef = {
                                        element => cellRef.current[get1DPositionFromCoordinate(columnIndex, rowIndex, gridDimensions[0])] = element
                                    }
                                />
                            })
                        }
                    )
                }
            </div>    
        </div>

        
    );
    
};

export default PathfindingVisualiser;