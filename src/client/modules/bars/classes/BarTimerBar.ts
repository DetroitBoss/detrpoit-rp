import {clamp, getColorFromValue} from "../util";
import * as coordsAndSize from "../coordsAndSizes";
import {TimerBarBase} from "./TimerBarBase";
import {timerBarPool} from "..";

const { drawRect } = mp.game.graphics;
const { progressWidth, progressBaseX, barOffset, progressHeight } = coordsAndSize.default

export class BarTimerBar extends TimerBarBase {
    private _fgX: number;
    private _fgWidth: number;
    private _fgColor: [number, number, number, number];
    private _bgColor: [number, number, number, number];
    private _progress: number;
    constructor(title: string, progress: number) {
        super(title);

        this._thin = true;
        this._bgColor = [155, 155, 155, 255];
        this._fgColor = [240, 240, 240, 255];
        this._fgWidth = 0.0;
        this._fgX = 0.0;

        this.progress = progress;
        timerBarPool.add(this)
    }

    // Properties
    get progress() {
        return this._progress;
    }

    get backgroundColor() {
        return this._bgColor;
    }

    get foregroundColor() {
        return this._fgColor;
    }

    set progress(value) {
        this._progress = clamp(value, 0.0, 1.0);
        this._fgWidth = progressWidth * this._progress;
        this._fgX = (progressBaseX - progressWidth * 0.5) + (this._fgWidth * 0.5);
    }

    set backgroundColor(value) {
        this._bgColor = getColorFromValue(value);
    }

    set foregroundColor(value) {
        this._fgColor = getColorFromValue(value);
    }

    // Functions
    draw(y: number) {
        super.draw(y);

        y += barOffset;
        drawRect(progressBaseX, y, progressWidth, progressHeight, this._bgColor[0], this._bgColor[1], this._bgColor[2], this._bgColor[3]);
        drawRect(this._fgX, y, this._fgWidth, progressHeight, this._fgColor[0], this._fgColor[1], this._fgColor[2], this._fgColor[3]);
    }
};