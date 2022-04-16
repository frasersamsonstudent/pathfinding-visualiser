import React from 'react';
import { useMemo } from 'react';
import CellTypes from '../CellTypes';
import './GridCell.css'

const Cell = ({cell, handleMouseOver, handleMouseDown, isInPath, isInExplored, isWeighted}) => {
    const cellClass = `${Object.keys(CellTypes)[cell.value]}Cell `;
    const pathClass = isInPath ? ' path ' : ''; 
    const exploredClass = !isInPath && isInExplored ? ' explored ' : '';
    const weightedClass = cell.value === CellTypes.empty && isWeighted ? 'weighted ' : '';

    return (
        <span    
            className={'gridItem ' + cellClass + pathClass + exploredClass + weightedClass}        
        
            onMouseOver = {() => handleMouseOver()}    
            onMouseDown = {() => handleMouseDown()}
        />  
    );
}

export default React.memo(Cell);