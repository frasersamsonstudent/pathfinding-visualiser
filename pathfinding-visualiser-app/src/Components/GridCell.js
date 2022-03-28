import React from 'react';
import { useMemo } from 'react';
import CellTypes from '../CellTypes';


const Cell = (props) => {
    return (
        <span    
            draggable="false" 
            className={'gridItem ' + `${Object.keys(CellTypes)[props.cellValue]}Cell`}                 
            onMouseDown = {() => props.handleGridItemClicked()}       
            onMouseOver = {() => props.handleMouseOver()}    
        />  
    );
}

export default React.memo(Cell);