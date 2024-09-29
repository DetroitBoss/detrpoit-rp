import {CustomEvent} from "./custom.event";

class FPSCalculator {
    private _fps = 0;

    constructor() {
        let lastFrameCount = this.getFrameCount();
        setInterval(() => {
            this._fps = this.getFrameCount() - lastFrameCount;
            lastFrameCount = this.getFrameCount();
        }, 1000);
    }

    public get fps() {
        return this._fps;
    }

    private getFrameCount() {
        return mp.game.invoke('0xFC8202EFC642E6F2') as number; // '0xFC8202EFC642E6F2' is a method of GTA5 which returns the frame count since the game was started (see http://www.dev-c.com/nativedb/func/info/fc8202efc642e6f2 for ref.)
    }
}

export const FPS = new FPSCalculator();

let fpsList: number[] = [];

setInterval(() => {
    fpsList.push(FPS.fps);
}, 10000);

setInterval(() => {
    let min = Math.min(...fpsList)
    let max = Math.max(...fpsList)
    let sum = 0;
    fpsList.map(q => {
        sum+=q;
    })
    let average = Math.floor(sum / fpsList.length);
    //CustomEvent.triggerServer('debug:fpsData', min, max, average, sum, fpsList.length)
    fpsList = [];
}, 10 * 60000)