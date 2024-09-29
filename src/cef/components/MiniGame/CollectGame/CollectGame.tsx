// МАКСИМАЛЬНО 13 ITEM'ов
import React, {Component} from "react";
import Draggable from "react-draggable";
import "./style.less";

import png from "./assets/*.png"
import svg from "./assets/*.svg"

const TIMEOUT_SECONDS = 120;

interface item {
    image: string
    isDragging: boolean,
    inBag: boolean
}

export class CollectGame extends Component<{
    status: (status: boolean) => void
}, {
    items: item[],
    time: number,
    interval?: number,
    title: string,
    desc: string
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            items: [
                {
                    image: "painting",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "chain",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "coin",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "cup",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "mark",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "necklace",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "rolex",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "statuette",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "vase",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "vinyl",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "watch",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "whiskey",
                    isDragging: false,
                    inBag: false
                },
                {
                    image: "wine",
                    isDragging: false,
                    inBag: false
                }
            ],
            time: TIMEOUT_SECONDS,
            title: "Соберите вещи",
            desc: "Хватайте вещи и кладите в сумку, у вас остается очень мало времени!"
        }

        setTimeout(() => {
            this.start(TIMEOUT_SECONDS);
        }, 1500)
    }

    checkOnFinish(): void {
        let finished = true;

        this.state.items.forEach((el) => {
            if (el.inBag === false) finished = false;
        });

        if (finished) {
            clearInterval(this.state.interval);
            this.props.status(true);
        }
    }

    timeout() {
        clearInterval(this.state.interval);
        this.setState({...this.state, time: 0});
        this.props.status(false);
    }

    start(seconds: number): void {
        let interval = setInterval(() => {
            if (this.state.time === 1) {
                this.timeout();
            }else{
                let time = this.state.time - 1;
                this.setState({...this.state, time});
            }
        }, 1000);

        this.setState({...this.state, interval, time: seconds});
    }

    onStartDrag(key: number): void {
        let items = [...this.state.items];
        items[key].isDragging = true;
        this.setState({...this.state, items});
    }

    onStopDrag(key: number): void {
        let items = [...this.state.items];
        items[key].isDragging = false;
        this.setState({...this.state, items});
        this.checkOnFinish();
    }

    getDraggingItem(): number {
        let i = null;

        this.state.items.forEach((el, key) => {
            if (el.isDragging) i = key;
        });

        return i;
    }

    pointerEnterOnBag(): void {
        let key = this.getDraggingItem();
        if (key === null) return;
        let items = [...this.state.items];
        items[key].inBag = true;
        this.setState({...this.state, items});
    }

    pointerLeaveFromBag(): void {
        let key = this.getDraggingItem();
        if (key === null) return;
        let items = [...this.state.items];
        items[key].inBag = false;
        this.setState({...this.state, items});
    }

    getTime(): string {
        let time = this.state.time,
            minutes = Math.floor(time / 60),
            seconds = `${time - minutes * 60}`;

        if (Number(seconds) < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }


    render() {
        return <div className="collectGame">
            <img src={png["backgroundImage"]} className="collectGame__backgroundImage" alt=""/>

            <img src={png["bagBack"]} className='collectGame__bagBack' alt=""/>
            <img src={png["bagFront"]} className='collectGame__bagFront' alt=""/>

            <div className="collectGame-titleTopLeft">
                <span>{ this.state.title }</span>
                <p>
                    { this.state.desc }
                </p>
            </div>
            <img src={svg['titleBottomLeft']} className='collectGame__titleBottomLeft' alt=""/>

            <div className="collectGame-time">
                <img src={svg['titleBottomRight']} alt=""/>
                <span>{ this.getTime() }</span>
            </div>

            <div className="collectGame-slots">

                {
                    this.state.items.map((el, key) => {

                        return <Draggable
                            onStart={() => this.onStartDrag(key)}
                            onStop={() => this.onStopDrag(key)}
                            key={key}
                        >
                            <div className={`collectGame-slots__${key}`}><img src={png[el.image]} alt=""/></div>
                        </Draggable>
                    })
                }

            </div>

            <div className="collectGame__dropBlock" onPointerEnter={() => this.pointerEnterOnBag()} onPointerLeave={() => this.pointerLeaveFromBag()}/>

        </div>
    }
}