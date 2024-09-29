import React, {Component} from "react";
import "./style.less";
import {component} from "../../BattlePass";
import {CustomEvent} from "../../../../modules/custom.event";

export class NavigationBar extends Component<{
    component: component
}, {
}> {

    constructor(props: any) {
        super(props);
    }

    setComponent(component: component) {
        CustomEvent.trigger('battlePass:setComponent', component)
    }

    render() {
        return <div className={"navBar"}>
            <div className={`${this.props.component === 'main' ? `navBar-active` : null}`}
            onClick={() => this.setComponent('main')}>Главная</div>
            <div className={`${this.props.component === 'tasks' ? `navBar-active` : null}`}
                 onClick={() => this.setComponent('tasks')}>Задания</div>
            <div className={`${this.props.component === 'rating' ? `navBar-active` : null}`}
                 onClick={() => this.setComponent('rating')}>Рейтинг</div>
            <div className={`${this.props.component === 'storage' ? `navBar-active` : null}`}
                 onClick={() => this.setComponent('storage')}>Хранилище</div>
        </div>
    }
}