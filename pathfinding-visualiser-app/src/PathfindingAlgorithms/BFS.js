import { getNeighbours } from "./util";

export default (grid, gridDimensions, startPos, goal) => {
    const queue = [];
    const explored = new Map();
    let prev = undefined, curr = undefined; 

    queue.push(...getNeighbours(grid, gridDimensions, startPos));
    while(queue) {
        prev = curr;
        curr = queue.shift();

        // Add current node to explored
        explored.set(curr.toString(), prev === undefined ? undefined : prev.toString());
        console.log(prev === undefined ? undefined : prev.toString());

        if(curr[0] === goal[0] && curr[1] === goal[1]) {
            return explored;
        }

        // Add unvisited neighbours to queue 
        for(let neighbour of getNeighbours(grid, gridDimensions, curr)) {
            if(explored.get(neighbour.toString())) {
                console.log(neighbour);
                queue.push(neighbour);
            };
        }
       
    }
}
