import React, {Component} from "react";

import closeIcon from "./assets/closeIcon.svg";

import "./style.less"
import classNames from "classnames";

export class CloseButton extends Component<{
    onClickAction: Function,
    isRightPosition?: boolean
}, {}> {

    isRightPosition: boolean = this.props.isRightPosition !== undefined ? this.props.isRightPosition : true;

    constructor(props: any) {
        super(props);
    }

    click() {
        if (this.props.onClickAction) this.props.onClickAction();
    }

    render() {
        return <div className={classNames('exit', {
            'exit-right': this.isRightPosition,
            'exit-left': !this.isRightPosition
        })} onClick={() => this.click()}>
            <div className="exit__icon"><img src={closeIcon} alt="#"/></div>
            <div className="exit__title">Закрыть</div>
        </div>
    }

}
