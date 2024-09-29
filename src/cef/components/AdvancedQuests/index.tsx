import React, {Component} from 'react';
import './style.less';
import {CustomEvent} from "../../modules/custom.event";

import {EnterWord} from "./components/EnterWord";

type subComponent = 'enterWord' | null;

export class AdvancedQuests extends Component<{}, {
    component: subComponent
}> {
    constructor(props: any) {
        super(props);

        CustomEvent.register('advancedQuests:setComponent', (component: subComponent) => {
            this.setState({...this.state, component});
        })

        this.state = {
            component: null
        }
    }

    render() {
        return <>
            {this.state.component === "enterWord" && <EnterWord/>}
        </>
    }
}