export var comparer = function (a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};
var sortRows = function (rows, sortColumn, sortDirection) {
    var sortDirectionSign = sortDirection === 'ASC' ? 1 : -1;
    var rowComparer = function (a, b) {
        return sortDirectionSign * comparer(a[sortColumn], b[sortColumn]);
    };
    if (sortDirection === 'NONE') {
        return rows;
    }
    return rows.slice().sort(rowComparer);
};
export default sortRows;
//# sourceMappingURL=RowSorter.js.map