import React, {Component} from "react";
import "../../style.less";
import {CollectItem} from "../../../../../shared/diving/minigames.config";

import png from "./assets/*.png"
import Draggable from "react-draggable";
import {CustomEvent} from "../../../../modules/custom.event";
import {CEF} from "../../../../modules/CEF";

export class NetGame extends Component<{}, {
    items: CollectItem[]
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            items: [
                {
                    img: 'item0',
                    isDragging: false,
                    inNet: false
                },
                {
                    img: 'item1',
                    isDragging: false,
                    inNet: false
                },
                {
                    img: 'item2',
                    isDragging: false,
                    inNet: false
                },
                {
                    img: 'item3',
                    isDragging: false,
                    inNet: false
                },
                {
                    img: 'item4',
                    isDragging: false,
                    inNet: false
                },
                {
                    img: 'item5',
                    isDragging: false,
                    inNet: false
                },
                {
                    img: 'item6',
                    isDragging: false,
                    inNet: false
                }
            ]
        }
    }

    private pointerEnter() {
        let key = this.getDraggingItem();
        if (key === null) return;
        let items = [...this.state.items];
        items[key].inNet = true;
        this.setState({...this.state, items});
    }

    private pointerLeave() {
        let key = this.getDraggingItem();
        if (key === null) return;
        let items = [...this.state.items];
        items[key].inNet = false;
        this.setState({...this.state, items});
    }

    private onStartDrag(i: number) {
        let items = [...this.state.items];
        items[i].isDragging = true;
        this.setState({...this.state, items});
    }

    private onStopDrag(i: number) {
        let items = [...this.state.items];
        items[i].isDragging = false;
        this.setState({...this.state, items});
        this.checkOnFinish();
    }

    private getDraggingItem(): number {
        let i = null;

        this.state.items.forEach((el, key) => {
            if (el.isDragging) i = key;
        });

        return i;
    }

    private checkOnFinish() {
        if (this.state.items.filter(el => el.inNet).length === this.state.items.length) {
            CustomEvent.triggerClient('diving:collectGame:finish');
            CEF.gui.setGui(null);
        }
    }

    render() {
        return <>
            <div className="divingGame-netTitle">
                <div className="divingGame-netTitle__title">СОБЕРИ <br/> <span>ВЕЩИ</span></div>
                <div className="divingGame-netTitle__text">Хватайте вещи и кладите <br/> в сеть!</div>
            </div>

            <div className="netGame">
                {
                    this.state.items.map((el, key) => {
                        return <Draggable
                            onStart={() => this.onStartDrag(key)}
                            onStop={() => this.onStopDrag(key)}
                            key={key}
                        >
                            <div className={`netGame-slot netGame-slot__${key}`}>
                                <img src={png[el.img]} alt=""/>
                            </div>
                        </Draggable>
                    })
                }


                <div className="netGame__bagBody"
                     onPointerEnter={() => this.pointerEnter()}
                     onPointerLeave={() => this.pointerLeave()}
                />
                <img src={png["frontBag"]} alt="" className="netGame__bagFront"/>
                <img src={png["backBag"]} alt="" className="netGame__bagBack"/>

            </div>

        </>
    }

}