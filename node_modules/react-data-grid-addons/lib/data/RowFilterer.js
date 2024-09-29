var filterRows = function (filters, rows) {
    if (rows === void 0) { rows = []; }
    return rows.filter(function (r) {
        var include = true;
        for (var columnKey in filters) {
            if (filters.hasOwnProperty(columnKey)) {
                var colFilter = filters[columnKey];
                // check if custom filter function exists
                if (colFilter.filterValues && typeof colFilter.filterValues === 'function') {
                    include &= colFilter.filterValues(r, colFilter, columnKey);
                }
                else if (typeof colFilter.filterTerm === 'string') {
                    // default filter action
                    var rowValue = r[columnKey];
                    if (rowValue !== undefined && rowValue !== null) {
                        if (rowValue.toString().toLowerCase().indexOf(colFilter.filterTerm.toLowerCase()) === -1) {
                            include &= false;
                        }
                    }
                    else {
                        include &= false;
                    }
                }
            }
        }
        return Boolean(include);
    });
};
export default filterRows;
//# sourceMappingURL=RowFilterer.js.map