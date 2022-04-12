import React from 'react';
import { useMemo } from 'react';
import CellTypes from '../CellTypes';
import './GridCell.css'

const Cell = ({cell, handleMouseOver, handleGridItemClicked, handleMouseDown, isInPath, isInExplored, animation}) => {
    const cellClass = `${Object.keys(CellTypes)[cell.value]}Cell `;
    const pathClass = isInPath ? ' path ' : ''; 
    const exploredClass = !isInPath && isInExplored ? ' explored ' : '';

    return (
        <span    
            className={'gridItem ' + cellClass + pathClass + exploredClass}        
        
            onClick = {() => handleGridItemClicked()}       
            onMouseOver = {() => handleMouseOver()}    
            onMouseDown = {() => handleMouseDown()}
        />  
    );
}

export default React.memo(Cell);