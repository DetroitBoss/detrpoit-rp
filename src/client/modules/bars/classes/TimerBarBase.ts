import {drawTextLabel, generateRandomString, getColorFromValue, textJustification} from "../util";
import * as coordsAndSize from "../coordsAndSizes";
import {timerBarPool} from "..";

const { drawSprite } = mp.game.graphics;
const { initialX, bgBaseX, bgOffset, bgThinOffset, timerBarWidth, timerBarHeight, timerBarThinHeight, titleScale, titleWrap } = coordsAndSize.default
export class TimerBarBase {
    /** Элемент существует но не отображается */
    hidden = false
    _titleGxtName: string;
    private _title: string;
    private _highlightColor: [number, number, number, number] = null;
    _thin = true;
    _id = generateRandomString(8);
    titleDrawParams: { font: number; color: [number, number, number, number]; scale: number; justification: number; wrap: number; shadow?:boolean };
    _enabled = true;
    constructor(title: string) {
        this._titleGxtName = `TMRB_TITLE_${this._id}`;
        this._title = title;

        this.titleDrawParams = {
            font: 0,
            color: [240, 240, 240, 255],
            scale: titleScale,
            justification: textJustification.right,
            wrap: titleWrap
        };

        mp.game.gxt.set(this._titleGxtName, title);
    }
    exists(){
        return !!this._enabled
    }
    destroy(){
        this._enabled = false
        timerBarPool.removeById(this._id)
    }

    // Properties
    get title() {
        return this._title;
    }

    get titleColor() {
        return this.titleDrawParams.color;
    }

    get highlightColor() {
        return this._highlightColor;
    }

    set title(value) {
        this._title = value;
        mp.game.gxt.set(this._titleGxtName, value);
    }

    set titleColor(value: [number, number, number, number] | number) {
        this.titleDrawParams.color = getColorFromValue(value);
    }

    set highlightColor(value: [number, number, number, number] | number) {
        this._highlightColor = value ? getColorFromValue(value) : null;
    }

    // Functions
    drawBackground(y: number) {
        y += this._thin ? bgThinOffset : bgOffset;

        if (this._highlightColor) {
            drawSprite("timerbars", "all_white_bg", bgBaseX, y, timerBarWidth, this._thin ? timerBarThinHeight : timerBarHeight, 0.0, this._highlightColor[0], this._highlightColor[1], this._highlightColor[2], this._highlightColor[3]);
        }

        drawSprite("timerbars", "all_black_bg", bgBaseX, y, timerBarWidth, this._thin ? timerBarThinHeight : timerBarHeight, 0.0, 255, 255, 255, 140);
    }

    drawTitle(y: number) {
        drawTextLabel(this._titleGxtName, [initialX, y], this.titleDrawParams);
    }

    draw(y: number) {
        this.drawBackground(y);
        this.drawTitle(y);
    }

    resetGxt() {
        mp.game.gxt.reset(this._titleGxtName);
    }
};