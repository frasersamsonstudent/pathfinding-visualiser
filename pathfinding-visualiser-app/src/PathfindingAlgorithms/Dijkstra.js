import { getNeighbours } from "./util";
import {MinPriorityQueue} from '@datastructures-js/priority-queue';
import { weightValue } from "../Objects/Cell";

const dijkstra = (grid, startNode, goalNode) => {
    const queue = new MinPriorityQueue(node => node.distance);
    queue.enqueue({node: startNode, distance: 0})
    const exploredPositions = new Map();
    
    exploredPositions.set(startNode.getKey(), undefined);
    let curr = undefined, prev = undefined, distanceToCurr = 0;

    while (queue.size() > 0) {
        prev = curr;

        const nextQueueElement = queue.dequeue();
        curr = nextQueueElement.node; 
        distanceToCurr = nextQueueElement.distance;

        if(curr.col === goalNode.col && curr.row === goalNode.row) {
            return exploredPositions;
        }
        for(let neighbour of getNeighbours(grid, curr)) {
            if(neighbour !== undefined && !exploredPositions.has(neighbour.getKey())) {
                const distanceFromCurrToNeighbour = curr.isWeighted ? weightValue : 1;
                queue.enqueue({node: neighbour, distance: distanceToCurr + distanceFromCurrToNeighbour});
                exploredPositions.set(neighbour.getKey(), curr.getKey());
            }
        }
    }

    return exploredPositions;
}

export default dijkstra;