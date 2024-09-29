import { __assign, __extends } from "tslib";
import React from 'react';
import PropTypes from 'prop-types';
import html5DragDropContext from '../shared/html5DragDropContext';
import DraggableHeaderCell from './DraggableHeaderCell';
var DraggableContainer = /** @class */ (function (_super) {
    __extends(DraggableContainer, _super);
    function DraggableContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DraggableContainer.prototype.render = function () {
        return React.cloneElement(React.Children.only(this.props.children), __assign(__assign({}, this.props), { draggableHeaderCell: DraggableHeaderCell }));
    };
    DraggableContainer.propTypes = {
        children: PropTypes.element.isRequired
    };
    return DraggableContainer;
}(React.Component));
export default html5DragDropContext(DraggableContainer);
//# sourceMappingURL=DraggableContainer.js.map