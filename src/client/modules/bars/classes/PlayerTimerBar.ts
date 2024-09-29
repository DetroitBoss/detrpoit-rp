import {drawTextLabel, textJustification} from "../util";
import * as coordsAndSize from "../coordsAndSizes";
import {TextTimerBar} from "./TextTimerBar";
import {timerBarPool} from "..";

const { initialX, playerTitleScale, playerTitleOffset, textOffset, titleWrap } = coordsAndSize.default

export class PlayerTimerBar extends TextTimerBar {
    constructor(title: string, text: string) {
        super(title, text);

        this.titleDrawParams = {
            font: 4,
            color: [240, 240, 240, 255],
            scale: playerTitleScale,
            justification: textJustification.right,
            wrap: titleWrap,
            shadow: true
        };
        timerBarPool.add(this)
    }

    // Functions
    draw(y: number) {
        super.drawBackground(y);

        drawTextLabel(this._titleGxtName, [initialX, y + playerTitleOffset], this.titleDrawParams);
        drawTextLabel(this._textGxtName, [initialX, y + textOffset], this.textDrawParams);
    }
};