import { __assign, __extends } from "tslib";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragItemTypes } from 'react-data-grid';
import { DropTarget } from 'react-dnd';
import GroupedColumnButton from './GroupedColumnButton';
var GroupedColumnsPanel = /** @class */ (function (_super) {
    __extends(GroupedColumnsPanel, _super);
    function GroupedColumnsPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedColumnsPanel.prototype.getPanelInstructionMessage = function () {
        var groupBy = this.props.groupBy;
        return groupBy && groupBy.length > 0 ? this.props.panelDescription : this.props.noColumnsSelectedMessage;
    };
    GroupedColumnsPanel.prototype.renderGroupedColumns = function () {
        var _this = this;
        return this.props.groupBy.map(function (c) {
            var groupedColumnButtonProps = {
                columnKey: typeof c === 'string' ? c : c.key,
                name: typeof c === 'string' ? c : c.name,
                onColumnGroupDeleted: _this.props.onColumnGroupDeleted,
                key: typeof c === 'string' ? c : c.key
            };
            return React.createElement(GroupedColumnButton, __assign({}, groupedColumnButtonProps));
        });
    };
    GroupedColumnsPanel.prototype.renderOverlay = function (color) {
        return (React.createElement("div", { style: {
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.5,
                backgroundColor: color
            } }));
    };
    GroupedColumnsPanel.prototype.render = function () {
        var _a = this.props, connectDropTarget = _a.connectDropTarget, isOver = _a.isOver, canDrop = _a.canDrop;
        return connectDropTarget(React.createElement("div", { style: { padding: '2px', position: 'relative', margin: '-10px', display: 'inline-block', border: '1px solid #eee' } },
            this.renderGroupedColumns(),
            " ",
            React.createElement("span", null, this.getPanelInstructionMessage()),
            isOver && canDrop && this.renderOverlay('yellow'),
            !isOver && canDrop && this.renderOverlay('#DBECFA')));
    };
    GroupedColumnsPanel.propTypes = {
        isOver: PropTypes.bool.isRequired,
        connectDropTarget: PropTypes.func,
        canDrop: PropTypes.bool.isRequired,
        groupBy: PropTypes.array,
        noColumnsSelectedMessage: PropTypes.string,
        panelDescription: PropTypes.string,
        onColumnGroupDeleted: PropTypes.func
    };
    GroupedColumnsPanel.defaultProps = {
        noColumnsSelectedMessage: 'Drag a column header here to group by that column',
        panelDescription: 'Drag a column header here to group by that column'
    };
    return GroupedColumnsPanel;
}(Component));
var columnTarget = {
    drop: function (props, monitor) {
        // Obtain the dragged item
        var item = monitor.getItem();
        if (typeof props.onColumnGroupAdded === 'function') {
            props.onColumnGroupAdded(item.key);
        }
    }
};
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedolumn: monitor.getItem()
    };
}
export default DropTarget(DragItemTypes.Column, columnTarget, collect)(GroupedColumnsPanel);
//# sourceMappingURL=GroupedColumnsPanel.js.map