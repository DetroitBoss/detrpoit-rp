import React, { useCallback } from 'react';
import { Delete } from '@material-ui/icons';
export default function GroupedColumnButton(_a) {
    var name = _a.name, columnKey = _a.columnKey, onColumnGroupDeleted = _a.onColumnGroupDeleted;
    var onClick = useCallback(function () { return onColumnGroupDeleted(columnKey); }, [columnKey, onColumnGroupDeleted]);
    return (React.createElement("div", { className: "grouped-col-btn btn" },
        name,
        " ",
        React.createElement(Delete, { onClick: onClick })));
}
//# sourceMappingURL=GroupedColumnButton.js.map