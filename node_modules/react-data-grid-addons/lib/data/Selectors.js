import { createSelector } from 'reselect';
import groupRows from './RowGrouper';
import filterRows from './RowFilterer';
import sortRows from './RowSorter';
import { isEmptyObject, isEmptyArray } from '../utils';
var getInputRows = function (state) { return state.rows; };
var getFilters = function (state) { return state.filters; };
var getFilteredRows = createSelector([getFilters, getInputRows], function (filters, rows) {
    if (rows === void 0) { rows = []; }
    if (!filters || isEmptyObject(filters)) {
        return rows;
    }
    return filterRows(filters, rows);
});
var getSortColumn = function (state) { return state.sortColumn; };
var getSortDirection = function (state) { return state.sortDirection; };
var getSortedRows = createSelector([getFilteredRows, getSortColumn, getSortDirection], function (rows, sortColumn, sortDirection) {
    if (!sortDirection && !sortColumn) {
        return rows;
    }
    return sortRows(rows, sortColumn, sortDirection);
});
var getGroupedColumns = function (state) { return state.groupBy; };
var getExpandedRows = function (state) { return state.expandedRows; };
var getFlattenedGroupedRows = createSelector([getSortedRows, getGroupedColumns, getExpandedRows], function (rows, groupedColumns, expandedRows) {
    if (expandedRows === void 0) { expandedRows = {}; }
    if (!groupedColumns || isEmptyObject(groupedColumns) || isEmptyArray(groupedColumns)) {
        return rows;
    }
    return groupRows(rows, groupedColumns, expandedRows);
});
var getSelectedKeys = function (state) { return state.selectedKeys; };
var getRowKey = function (state) { return state.rowKey; };
var getSelectedRowsByKey = createSelector([getRowKey, getSelectedKeys, getInputRows], function (rowKey, selectedKeys, rows) {
    if (rows === void 0) { rows = []; }
    return selectedKeys.map(function (k) {
        return rows.filter(function (r) {
            return r[rowKey] === k;
        })[0];
    });
});
export { getFlattenedGroupedRows as getRows, getSelectedRowsByKey };
//# sourceMappingURL=Selectors.js.map