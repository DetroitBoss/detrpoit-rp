import '../style.less';
import React, {Component} from 'react';
import './style.less'
import { ICrosshairSettings } from '../../../../shared/crosshair'
import { CustomEvent } from '../../../modules/custom.event'
import { CustomEventHandler } from '../../../../shared/custom.event'
import { observer } from 'mobx-react';
import CrosshairStore from '../../../stores/Crosshair'

interface IPoint {
    x: number
    y: number
}

@observer export class HudCrosshair extends Component<{
    store: CrosshairStore
}, {
}> {
    canvas: React.RefObject<any> = React.createRef();
    private _ev1: CustomEventHandler;
    private _ev2: CustomEventHandler;
    store: CrosshairStore;
    
    constructor(props: any) {
        super(props);

        this.store = props.store;

        this._ev1 = CustomEvent.register('crosshair:rerender', () => {
            console.log(`rerender ${JSON.stringify(this.store.settings)}`)
            if (this.store.settings.enable)
                this.draw();
        })

        this._ev2 = CustomEvent.register('crosshair:drawSecondaryColor', () => {
            if (this.store.settings.enable)
                this.draw(this.store.settings.aimColor);
        })
    }


    private draw(color?: { r: number, g: number, b: number }): void {
        const ctx = this.canvas.current?.getContext("2d");
        console.log(`ctx ${ctx}`)
        if (!ctx) 
            return;
        
        ctx.clearRect(0, 0, this.store.canvasSize[0], this.store.canvasSize[1]);
        
        if (!this.store.settings.enable)
            return;
        
        const middle: IPoint = { x: this.store.canvasSize[0] / 2, y: this.store.canvasSize[1] / 2 }
        const gap = this.store.settings.gap
        const settings = this.store.settings

        const startPoints: [IPoint, IPoint, IPoint, IPoint] = [
            { x: middle.x, y: middle.y + gap },// top
            { x: middle.x + gap, y: middle.y },// right
            { x: middle.x, y: middle.y - gap },// bottom
            { x: middle.x - gap, y: middle.y },// left
        ]

        ctx.beginPath();
        if (color)
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${this.store.settings.alpha})`
        else 
            ctx.strokeStyle = `rgba(${this.store.settings.color.r},${this.store.settings.color.g},${this.store.settings.color.b},${this.store.settings.alpha})`

        console.log(`color ${ctx.strokeStyle}`)
        // top
        ctx.moveTo(startPoints[0].x, startPoints[0].y);
        ctx.lineTo(startPoints[0].x, startPoints[0].y + settings.length);

        // right
        ctx.moveTo(startPoints[1].x, startPoints[1].y);
        ctx.lineTo(startPoints[1].x + settings.length, startPoints[1].y);

        // bottom
        ctx.moveTo(startPoints[2].x, startPoints[2].y);
        ctx.lineTo(startPoints[2].x, startPoints[2].y - settings.length);

        // left
        ctx.moveTo(startPoints[3].x, startPoints[3].y);
        ctx.lineTo(startPoints[3].x - settings.length, startPoints[3].y);

        ctx.lineWidth = this.store.settings.width

        ctx.stroke();
        
        this.forceUpdate();
    }
    
    public componentDidMount() {
        this.draw();
    }

    public componentWillUnmount() {
        this._ev1?.destroy()
        this._ev2?.destroy()
        
        const ctx = this.canvas.current?.getContext("2d");
        if (ctx)
            ctx.clearRect(0, 0, this.store.canvasSize[0], this.store.canvasSize[1]);
    }

    render() {
        {
            console.log('rendered crosshair')}
        return <div className="hud-crosshair" style={{ display: this.store.settings.enable && this.store.show ? 'flex' : 'none'}}>
            <canvas ref={this.canvas} id="crosshair" width={this.store.canvasSize[0]} height={this.store.canvasSize[1]}></canvas>
        </div>
    }
}