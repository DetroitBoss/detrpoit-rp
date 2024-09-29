import React, {Component} from 'react';
import './style.less';
import ControlWithMouseHint from './Components/ControlWithMouseHint';
import Hummer from './Components/Hummer';

export class HammerJob extends Component<{onend:(status: boolean)=>void}, {control_with: string, title: string, descr: string}> {

    constructor(pros: any) {
        super(pros);
        this.state = {
                control_with: "молотком",
            title: "Заколотите гвозди",
            descr: "Вам требуется заколотить гвозди в гроб вашего врага, делайте это аккуратно, чтобы он не выбрался"
        }
    }

    render(){
        return (<div className="root">
            {/* <div className="particles"></div> */}
            <div className="hints">
                <div className="mouse">
                    <ControlWithMouseHint name={this.state.control_with} />
                </div>
                <div className="title">
                    <div className="name">
                        <span>{this.state.title.substr(0, this.state.title.indexOf(' '))}</span>
                        <span>{this.state.title.substr(this.state.title.indexOf(' ') + 1)}</span>
                    </div>
                    <span className="description">{this.state.descr}</span>
                </div>
            </div>

            <div className="job">
                <Hummer ready={() => {
                    this.props.onend(true)
                }} />
            </div>
        </div>)
    }

}