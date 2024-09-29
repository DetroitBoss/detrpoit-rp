import { __extends } from "tslib";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import html5DragDropContext from '../shared/html5DragDropContext';
import DraggableHeaderCell from './DraggableHeaderCell';
import RowDragLayer from './RowDragLayer';
var DraggableContainer = /** @class */ (function (_super) {
    __extends(DraggableContainer, _super);
    function DraggableContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraggableContainer.prototype.getRows = function (rowsCount, rowGetter) {
        var rows = [];
        for (var j = 0; j < rowsCount; j++) {
            rows.push(rowGetter(j));
        }
        return rows;
    };
    DraggableContainer.prototype.renderGrid = function () {
        return React.cloneElement(React.Children.only(this.props.children), {
            draggableHeaderCell: DraggableHeaderCell
        });
    };
    DraggableContainer.prototype.render = function () {
        var grid = this.renderGrid();
        var rowGetter = this.props.getDragPreviewRow || grid.props.rowGetter;
        var _a = grid.props, rowsCount = _a.rowsCount, columns = _a.columns;
        var rows = this.getRows(rowsCount, rowGetter);
        return (React.createElement("div", null,
            grid,
            React.createElement(RowDragLayer, { selectedRows: grid.props.selectedRows, rows: rows, columns: columns })));
    };
    DraggableContainer.propTypes = {
        children: PropTypes.element.isRequired,
        getDragPreviewRow: PropTypes.func
    };
    return DraggableContainer;
}(Component));
export default html5DragDropContext(DraggableContainer);
//# sourceMappingURL=DragDropContainer.js.map