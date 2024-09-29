import { __assign } from "tslib";
import React from 'react';
import AutoCompleteFilter from './AutoCompleteFilter';
export default function SingleSelectFilter(props) {
    return React.createElement(AutoCompleteFilter, __assign({}, props, { multiSelection: false }));
}
//# sourceMappingURL=SingleSelectFilter.js.map