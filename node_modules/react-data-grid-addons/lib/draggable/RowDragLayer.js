import { __extends, __read, __spread } from "tslib";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
var layerStyles = {
    cursor: '-webkit-grabbing',
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
};
function getItemStyles(props) {
    var currentOffset = props.currentOffset;
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }
    var x = currentOffset.x, y = currentOffset.y;
    var transform = "translate(" + x + "px, " + y + "px)";
    return {
        transform: transform,
        WebkitTransform: transform
    };
}
var CustomDragLayer = /** @class */ (function (_super) {
    __extends(CustomDragLayer, _super);
    function CustomDragLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomDragLayer.prototype.getDraggedRows = function () {
        var draggedRows;
        var selectedRows = this.props.selectedRows;
        if (selectedRows && selectedRows.size > 0) {
            draggedRows = __spread(selectedRows);
        }
        else {
            draggedRows = [this.props.rows[this.props.item.idx]];
        }
        return draggedRows;
    };
    CustomDragLayer.prototype.renderDraggedRows = function () {
        var _this = this;
        var columns = this.props.columns;
        return this.getDraggedRows().map(function (r, i) {
            return React.createElement("tr", { key: "dragged-row-" + i }, _this.renderDraggedCells(r, i, columns));
        });
    };
    CustomDragLayer.prototype.renderDraggedCells = function (item, rowIdx, columns) {
        var cells = [];
        if (item != null) {
            columns.forEach(function (c) {
                if (item.hasOwnProperty(c.key)) {
                    if (c.formatter) {
                        var Formatter = c.formatter;
                        var dependentValues = typeof c.getRowMetaData === 'function' ? c.getRowMetaData(item, c) : {};
                        cells.push(React.createElement("td", { key: "dragged-cell-" + rowIdx + "-" + c.key, className: "rdg-cell", style: { padding: '5px' } },
                            React.createElement(Formatter, { dependentValues: dependentValues, value: item[c.key] })));
                    }
                    else {
                        cells.push(React.createElement("td", { key: "dragged-cell-" + rowIdx + "-" + c.key, className: "rdg-cell", style: { padding: '5px' } }, item[c.key]));
                    }
                }
            });
        }
        return cells;
    };
    CustomDragLayer.prototype.render = function () {
        var isDragging = this.props.isDragging;
        if (!isDragging) {
            return null;
        }
        var draggedRows = this.renderDraggedRows();
        return (React.createElement("div", { style: layerStyles, className: "rdg-dragging" },
            React.createElement("div", { style: getItemStyles(this.props), className: "rdg-dragging" },
                React.createElement("table", null,
                    React.createElement("tbody", null, draggedRows)))));
    };
    CustomDragLayer.propTypes = {
        item: PropTypes.object,
        itemType: PropTypes.string,
        currentOffset: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }),
        isDragging: PropTypes.bool.isRequired,
        selectedRows: PropTypes.object,
        rows: PropTypes.array.isRequired,
        columns: PropTypes.array.isRequired
    };
    return CustomDragLayer;
}(Component));
function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}
export default DragLayer(collect)(CustomDragLayer);
//# sourceMappingURL=RowDragLayer.js.map