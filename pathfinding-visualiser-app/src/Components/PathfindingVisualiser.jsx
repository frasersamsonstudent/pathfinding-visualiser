import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './PathfindingVisualiser.css';
import CellTypes from '../CellTypes';
import GridCell from './GridCell';
import Cell from '../Objects/Cell.js';
import bfs from '../PathfindingAlgorithms/BFS';
import { getNeighbours, getPathFromExplored } from '../PathfindingAlgorithms/util';
import { getBlinkAnimation, getGrowAnimation } from '../Animations/PathAnimation';

const PathfindingVisualiser = React.memo(() => {
    const [grid, setGrid] = useState([]);
    const [gridDimensions, setGridDimensions] = useState([]);
    const [startNode, setStartNode] = useState(new Cell(0, 0, CellTypes.start));
    const [endNode, setEndNode] = useState(new Cell(3, 3, CellTypes.end));
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseInGrid, setIsMouseInGrid] = useState(false);

    useEffect(() => {
        setGridDimensions([Math.floor(window.innerWidth/80), Math.floor(window.innerWidth/80)]);
    }, []);

    useEffect(() => {
        window.addEventListener('mousedown', e => setIsMouseDown(true));
        window.addEventListener('mouseup', e => setIsMouseDown(false));
        
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
            if(grid[y][x].value === CellTypes.empty) {
                updateGridCellAtIndex(x, y, CellTypes.wall);
            }
            else if(grid[y][x].value === CellTypes.wall) {
                updateGridCellAtIndex(x, y, CellTypes.empty);
            };
        };
    };

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

        // Remove changes to start and end node
        

        setGrid(newGrid);
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