import {clamp, getColorFromValue} from "../util";
import * as coordsAndSize from "../coordsAndSizes";
import {TimerBarBase} from "./TimerBarBase";
import {timerBarPool} from "..";

const { drawSprite } = mp.game.graphics;
const { checkpointOffsetY, checkpointBaseX, checkpointWidth, checkpointHeight, checkpointOffsetX } = coordsAndSize.default

export class CheckpointTimerBar extends TimerBarBase {
    static state = {
        inProgress: 0,
        completed: 1,
        failed: 2
    };
    private _numCheckpoints: number;
    private _color: [number, number, number, number];
    private _inProgressColor: [number, number, number, number];
    private _failedColor: [number, number, number, number];
    _checkpointStates: {[param: string]: any};
    constructor(title: string, numCheckpoints: number) {
        super(title);

        this._thin = true;
        this._color = [255, 255, 255, 255];
        this._inProgressColor = [255, 255, 255, 51];
        this._failedColor = [0, 0, 0, 255];
        this._checkpointStates = {};
        this._numCheckpoints = clamp(numCheckpoints, 0, 16);
        timerBarPool.add(this)
    }

    // Properties
    get numCheckpoints() {
        return this._numCheckpoints;
    }

    get color() {
        return this._color;
    }

    get inProgressColor() {
        return this._inProgressColor;
    }

    get failedColor() {
        return this._failedColor;
    }

    set color(value: [number, number, number, number] | number) {
        this._color = getColorFromValue(value);
    }

    set inProgressColor(value) {
        this._inProgressColor = getColorFromValue(value);
    }

    set failedColor(value) {
        this._failedColor = getColorFromValue(value);
    }

    // Functions
    setCheckpointState(index: number, newState: any) {
        if (index < 0 || index >= this._numCheckpoints) {
            return;
        }

        this._checkpointStates[index] = newState;
    }

    setAllCheckpointsState(newState: any) {
        for (let i = 0; i < this._numCheckpoints; i++) {
            this._checkpointStates[i] = newState;
        }
    }

    get checkpointArrayBoolean(){
        let res: boolean[] = [];
        for (let i = 0; i < this._numCheckpoints; i++) {
            res.push(!!this._checkpointStates[i])
        }
        return res;
    }

    draw(y: number) {
        super.draw(y);
        y += checkpointOffsetY;

        for (let i = 0, cpX = checkpointBaseX; i < this._numCheckpoints; i++) {
            const drawColor = this._checkpointStates[i] ? (this._checkpointStates[i] === CheckpointTimerBar.state.failed ? this._failedColor : this._color) : this._inProgressColor;
            drawSprite("timerbars", "circle_checkpoints", cpX, y, checkpointWidth, checkpointHeight, 0.0, drawColor[0], drawColor[1], drawColor[2], drawColor[3])

            cpX -= checkpointOffsetX;
        }
    }
};