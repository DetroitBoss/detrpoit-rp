import React, {Component} from 'react';
import exit from './assets/exit.svg';

import './assets/style.less'
import {CEF} from '../../modules/CEF';
import Draggable from 'react-draggable';


export class IdCardBlock extends Component<{ level: number, userid: number, house?: string, id: number, serial?: string, name?: string, male?: boolean, partner?: string, onClose: (e: number) => void, age: number }, {}> {

    constructor(props: any) {
        super(props);
    }
    image() {
        return CEF.getSignatureURL('idcard_' + this.props.userid)
    }
    plural = (n: number, str1: string, str2: string, str5: string) => {
        return n + ' ' + ((((n % 10) == 1) && ((n % 100) != 11)) ? (str1) : (((((n % 10) >= 2) && ((n % 10) <= 4)) && (((n % 100) < 10) || ((n % 100) >= 20))) ? (str2) : (str5)))
    }
    render() {
        return (<>
            <Draggable key={`dr_${this.props.id}`}>
                <div key={`drb_${this.props.id}`} className="passport_main">
                    <div className="passport_box">
                        <div className="passport_head">
                            <span>onyx ID Card</span>
                            <img src={exit} onClick={() => this.props.onClose(this.props.id)} />
                        </div>
                        <div className="passport_container">
                            <div className="passport_name">{this.props.name.replace(" ", "\n")}</div>
                            <div className="passport_number">№{this.props.serial} #{this.props.userid}</div>
                            <div className="passport_info">
                                <div>Проживает {this.plural(this.props.level, "год", "года", "лет")}</div>
                                <div>{this.plural(this.props.age, "год", "года", "лет")}</div>
                                <div>{this.props.partner ? ((this.props.male ? "Жена " : "Муж ") + this.props.partner) : (this.props.male ? "Холост" : "Не замужем")}</div>
                                <div>{this.props.house || "Без прописки"}</div>
                            </div>
                            {/* <div className="passport_sign"> {this.image().length > 0 ? <img src={this.image()} /> : ""}</div> */}
                        </div>
                    </div>
                </div>
            </Draggable>
        </>);
    }
}

