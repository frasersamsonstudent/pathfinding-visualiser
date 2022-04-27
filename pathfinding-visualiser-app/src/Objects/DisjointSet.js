/** Implementation of disjoint sets, also known as union find, data structure.
 * Disjoint set is a data structure which holds a collection of non-overlapping sets.
 * 
 */
class DisjointSet {
    constructor(valuesToCreateSetsFrom) {
        // Create a map where key is an element, and value is the set containing that element
        this.mapOfSets = new Map(valuesToCreateSetsFrom.map(
            (value) => [value, new Set([value])]
        ));
    }
}

const union = (mapOfSets, value1, value2) => {
    const set1 = mapOfSets.get(value1);
    const set2 = mapOfSets.get(value2);
    
    if(set1 != set2) {
        unionOfSets = new Set([...set1, ...set2]);

        mapOfSets.set(value1, unionOfSets);
        mapOfSets.set(value2, unionOfSets);
    }
}

const isSameSet = (mapOfSets, value1, value2) => {
    return mapOfSets.get(value1).has(value2);
}

export {DisjointSet, union, isSameSet}