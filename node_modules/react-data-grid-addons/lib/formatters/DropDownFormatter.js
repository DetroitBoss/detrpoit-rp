import React from 'react';
/**
 * Used for displaying the value of a dropdown (using DropDownEditor) when not editing it.
 * Accepts the same parameters as the DropDownEditor.
*/
export default function DropDownFormatter(_a) {
    var value = _a.value, options = _a.options;
    var option = options.find(function (v) { return typeof v === 'string' ? v === value : v.value === value; }) || value;
    if (typeof option === 'string') {
        return React.createElement("div", { title: option }, option);
    }
    var title = option.title || option.value || value;
    var text = option.text || option.value || value;
    return React.createElement("div", { title: title }, text);
}
//# sourceMappingURL=DropDownFormatter.js.map