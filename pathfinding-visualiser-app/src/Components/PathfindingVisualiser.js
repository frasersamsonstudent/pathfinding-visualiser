import React from 'react';
import {useState, useEffect, useRef} from 'react';
import './PathfindingVisualiser.css';
import CellTypes from '../CellTypes';
import GridCell from './GridCell';





const PathfindingVisualiser = React.memo(() => {
    const [grid, setGrid] = useState([]);
    const [gridDimensions, setGridDimensions] = useState([]);
    const [startPoint, setStartPoint] = useState([0, 0]);
    const [endPoint, setEndPoint] = useState([6, 3]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseInGrid, setIsMouseInGrid] = useState(false);

    /*
    800 high
    20 px each
    40
    */
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

        for(let i=0;i<gridDimensions[1];i++) {
            newGrid.push([]);
            for(let j=0;j<gridDimensions[0];j++) {
                newGrid[i][j] = CellTypes.empty;
            }
        }

        if(startPoint[0] >= 0 && startPoint[0] < gridDimensions[0]) 
            newGrid[startPoint[1]][startPoint[0]] = CellTypes.start;
        if(endPoint[0] >= 0 && endPoint[0] < gridDimensions[0])
            newGrid[endPoint[1]][endPoint[0]] = CellTypes.end;

        return newGrid
    };

    const handleGridItemClicked = (col, row) => {
        if(grid[row][col] === CellTypes.wall) {
            updateGridCellAtIndex(col, row, CellTypes.empty);
        }
        else if(grid[row][col] === CellTypes.empty) {
            updateGridCellAtIndex(col, row, CellTypes.wall);
        }
    }

    const handleMouseOver = (x, y) => {
        if(isMouseDown) {
            if(grid[y][x] === CellTypes.empty) {
                updateGridCellAtIndex(x, y, CellTypes.wall);
            }
            else if(grid[y][x] === CellTypes.wall) {
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
                else {
                    return row.map((cell, colIndex) => {return colIndex === x ? newValue : cell})
                }
            })
        );
    }

    return (
        <div className='pathfindingVisualiser'>
            <div className='header'><h1>Header</h1></div>
                <button>BFS</button>
            <div 
                draggable='false' 
                className="gridContainer" 
                ondragStart='false'
                style={{'grid-template-columns': `repeat(${gridDimensions[0]}, 1fr)`, 'grid-template-rows': `repeat(${gridDimensions[1]}, 1fr)`}}>
                {
                    grid.map(
                        (row, rowIndex) => {
                            return row.map((cellValue, columnIndex) => {
                                return <GridCell 
                                    columnIndex={columnIndex} 
                                    rowIndex={rowIndex} 
                                    cellValue={cellValue} 
                                    handleMouseOver={() => handleMouseOver(columnIndex, rowIndex)} 
                                    handleGridItemClicked={() => handleGridItemClicked(columnIndex, rowIndex)} 
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