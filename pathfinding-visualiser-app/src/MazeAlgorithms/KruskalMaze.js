import {DisjointSet, union} from "../Objects/DisjointSet";

const inBounds = (grid, col, row) => {
    return col >= 0 && col < grid[0].length && row >= 0 && row < grid.length;
}

const getJoiningCellValue = (value1, value2) => {
    return value1 > value2 ? value1-1 : value2-1
};

const joinCells = (grid, listOfWalls, colStart, colEnd, rowStart, rowEnd) => {
    // Make both cells walls
    listOfWalls.push(grid[rowStart][colStart]);
    listOfWalls.push(grid[rowEnd][colEnd]);

    // Make cell between the two cells a wall]
    if(rowStart === rowEnd) {
        listOfWalls.push(grid[rowStart][getJoiningCellValue(colStart, colEnd)]);
    }
    else {
        listOfWalls.push(grid[getJoiningCellValue(rowStart, rowEnd)][colStart]);
    }

}

const getListOfNodesForAlgorithm = grid => {
    const positions = [];

    // Only return cells at odd positions, within bounds of an outer wall
    for(let row = 1; row < grid.length; row += 2) {
        for(let col = 1; col < grid[0].length; col += 2) {
            positions.push(grid[row][col]);
        }
    }

    return positions;
}

const getSubsequentNeighbours = (grid, col, row) => {
    let neighbours = [[col, row+2], [col+2, row]];

    neighbours = neighbours.filter(
        ([col, row]) => inBounds(grid, col, row)
    );

    return neighbours.map((neighbourAsArr) => grid[neighbourAsArr[1]][neighbourAsArr[0]]);
}

const getAllEdges = (grid, nodesForAlgorithm) => {
    const edges = [];

    nodesForAlgorithm.forEach(({col, row}) => {
        const subsequentNeighbours = getSubsequentNeighbours(grid, col, row);
                subsequentNeighbours.forEach(neighbour => {
                    edges.push([grid[row][col], neighbour]);
                })
    });

    return edges;
}

const kruskalMaze = (listOfNodesToClear, grid) => {
    // Create map of each node to a set of nodes which it is connected to 
    const allNodes = getListOfNodesForAlgorithm(grid);;
    const disjointSet = new Map(allNodes.map(
        (value) => [value, new Set([value])]
    ));

    // Create a set of all edges
    const setOfEdges = new Set(getAllEdges(grid, allNodes));

    // Pop edges from set and join if they contain disjoint nodes
    while(setOfEdges.size > 0) {
        const randomEdge = getRandomElementOfSet(setOfEdges);
        setOfEdges.delete(randomEdge);

        const [firstNode, secondNode] = randomEdge;
        if(!disjointSet.get(firstNode).has(secondNode)) {
            union(disjointSet, firstNode, secondNode);
            joinCells(grid, listOfNodesToClear, firstNode.col, secondNode.col, firstNode.row, secondNode.row);
        }
    }
}

const getRandomElementOfSet = set => {
    return [...set][Math.floor(Math.random() * set.size)];
};

export {kruskalMaze};

/* 
Generation is done wrong for grid. How to generate for a grid:
    Throw all of the edges into a big set.

    While there is an edge of being handled in the set:
    1. Pull out one edge at random.
    2. If the edge connects two disjoint subsets:
        a. Connect cells.
        b. Join the subsets.
*/