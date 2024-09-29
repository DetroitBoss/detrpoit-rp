import { __read, __spread } from "tslib";
import groupBy from 'lodash/groupBy';
var RowGrouperResolver = /** @class */ (function () {
    function RowGrouperResolver() {
    }
    RowGrouperResolver.prototype.initRowsCollection = function () {
        return [];
    };
    RowGrouperResolver.prototype.getGroupedRows = function (rows, columnName) {
        return groupBy(rows, columnName);
    };
    RowGrouperResolver.prototype.getGroupKeys = function (groupedRows) {
        return Object.keys(groupedRows);
    };
    RowGrouperResolver.prototype.addHeaderRow = function (rowGroupHeader, dataviewRows) {
        return __spread(dataviewRows, [rowGroupHeader]);
    };
    return RowGrouperResolver;
}());
export default RowGrouperResolver;
//# sourceMappingURL=RowGrouperResolver.js.map