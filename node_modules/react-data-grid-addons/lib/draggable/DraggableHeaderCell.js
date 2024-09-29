import { __extends } from "tslib";
import { DragSource } from 'react-dnd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragItemTypes } from 'react-data-grid';
var DraggableHeaderCell = /** @class */ (function (_super) {
    __extends(DraggableHeaderCell, _super);
    function DraggableHeaderCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraggableHeaderCell.prototype.componentDidMount = function () {
        var connectDragPreview = this.props.connectDragPreview;
        var img = new Image();
        img.src = './assets/images/drag_column_full.png';
        img.onload = function () { return connectDragPreview(img); };
    };
    DraggableHeaderCell.prototype.render = function () {
        var _a = this.props, connectDragSource = _a.connectDragSource, isDragging = _a.isDragging;
        if (isDragging) {
            return null;
        }
        return connectDragSource(React.createElement("div", { className: "rdg-draggable-header-cell" }, this.props.children));
    };
    DraggableHeaderCell.propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        children: PropTypes.element.isRequired
    };
    return DraggableHeaderCell;
}(Component));
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
    };
}
var headerCellSource = {
    beginDrag: function (props) {
        return props.column;
    },
    endDrag: function (props) {
        return props.column;
    }
};
export default DragSource(DragItemTypes.Column, headerCellSource, collect)(DraggableHeaderCell);
//# sourceMappingURL=DraggableHeaderCell.js.map