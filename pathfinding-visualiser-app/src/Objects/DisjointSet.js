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

    const unionOfSets = new Set();

    set1.forEach((value) => unionOfSets.add(value));
    set2.forEach((value) => unionOfSets.add(value));

    unionOfSets.forEach(setElement => {
        mapOfSets.set(setElement, unionOfSets);
    })

}

export {DisjointSet, union}