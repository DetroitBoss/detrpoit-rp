import React from 'react';
export default function Toolbar(props) {
    function onAddRow() {
        props.onAddRow({ newRowIndex: props.numberOfRows });
    }
    return (React.createElement("div", { className: "react-grid-Toolbar" },
        React.createElement("div", { className: "tools" },
            props.onAddRow && (React.createElement("button", { type: "button", className: "btn", onClick: onAddRow }, props.addRowButtonText || 'Add Row')),
            props.enableFilter && (React.createElement("button", { type: "button", className: "btn", onClick: props.onToggleFilter }, props.filterRowsButtonText || 'Filter Rows')),
            props.children)));
}
//# sourceMappingURL=Toolbar.js.map