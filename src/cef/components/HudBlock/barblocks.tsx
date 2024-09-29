import './style.less';
import React, {Component} from 'react';

import {CustomEvent} from '../../modules/custom.event';

export class TimerClass extends Component<{}, {
    speedometer: boolean,
    items: {text: string, help: string|(number[]), red?:boolean}[]
}> {
    int: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            speedometer: false,
            items: []
        }

        CustomEvent.register('hud:speedometer', (data: { [param: string]: any }) => {
            if (JSON.stringify(data).length < 5) return this.setState({ speedometer: false });
            this.setState({ speedometer: true});
        })

        CustomEvent.register('hud:textclass', (items: {text: string, help: string|(number[]), red?:boolean}[]) => this.setState({ items }))

    }

    render() {
        if(!this.state.items.length) return <></>;
        return <div className={"system-alert"+(this.state.speedometer ? '' : ' no-speedometr')}>
            {this.state.items.map((item, id) => {
                return <div className={"sl-line "+(item.red ? 'red' : '')} key={`sl_${id}`}>
                    <p>{item.text}</p>
                    {item.help ? <>{typeof item.help !== "object" ? <div className="w-sl-box">
                        <p>{item.help}</p>
                    </div> : <div className="w-sl-box">
                        {item.help.map((on, i) => <i key={`sl_cu_${id}_i`} className={"s-circle " + (on ? 'on' : '')} />)}
                    </div>}</> : <></>}

                </div>
            })}
        </div>
    }
};