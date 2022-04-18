import { getNeighbours } from "./util";
import {MinPriorityQueue} from '@datastructures-js/priority-queue';
import { weightValue } from "../Objects/Cell";

const heuristic = (curr, goalNode) => {
    return manhattanDistance(curr.col, curr.row, goalNode.col, goalNode.row);
};

const manhattanDistance = (startCol, startRow, endCol, endRow) => {
    return Math.abs(startCol-endCol) + Math.abs(startRow-endRow);
};

const aStar = (grid, startNode, goalNode) => {
    const queue = new MinPriorityQueue(node => node.fCost);
    queue.enqueue({node: startNode, fCost: heuristic(startNode, goalNode), distance: 0})
    const exploredPositions = new Map();
    
    exploredPositions.set(startNode.getKey(), undefined);
    let curr = undefined, prev = undefined, distanceToCurr = 0;

    while (queue.size() > 0) {
        prev = curr;
        
        const nextQueueElement = queue.dequeue();
        curr = nextQueueElement.node; 
        distanceToCurr = nextQueueElement.distance;
        console.log(curr)

        if(curr.col === goalNode.col && curr.row === goalNode.row) {
            return exploredPositions;
        }
        for(let neighbour of getNeighbours(grid, curr)) {
            if(neighbour !== undefined && !exploredPositions.has(neighbour.getKey())) {
                const distanceFromCurrToNeighbour = curr.isWeighted ? weightValue : 1;
                queue.enqueue({node: neighbour, distance: distanceToCurr + distanceFromCurrToNeighbour, fCost: distanceToCurr + heuristic(neighbour, goalNode)});
                exploredPositions.set(neighbour.getKey(), curr.getKey());
            }
        }
    }

    return exploredPositions;
};

export {aStar};