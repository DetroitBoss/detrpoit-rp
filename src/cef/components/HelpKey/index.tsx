import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'


export class HelpKeyBlock extends Component<{}, {
    keys?: [string, string][]
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            keys: null
        }

        CustomEvent.register('cef:showHelp', (keys: [string, string][]) => {
            this.setState({ keys })
        })
        CustomEvent.register('helpkey:close', () => {
            this.setState({ keys: null })
        })
    }

    render() {
        if (!this.state.keys) return <></>;
        return <div className="helpkey-block">{this.state.keys.map(q => <div><div>{q[0].toUpperCase()}</div> <div>{q[1]}</div></div>)}</div>;
    }
}

