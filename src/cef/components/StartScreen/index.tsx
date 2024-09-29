import React, {Component} from 'react';
import './style.less'
import png from './*.png'
import svg from './*.svg'
import {CEF} from '../../modules/CEF';
import {START_DIALOG} from '../../../shared/rules';
import {CustomEvent} from "../../modules/custom.event";


export class GreetingScreenClass extends Component<{}, {}> {
    componentWillUnmount(){
        CEF.playSound('hudinfo')
    }
    componentDidMount(){
        CEF.playSound('okLogin')
    }
    render() {
        return <div className="body-start"><div className="overflow">
            <div className="circle">
                <img src={svg['circle']} width="24" height="24" />
            </div>
            {/* <div className="drips-paint"> */}
                {/* <img src={png['drips-paint']} alt="drips paint" /> */}
            {/* </div> */}
            <div className="start-wrapper">
                <div className="start-wrap">
                    <div className="start-man">
                        <img src={png['man']} alt="man" />
                    </div>
                    <div className="rightside">
                        <div className="text-wrap">
                            <div className="title-wrap">
                                <p>Добро <span>пожаловать</span></p>
                                <div className="logo-wrapper">
                                    <p>на DETROIT ROLE PLAY</p>
                                </div>
                            </div>
                            <p className="descr">{START_DIALOG}</p>
                            <button onClick={e => {
                            e.preventDefault();
                            CustomEvent.triggerServer('greeting:ok')
                            CEF.gui.setGui(null);
                                }}>
                            <p>Принято!</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>;
    }
}

