import { getNeighbours } from "./util";

const bfs = (grid, startNode, goalNode) => {
    const queue = [startNode];
    const explored = new Map();
    
    explored.set(startNode.getKey(), undefined);
    let curr = undefined, prev = undefined;

    while (explored.size > 0) {
        prev = curr;
        curr = queue.shift();

        if(curr.col === goalNode.col && curr.row === goalNode.row) {
            return explored;
        }
        for(let neighbour of getNeighbours(grid, curr)) {
            if(neighbour !== undefined && !explored.has(neighbour.getKey())) {
                queue.push(neighbour);
                explored.set(neighbour.getKey(), curr.getKey());
            }
        }
    }

    return undefined;
}

export default bfs;