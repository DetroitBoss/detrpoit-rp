import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import images from '../../../shared/SuccessInfo/*.png';
import imagesWebp from '../../../shared/SuccessInfo/*.webp';
import svg from './*.svg';
import {CEF} from "../../modules/CEF";
import {inventoryShared} from "../../../shared/inventory";

export class SuccessScreen extends Component<{}, {
    data: [string, string, string][];
    title?: string,
    desc?:string,
    image?:string
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: []
        }
        CustomEvent.register('success:screen:show', (title: string, desc: string, image: string) => {
            CEF.gui.setCursor(true);
            if(this.state.title) return this.setState({data: [...this.state.data, [title, desc, image]]});
            this.setState({title, desc, image});
        })
        CustomEvent.register('success:screen:showitem', (item: number) => {
            const cfg = inventoryShared.get(item)
            if(!cfg || !cfg.helpDesc || !cfg.helpIcon) return;
            CEF.gui.setCursor(true);
            if(this.state.title) return this.setState({data: [...this.state.data, [cfg.name, cfg.helpDesc, cfg.helpIcon]]});
            this.setState({title: cfg.name, desc: cfg.helpDesc, image: cfg.helpIcon});
        });
    }

    render() {
        if(!this.state.title) return <></>;
        return <div className="body-info" style={{zIndex: 999999}}>
            <div className="overflow">
                <div className="bg-color" />
                <div className="circle">
                    <img src={svg['circle']} width="24" height="24" />
                </div>
                <div className="page-info-wrapper">
                    <div className="page-info-wrap">
                        <div className="left-img-wrap">
                            <img src={images[this.state.image] || imagesWebp[this.state.image]} />
                        </div>
                        <div className="rightside">
                            <div className="text-wrap">
                                <div className="title-wrap text-left">
                                    <p>{this.state.title}</p>
                                </div>
                                <p className="descr">{this.state.desc}</p>
                            </div>
                            <button onClick={e => {
                                e.preventDefault();
                                if(this.state.data.length > 0){
                                    const data = [...this.state.data];
                                    this.setState({
                                        title: this.state.data[0][0],
                                        desc: this.state.data[0][1],
                                        image: this.state.data[0][2],
                                    }, () => {
                                        data.splice(0, 1)
                                        this.setState({ data });
                                    })
                                } else {
                                    this.setState({
                                        title: null,
                                        desc: null,
                                        image: null,
                                    })
                                    CEF.gui.setCursor(false);
                                }
                            }}>
                                <p>Понятно</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
