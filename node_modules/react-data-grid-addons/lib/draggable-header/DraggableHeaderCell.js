import { __extends } from "tslib";
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
var DraggableHeaderCell = /** @class */ (function (_super) {
    __extends(DraggableHeaderCell, _super);
    function DraggableHeaderCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraggableHeaderCell.prototype.render = function () {
        var _a = this.props, connectDragSource = _a.connectDragSource, connectDropTarget = _a.connectDropTarget, isDragging = _a.isDragging, isOver = _a.isOver, canDrop = _a.canDrop;
        // set drag source and drop target on header cell
        // width: 0 - otherwise drag clone was wrongly positioned
        return connectDragSource(connectDropTarget(React.createElement("div", { className: classNames('rdg-draggable-header-cell', { 'rdg-can-drop': isOver && canDrop }), style: { opacity: isDragging ? 0.2 : 1 } }, this.props.children)));
    };
    DraggableHeaderCell.propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        isOver: PropTypes.bool,
        canDrop: PropTypes.bool,
        children: PropTypes.element.isRequired
    };
    return DraggableHeaderCell;
}(React.Component));
// drop source
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}
var headerCellSource = {
    beginDrag: function (props) {
        return {
            // source column
            key: props.column.key
        };
    },
    endDrag: function (props, monitor) {
        // check if drop was made in droppable zone
        if (monitor.didDrop()) {
            var _a = monitor.getDropResult(), source = _a.source, target_1 = _a.target;
            return props.onHeaderDrop(source, target_1);
        }
    }
};
// drop target
var target = {
    drop: function (props, monitor) {
        var source = monitor.getItem().key;
        var targetKey = props.column.key;
        return {
            source: source,
            target: targetKey
        };
    }
};
function targetCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedHeader: monitor.getItem()
    };
}
export default DragSource('Column', headerCellSource, collect)(DropTarget('Column', target, targetCollect)(DraggableHeaderCell));
//# sourceMappingURL=DraggableHeaderCell.js.map