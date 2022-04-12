import { getNeighbours } from "./util";

const bfs = (grid, startNode, goalNode) => {
    const queue = [startNode];
    const exploredPositions = new Map();
    
    exploredPositions.set(startNode.getKey(), undefined);
    let curr = undefined, prev = undefined;

    while (queue.length > 0) {
        prev = curr;
        curr = queue.shift();

        if(curr.col === goalNode.col && curr.row === goalNode.row) {
            return exploredPositions;
        }
        for(let neighbour of getNeighbours(grid, curr)) {
            if(neighbour !== undefined && !exploredPositions.has(neighbour.getKey())) {
                queue.push(neighbour);
                exploredPositions.set(neighbour.getKey(), curr.getKey());
            }
        }
    }

    return undefined;
}

export default bfs;