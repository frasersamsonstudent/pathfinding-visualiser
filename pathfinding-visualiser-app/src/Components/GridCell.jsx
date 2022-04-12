import React from 'react';
import { useMemo } from 'react';
import CellTypes from '../CellTypes';


const Cell = (props) => {
    const pathClass = props.isInPath ? 'path ' : '';
    const cellClass = `${Object.keys(CellTypes)[props.cellValue]}Cell`;
    const shouldApplyAnimation = (props.cellValue === CellTypes.empty || props.cellValue === CellTypes.path) && props.animation !== undefined;
    const animationStyle = shouldApplyAnimation ? props.animation : '';
    console.log(animationStyle);
    return (
        <span    
            style = {{animation: animationStyle}}
            draggable="false" 
            className={'gridItem ' + cellClass + ' ' + pathClass}                 
            onClick = {() => props.handleGridItemClicked()}       
            onMouseOver = {() => props.handleMouseOver()}    
            onMouseDown = {() => props.handleMouseDown()}
        />  
    );
}

export default React.memo(Cell);