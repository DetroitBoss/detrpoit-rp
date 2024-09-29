import './style.less'
import React, {Component} from 'react';
import Spike from './Spike';

/* AUDIO */

const hammerAudio = {
    tick: [
        new Audio(require("./assets/hammer1.mp3")),
        new Audio(require("./assets/hammer2.mp3")),
        new Audio(require("./assets/hammer3.mp3")),
    ],
    done: new Audio(require("./assets/completehammer.mp3")),
    currentlyPlaying: false,
};

const playRandomHammerSound = () => {
    if (hammerAudio.currentlyPlaying)
        return;

    const idx = Math.floor(Math.random() * Math.floor(hammerAudio.tick.length));
    hammerAudio.currentlyPlaying = true;
    hammerAudio.tick[idx].play();
};

// может быть воспроизведен КОГДА УГОДНО
const playOnDoneHammerSound = () => {
    hammerAudio.done.play();
};

const onAudioEnded = () => hammerAudio.currentlyPlaying = false;

for (const audio of hammerAudio.tick) {
    audio.addEventListener("ended", onAudioEnded);
}

hammerAudio.done.addEventListener("ended", onAudioEnded);

/* ****************** */

interface IPosition {
    x?: number,
    y?: number
}

interface IRect extends IPosition {
    w?: number,
    h?: number
}

interface JobHummerState {
    hummer_pos?: IRect,
    wood_pos?: IRect,
    last_mouse_track?: { pos?: IPosition, timestamp?: number },
    last_hit: number,
    spikes?: number[]
}

const REF_WIDTH = 3840; // 4K
const REF_DELTA_X = 10.0;
const REF_DELTA_Y = 30.0;
const REF_VEL_X = 20.0;
const REF_VEL_Y = 10.0;
const REF_POWER_COEF = 1500.0;

export default class JobHummer extends Component<{ready:()=>void}, JobHummerState> {
    constructor(props: any) {
        super(props);

        this.state = {
            hummer_pos: null,
            wood_pos: null,
            last_mouse_track: null,
            spikes: new Array(4).fill(0.05),
            last_hit: 0,
        };

        this.handleGlobalMouseMove = this.handleGlobalMouseMove.bind(this);
        this.handleGlobalMouseClick = this.handleGlobalMouseClick.bind(this);
        this.handleHummerImageLoaded = this.handleHummerImageLoaded.bind(this);
        this.handleWoodImageLoad = this.handleWoodImageLoad.bind(this);
    }

    private get hummerStyle() {
        let style: React.CSSProperties = {};

        if (this.state.hummer_pos !== null) {
            const { x: posX, y: posY } = this.state.hummer_pos;
            style.left = posX;
            style.top = posY;
        }

        return style;
    }

    private get spikeEndXPos() {
        if (this.state.wood_pos === null) return null;
        return this.state.wood_pos.x - 10;
    }

    private get spikeStartXPos() {
        if (this.state.wood_pos === null) return null;
        return this.state.wood_pos.x - 230;
    }

    private handleHummerImageLoaded({ target }: { target: any }) {
        if (this.state.hummer_pos === null) {
            this.setState({
                hummer_pos: {
                    x: (innerWidth - target.offsetWidth) / 2,
                    y: (innerHeight - target.offsetHeight) + 191,
                    w: target.offsetWidth,
                    h: target.offsetHeight
                }
            });
        }
    }

    private handleGlobalMouseMove(e: MouseEvent) {
        if (this.state.hummer_pos === null)
            return;

        const newHummerPos: IRect = {
            x: e.clientX - this.state.hummer_pos.w / 2,
            y: e.clientY - this.state.hummer_pos.h / 2,
            w: this.state.hummer_pos.w,
            h: this.state.hummer_pos.h
        }

        this.setState({ hummer_pos: newHummerPos });

        if (this.state.last_mouse_track !== null) {
            this.setState((state) => {
                const spikes = state.spikes.map((spikeProgress, idx) => {
                    const spike = {
                        x: innerWidth - this.state.wood_pos.w - 263 * (1 - this.state.spikes[idx]),
                        y: 270 + (idx * 148) + 8,
                    };

                    const hammer = {
                        x: newHummerPos.x + newHummerPos.w,
                        y: newHummerPos.y + 45,
                    };

                    const vx = e.movementX;
                    const vy = e.movementY;

                    const dx = hammer.x - spike.x;
                    const dy = Math.abs(hammer.y - spike.y);

                    const dw = (innerWidth * devicePixelRatio) / REF_WIDTH;
                    const rdx = REF_DELTA_X * dw;
                    const rdy = REF_DELTA_Y * dw;

                    if (dx >= rdx && dx <= (rdx + vx) && dy <= rdy) {
                        if (vx >= (REF_VEL_X * dw) && Math.abs(vy) <= (REF_VEL_Y * dw)) {
                            const pushTo = (vx + dx) / (REF_POWER_COEF * dw);

                            if (spikeProgress < 1) {
                                const newProgress = spikeProgress += pushTo;

                                if (newProgress >= 1) {
                                    playOnDoneHammerSound();
                                } else {
                                    playRandomHammerSound();
                                }

                                return newProgress;
                            }
                        }
                    }

                    return spikeProgress;
                });
                if(!spikes.find(q => q < 1) && this.state.spikes.find(q => q < 1)) this.props.ready()
                return {
                    spikes,
                };
            });
        }

        this.setState({ last_mouse_track: { pos: { x: 0, y: 0 }, ...this.state.last_mouse_track } });
    }

    private handleGlobalMouseClick(e: Event) {
        e.preventDefault();
    }

    private handleGlobalMouseUp(e: MouseEvent) {

    }

    private handleWoodImageLoad({ target }: { target: any }) {
        if (this.state.wood_pos === null) {
            this.setState({
                wood_pos: {
                    x: target.offsetLeft,
                    y: target.offsetTop,
                    w: target.offsetWidth,
                    h: target.offsetHeight
                }
            });
        }
    }

    componentDidMount() {
        addEventListener("mousedown", this.handleGlobalMouseClick);
        addEventListener("mousemove", this.handleGlobalMouseMove);
    }

    componentWillUnmount() {
        removeEventListener("mousedown", this.handleGlobalMouseClick);
        removeEventListener("mousemove", this.handleGlobalMouseMove);
    }

    render() {
        return (<>
            <img onLoad={this.handleHummerImageLoaded} className="hummer" style={this.hummerStyle} src={require("./assets/hummer.png")} />

            <img onLoad={this.handleWoodImageLoad} className="wood" src={require("./assets/wood.png")} />

            <div className="spikes">
                {this.state.wood_pos && this.state.spikes.map((progress, i) => (<Spike key={i} woodWidth={this.state.wood_pos.w} start={this.spikeStartXPos} end={this.spikeEndXPos} progress={progress} y={270 + i * 148} />))}
            </div>
        </>)
    }
}
