import React from 'react';
import { useMemo } from 'react';
import CellTypes from '../CellTypes';
import './GridCell.css'

const Cell = ({cell, handleMouseOver, handleGridItemClicked, handleMouseDown, animation}) => {
    const cellClass = `${Object.keys(CellTypes)[cell.value]}Cell`;
    
    return (
        <span    
            style = {
                animation !== undefined ? {animation: animation} : {}
            }
            className={'gridItem ' + cellClass }        

            onClick = {() => handleGridItemClicked()}       
            onMouseOver = {() => handleMouseOver()}    
            onMouseDown = {() => handleMouseDown()}
        />  
    );
}

export default React.memo(Cell);