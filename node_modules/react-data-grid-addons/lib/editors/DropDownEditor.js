import { __extends } from "tslib";
import React from 'react';
import PropTypes from 'prop-types';
var DropDownEditor = /** @class */ (function (_super) {
    __extends(DropDownEditor, _super);
    function DropDownEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setSelectRef = function (select) {
            _this.select = select;
        };
        return _this;
    }
    DropDownEditor.prototype.getInputNode = function () {
        return this.select;
    };
    DropDownEditor.prototype.getValue = function () {
        var _a;
        return _a = {},
            _a[this.props.column.key] = this.select.value,
            _a;
    };
    DropDownEditor.prototype.renderOptions = function () {
        return this.props.options.map(function (name) {
            if (typeof name === 'string') {
                return (React.createElement("option", { key: name, value: name }, name));
            }
            return (React.createElement("option", { key: name.id, value: name.value, title: name.title }, name.text || name.value));
        });
    };
    DropDownEditor.prototype.render = function () {
        return (React.createElement("select", { ref: this.setSelectRef, className: "rdg-select-editor", defaultValue: this.props.value, onBlur: this.props.onBlur }, this.renderOptions()));
    };
    DropDownEditor.propTypes = {
        options: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                id: PropTypes.string,
                title: PropTypes.string,
                value: PropTypes.string,
                text: PropTypes.string
            })
        ])).isRequired
    };
    DropDownEditor.propTypes = {
        value: PropTypes.any.isRequired,
        onBlur: PropTypes.func.isRequired
        // column: PropTypes.shape(Column).isRequired
    };
    return DropDownEditor;
}(React.Component));
export default DropDownEditor;
//# sourceMappingURL=DropDownEditor.js.map