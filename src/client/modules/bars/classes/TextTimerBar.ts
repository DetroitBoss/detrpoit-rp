import {drawTextLabel, getColorFromValue, textJustification} from "../util";
import * as coordsAndSize from "../coordsAndSizes";
import {TimerBarBase} from "./TimerBarBase";
import {timerBarPool} from "..";

const { initialX, textScale, textWrap, textOffset } = coordsAndSize.default

export class TextTimerBar extends TimerBarBase {
    _textGxtName: string;
    private _text: string;
    textDrawParams: { font: number; color: [number, number, number, number]; scale: any; justification: number; wrap: any; };
    constructor(title: string, text: string) {
        super(title);

        this._textGxtName = `TMRB_TEXT_${this._id}`;
        this._text = text;

        this.textDrawParams = {
            font: 0,
            color: [240, 240, 240, 255],
            scale: textScale,
            justification: textJustification.right,
            wrap: textWrap
        };

        mp.game.gxt.set(this._textGxtName, text);
        timerBarPool.add(this)
    }

    // Properties
    get text() {
        return this._text;
    }

    get textColor() {
        return this.textDrawParams.color;
    }

    set text(value) {
        this._text = value;
        mp.game.gxt.set(this._textGxtName, value);
    }

    set textColor(value: [number, number, number, number] | number) {
        this.textDrawParams.color = getColorFromValue(value);
    }

    set color(value: [number, number, number, number] | number) {
        this.titleColor = value;
        this.textColor = value;
    }

    // Functions
    draw(y: number) {
        super.draw(y);

        y += textOffset;
        drawTextLabel(this._textGxtName, [initialX, y], this.textDrawParams);
    }

    resetGxt() {
        super.resetGxt();
        mp.game.gxt.reset(this._textGxtName);
    }
};