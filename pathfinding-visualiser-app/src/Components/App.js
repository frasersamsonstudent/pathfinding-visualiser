import React from 'react';
import PathfindingVisualiser from "./PathfindingVisualiser";
import BFS from '../PathfindingAlgorithms/BFS';
import { outputNodesInExplored } from '../PathfindingAlgorithms/util';

const Row = (props) => {
    return props.row.map((cell) => <span>{cell}</span>)
}

export default () => {
    const grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const explored = BFS(grid, [3,3], [0, 0], [2, 1]);
    outputNodesInExplored(explored);

    let node = [2, 1];
    node = explored.get(node.toString());
    console.log(node);

    return <div>
        
            {//<PathfindingVisualiser />
            }
        <h2>Footer</h2>
    </div>
};