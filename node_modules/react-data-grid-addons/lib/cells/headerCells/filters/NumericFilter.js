import React from 'react';
var RuleType;
(function (RuleType) {
    RuleType[RuleType["Number"] = 1] = "Number";
    RuleType[RuleType["Range"] = 2] = "Range";
    RuleType[RuleType["GreaterThen"] = 3] = "GreaterThen";
    RuleType[RuleType["LessThen"] = 4] = "LessThen";
})(RuleType || (RuleType = {}));
export default function NumericFilter(_a) {
    var column = _a.column, onChange = _a.onChange;
    /** Validates the input */
    function handleKeyPress(event) {
        var result = /[><,0-9-]/.test(event.key);
        if (result === false) {
            event.preventDefault();
        }
    }
    function handleChange(event) {
        var value = event.target.value;
        var filters = getRules(value);
        onChange({
            filterTerm: filters.length > 0 ? filters : null,
            column: column,
            rawValue: value,
            filterValues: filterValues
        });
    }
    var inputKey = "header-filter-" + column.key;
    var tooltipText = 'Input Methods: Range (x-y), Greater Than (>x), Less Than (<y)';
    return (React.createElement("div", { className: "rdg-filter-container" },
        React.createElement("input", { key: inputKey, className: "rdg-filter", placeholder: "e.g. 3,10-15,>20", onChange: handleChange, onKeyPress: handleKeyPress }),
        React.createElement("span", { className: "rdg-filter-badge", title: tooltipText }, "?")));
}
function filterValues(row, columnFilter, columnKey) {
    if (columnFilter.filterTerm == null) {
        return true;
    }
    // implement default filter logic
    var value = parseInt(row[columnKey], 10);
    for (var ruleKey in columnFilter.filterTerm) {
        var rule = columnFilter.filterTerm[ruleKey];
        switch (rule.type) {
            case RuleType.Number:
                if (rule.value === value) {
                    return true;
                }
                break;
            case RuleType.GreaterThen:
                if (rule.value <= value) {
                    return true;
                }
                break;
            case RuleType.LessThen:
                if (rule.value >= value) {
                    return true;
                }
                break;
            case RuleType.Range:
                if (rule.begin <= value && rule.end >= value) {
                    return true;
                }
                break;
            default:
                break;
        }
    }
    return false;
}
export function getRules(value) {
    if (value === '') {
        return [];
    }
    // handle each value with comma
    return value.split(',').map(function (str) {
        // handle dash
        var dashIdx = str.indexOf('-');
        if (dashIdx > 0) {
            var begin = parseInt(str.slice(0, dashIdx), 10);
            var end = parseInt(str.slice(dashIdx + 1), 10);
            return { type: RuleType.Range, begin: begin, end: end };
        }
        // handle greater then
        if (str.includes('>')) {
            var begin = parseInt(str.slice(str.indexOf('>') + 1), 10);
            return { type: RuleType.GreaterThen, value: begin };
        }
        // handle less then
        if (str.includes('<')) {
            var end = parseInt(str.slice(str.indexOf('<') + 1), 10);
            return { type: RuleType.LessThen, value: end };
        }
        // handle normal values
        var numericValue = parseInt(str, 10);
        return { type: RuleType.Number, value: numericValue };
    });
}
//# sourceMappingURL=NumericFilter.js.map