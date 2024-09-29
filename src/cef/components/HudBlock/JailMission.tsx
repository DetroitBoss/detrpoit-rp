import React, {Component} from 'react';
import "./style.less"
import {TASK_NAME} from "../../../shared/prison/tasks.config";
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";
import {IPrisonTask} from "../../../shared/prison/IPrisonTask";

export class JailMission extends Component<{}, {
    data: IPrisonTask | null
}> {
    ev: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            data: null
        }

        this.ev = CustomEvent.register('prison:task:update', (data) => {
            this.setState({data})
        })
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
    }

    render() {
        return <>{this.state.data !== null && <div className="jail-mission">
            <h1>Задание:</h1>
            <p>{TASK_NAME(this.state.data.type)} ({this.state.data.completed}/{this.state.data.count})</p>
        </div>}</>
    }
}