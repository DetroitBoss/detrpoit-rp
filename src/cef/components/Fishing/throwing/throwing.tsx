import React, {Component} from 'react';
import "./style.less";
import png from '../assets/*.png'
import svg from "../assets/*.svg"
import { CustomEvent } from '../../../modules/custom.event'
import { CustomEventHandler } from '../../../../shared/custom.event'

export class FishThrowing extends Component<{}, {
    progressBar: number,
    gameDirection: string,
    interval: any,
    show: boolean
}> {
    private _ev: CustomEventHandler
    
    constructor(props: any) {
        super(props);

        this.state = {
            progressBar: 0,
            gameDirection: "up",
            interval: null,
            show: false
        }

        this._ev = CustomEvent.register('fish:throwing:start', () => {
            this.startGame()
        })
    }
    
    startGame() {
        document.addEventListener("keyup", this.spaceClick)

        const interval = setInterval(() => {
            if (this.state.gameDirection === "up") {
                this.setState({progressBar: this.state.progressBar + 0.5})
            } else {
                this.setState({progressBar: this.state.progressBar - 0.5})
            }

            if (this.state.progressBar === 100) {
                this.setState({gameDirection: "down"})
            }
            if (this.state.progressBar === 0) {
                this.setState({gameDirection: "up"})
            }
        }, 3)

        this.setState({
            ...this.state, 
            interval, 
            show: true
        })
    }

    spaceClick = (event: any) => {
        if (event.keyCode === 32) {
            this.stopGame()
        }
    }

    stopGame() {
        clearInterval(this.state.interval)
        document.removeEventListener("keyup", this.spaceClick)
        CustomEvent.triggerClient('fishing:throwing:done', this.state.progressBar)
        this.setState({
            show: false
        })
    }
    
    componentDidMount() {
    }

    componentWillUnmount() {
        this._ev?.destroy()
        this.stopGame()
    }

    render() {
        return <div className="fishing" style={{ display: this.state.show ? 'flex' : 'none'}}>

            <div className="fishing__helpImage">
                <img src={png["helpImage"]} alt=""/>
                <span>Закинь удочку</span>
            </div>

            <div className="fishing__help">
                Нажми <span>Пробел</span> чтобы определить дальность броска
            </div>

            <div className="fishing-progress">

                <img src={svg["progressImage"]} className="fishing-progress__image" alt=""/>
                <img src={png["helpImage"]} className="fishing-progress__help" alt=""/>

                <div
                    className={`fishing-progress__bar ${this.state.progressBar > 69 && this.state.progressBar < 97 ? 'fishing-green' : null}`}>
                    <div style={{height: this.state.progressBar + "%"}}/>
                </div>

            </div>

        </div>
    }
}