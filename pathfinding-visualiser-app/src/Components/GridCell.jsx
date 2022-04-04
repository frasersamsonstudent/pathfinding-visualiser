import React from 'react';
import { useMemo } from 'react';
import CellTypes from '../CellTypes';


const Cell = (props) => {
    console.log(props.animation);
    // Check whether cell is part of the current path
    const pathClass = props.isInPath ? 'path ' : '';
    const cellClass = `${Object.keys(CellTypes)[props.cellValue]}Cell`;
    const animation = props.animation !== undefined ? props.animation : '';

    return (
        <span    
            style = {{animation: animation}}
            draggable="false" 
            className={'gridItem ' + cellClass + ' ' + pathClass}                 
            onMouseDown = {() => props.handleGridItemClicked()}       
            onMouseOver = {() => props.handleMouseOver()}    
        />  
    );
}

export default React.memo(Cell);