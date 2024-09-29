import React, {Component} from "react";
import "./style.less"
import png from "./assets/*.png";
import svg from "./assets/*.svg";
import item from "./assets/items/*.png"
import category from "./assets/categoryes/*.svg";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import {CustomEvent} from "../../../modules/custom.event";
import {getRandomInt} from "../../../../shared/arrays";
import classNames from "classnames";
import {Simulate} from "react-dom/test-utils";
import mouseUp = Simulate.mouseUp;


interface IItem {
    img: string
    position: { x: number, y: number }
    color: string
    completed: boolean
    show: boolean
}

export class JailWashing extends React.Component<{
    status: (status: boolean) => void;
}, {
    dragItem: number,
    color: string,
    dropStatus: string,
    items: IItem[],
    showDropBlock: boolean,
}> {


    constructor(props: any) {
        super(props);

        this.state = {
            dragItem: null,
            color: null,
            dropStatus: null,
            showDropBlock: true,

            items: [
                {
                    img: "white0",
                    position: {x: 0, y: 0},
                    color: "white",
                    completed: false,
                    show: true
                },
                {
                    img: "white1",
                    position: {x: 0, y: 0},
                    color: "white",
                    completed: false,
                    show: true
                },
                {
                    img: "black0",
                    position: {x: 0, y: 0},
                    color: "black",
                    completed: false,
                    show: true
                },
                {
                    img: "black1",
                    position: {x: 0, y: 0},
                    color: "black",
                    completed: false,
                    show: true
                },
                {
                    img: "orange0",
                    position: {x: 0, y: 0},
                    color: "orange",
                    completed: false,
                    show: true
                },
                {
                    img: "orange0",
                    position: {x: 0, y: 0},
                    color: "orange",
                    completed: false,
                    show: true
                }

            ]
        }

    }


    componentDidMount() {
        this.randomColor()
    }

    randomColor() {
        if (this.state.color === null) {
            let randColor = getRandomInt(0, 2);
            if (randColor === 0) return this.setState({color: "white"})
            if (randColor === 1) return this.setState({color: "black"})
            return this.setState({color: "orange"})
        }
        return
    }


    onStartDrag(key: number) {
        this.setState({dragItem: key});
    }

    checkOnFinish() {
        if (this.state.items.filter(el => el.color === this.state.color).filter(el => el.completed === false).length === 0) {
            this.setState({showDropBlock: false})
            this.props.status(true)
        }
    }

    onStopDrag(e: DraggableEvent, data: DraggableData, key: number) {
        const itemsCopy = [...this.state.items];
        if (this.state.color === null) return;
        if (this.state.color === itemsCopy[key].color) {
            itemsCopy[key].position = {x: data.x, y: data.y}
            this.setState({items: itemsCopy})
        }
        if (this.state.color != itemsCopy[key].color) {
            itemsCopy[key].position = {x: data.x, y: data.y}
        }
        this.setState({dragItem: null});
    }

    pointerEnter() {
        if (this.state.dragItem === null) return;
        const item = this.state.items[this.state.dragItem];
        if (this.state.color === item.color) {
            const items = [...this.state.items]
            items[this.state.dragItem].show = false;
            items[this.state.dragItem].completed = true;
            this.setState({dropStatus: "green", items});
            this.checkOnFinish();
        } else {
            this.setState({dropStatus: "red"});
        }

    };

    pointerLeave() {
        this.setState({dropStatus: null})
    };


    render() {
        return <div className="jail-washing">
            <img src={png["backgroundImage"]} className="jail-washing__backgroundImage" alt=""/>

            <div className="jail-washing-titleTopLeft">
                <span>Рассортируй<br/> одежду</span>
                <p>
                    Хватайте одежду нужного цвета <br/>
                    и поместите в ячейку стиральной машины
                </p>
                <div className="jail-washing-titleTopLeft-mission">
                    <div className="jail-washing-titleTopLeft-mission__color">
                        <div className={`jail-washing-titleTopLeft-mission__color-${this.state.color}`}>
                            <div/>
                        </div>
                        - Цвет
                    </div>
                </div>
            </div>


            <div className="jail-washing-slots">

                {
                    this.state.items.map((el, key) => {
                        return <Draggable key={key}
                                          defaultPosition={{x: 0, y: 0}}
                                          position={el.position}
                                          onStart={() => this.onStartDrag(key)}
                                          onStop={(event, data) => this.onStopDrag(event, data, key)}>
                            <div className={classNames(`jail-washing-slots__${key}`, {
                                "jail-washing-slots-hide": !el.show
                            })}><img src={item[el.img]} alt=""/></div>
                        </Draggable>
                    })
                }

            </div>

            <div className="jail-washing__bottomLeft">
                <img src={svg["mouse"]} alt=""/>
                Удерживайте ЛКМ, <br/>
                чтобы перетаскивать вещи
            </div>

            <div className="jail-washing-containers">

                <div className="jail-washing-containers-block">
                    {this.state.showDropBlock && <div className={classNames("jail-washing-containers-block__drop", {
                        "jail-washing-containers-block__drop-green": this.state.dropStatus === "green",
                        "jail-washing-containers-block__drop-red": this.state.dropStatus === "red"
                    })}
                                                      onPointerEnter={() => this.pointerEnter()}
                                                      onPointerLeave={() => this.pointerLeave()}
                    >
                        Поместите вещь в это окно
                    </div>}
                    <img src={png['washing']} alt="" className="jail-washing-containers-block__container"/>
                </div>

            </div>


        </div>;

    }
}
