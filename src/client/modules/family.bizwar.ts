import {CustomEvent} from "./custom.event";
import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {system} from "./system";
import {IBizWarPoint} from "../../shared/bizwar";
import {user} from "./user";

let currentBizWar: BizWarBattle = null;
let blip: BlipMp;

CustomEvent.registerServer('family:bizWar:readyStart', (name: string, time: number, battlePoint: IBizWarPoint) => {
    if (currentBizWar) {
        if (!currentBizWar.readyStartBar || !currentBizWar.readyStartBar.exists()) currentBizWar.readyStart(time)
    }
    else {
        currentBizWar = new BizWarBattle(name, battlePoint);
        currentBizWar.readyStart(time);
    }
    //blip = system.createBlip(9, 3, battlePoint, "Война за бизнес");
    blip = mp.blips.new(9, new mp.Vector3(battlePoint.x, battlePoint.y, battlePoint.z),
        {
            color: 3,
            rotation: 0,
            dimension: 0,
            radius: battlePoint.r,
        });
    // blip = mp.blips.new(5, new mp.Vector3(battlePoint.x, battlePoint.y, battlePoint.z), {
    //     shortRange: true,
    //     radius: battlePoint.r,
    //     scale: 0.8,
    //     color: 3,
    //     name: "Война за бизнес",
    // })
})

CustomEvent.registerServer('family:bizWar:readyStop', () => {
    if (currentBizWar) {
        currentBizWar.endReadyStart();
    }
})

class BizWarBattle {
    public readyStartBar: TextTimerBar = null;
    private _readyStartTime: number = 0;
    private _readyStartTimeout: any = null;
    
    constructor(
        public readonly name: string, 
        private readonly _battlePoint: IBizWarPoint
    ){}
    
    public readyStart(time?: number): void {
        if (!time && this._readyStartTime <= 0) return this.endReadyStart()
        if (time) this._readyStartTime = time
        const title = `Подготовка к битве за бизнес: ${this.name}`
        const text = system.secondsToString(this._readyStartTime--)
        if (this.readyStartBar && this.readyStartBar.exists()) {
            this.readyStartBar.title = title
            this.readyStartBar.text = text
        }
        else this.readyStartBar = new TextTimerBar(title, text)

        if (this._readyStartTimeout) clearTimeout(this._readyStartTimeout)
        this._readyStartTimeout = setTimeout(() => this.readyStart(), 1000)
    }
        
    public endReadyStart(): void {
        if (this.readyStartBar && this.readyStartBar.exists()) this.readyStartBar.destroy()
        if (this._readyStartTimeout) {
            clearTimeout(this._readyStartTimeout)
            this._readyStartTimeout = null
        }
        this.readyStartBar = null;
        if (blip) {
            blip.destroy();
            blip = null
        }
    }
}
