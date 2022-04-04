import { getNeighbours } from "./util";

const bfs = (grid, gridDimensions, startPos, goal) => {
    const queue = [];
    const explored = new Map();
    let prev = undefined, curr = undefined; 
    explored.set(startPos.toString(), undefined);

    queue.push(startPos);
    while(queue.length !== 0) {
        prev = curr;
        curr = queue.shift();

        if(curr === goal) {
            return explored;
        }

        // Add unvisited neighbours to queue 
        for(let neighbour of getNeighbours(grid, gridDimensions, curr)) {
            if(!explored.has(neighbour.toString())) {
              queue.push(neighbour);
              explored.set(neighbour.toString(), curr.toString());
            };
        }
    }

    return undefined;
}

export default bfs;