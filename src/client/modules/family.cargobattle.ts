import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {FAMILY_CARGO_DISTANCE, FamilyCargoStages} from "../../shared/family.cargobattle";
import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {user} from "./user";


const player = mp.players.local

mp.events.add('family:cargoBattle:setGPS', (id:number) => {
    allBattles.get(id)?.setGPS()
})

CustomEvent.registerServer('family:cargoBattle:start', (x, y, z, id) => {
    if(!allBattles.get(id)) {
        new CargoBattle(id).start(x, y, z)
    }
    else {
        const b = allBattles.get(id)
        if(!b.mainBlip) b.start(x, y, z)
    }
});
CustomEvent.registerServer('family:cargoBattle:stop', (id) => CargoBattle.stop(id));
CustomEvent.registerServer('family:cargoBattle:stopAll', () => CargoBattle.stopAll());
CustomEvent.register('family:cargoBattle:stopAll', () => CargoBattle.stopAll());
CustomEvent.registerServer('family:cargoBattle:setStage', (id, stage, name?, points?, speed?) => CargoBattle.setStage(id, stage, name, points, speed));
CustomEvent.registerServer('family:cargoBattle:readyStart', (id, time) => {
    if(!allBattles.get(id)) (new CargoBattle(id)).readyStart(time)
    else {
        const b = allBattles.get(id)
        if(!b.readyStartBar || !b.readyStartBar.exists()) b.readyStart(time)
    }
})

let allBattles = new Map<number, CargoBattle>()
let viewCef:CargoBattle = null


export const isOnAnyCargoBattle = () => {
    let anyBattle = false
    allBattles.forEach(b => {
        if(b.isOnBattle()) anyBattle = true
    })
    return anyBattle
}

class CargoBattle {
    id: number
    mainBlip: BlipMp = null;
    addBlip: BlipMp = null;
    flashTimer: any = null;
    startPosition: {x:number, y:number, z:number} = null
    blipFlash: boolean = false;
    speed = 1000

    readyStartBar: TextTimerBar = null
    readyStartTime: number = 0
    readyStartTimeout: any = null

    constructor(id:number) {
        this.id = id
        allBattles.set(this.id, this)
    }

    setGPS() {
        if(this.startPosition) user.setWaypoint(this.startPosition.x, this.startPosition.y, this.startPosition.z, true);
    }

    readyStart(time?:number) {
        if(!time && this.readyStartTime <= 0) return this.endReadyStart()
        if(time) this.readyStartTime = time
        const title = `Подготовка к Высадке груза${user.isAdminNow()?' (ID: '+this.id+')':''}`
        const text = system.secondsToString(this.readyStartTime--)
        if(this.readyStartBar && this.readyStartBar.exists()) {
            this.readyStartBar.title = title
            this.readyStartBar.text = text
        }
        else this.readyStartBar = new TextTimerBar(title, text)

        if(this.readyStartTimeout) clearTimeout(this.readyStartTimeout)
        this.readyStartTimeout = setTimeout(() => this.readyStart(), 1000)
    }

    endReadyStart() {
        if(this.readyStartBar && this.readyStartBar.exists()) this.readyStartBar.destroy()
        if(this.readyStartTimeout) {
            clearTimeout(this.readyStartTimeout)
            this.readyStartTimeout = null
        }
        this.readyStartBar = null
    }

    static get viewCef() {
        return viewCef
    }
    static set viewCef(val) {
        viewCef = val
    }

    static stop(id:number) {
        allBattles.forEach((b,i) => {
            if(b.id == id && b.mainBlip) {
                b.stop()
                allBattles.delete(b.id)
            }
        })
    }
    static stopAll() {
        allBattles.forEach((b,i) => {
            if(b.mainBlip) b.stop()
        })
        allBattles = new Map();
    }
    static setStage(id:number, stage:number, name?: string, points?:number, speed?:number) {
        allBattles.forEach(b => {
            if(b.id == id) b.setStage(stage, name, points, speed)
        })
    }

    isVeryClosest() {
        let veryClosest:CargoBattle = this;
        let minimalDistance = system.distanceToPos(player.position, this.startPosition);
        allBattles.forEach(b => {
            if(b.id != this.id && b.mainBlip && system.distanceToPos(player.position, b.startPosition) < minimalDistance) veryClosest = b
        })
        return (veryClosest == this)
    }

    isOnBattle() {
        return this.mainBlip && this.startPosition && system.distanceToPos(player.position, this.startPosition) <= FAMILY_CARGO_DISTANCE
    }


    setStage(stage:number, name?: string, points?:number, speed?:number) {
        this.speed = speed
        if(this.isOnBattle()) {
            if(this.addBlip) {
                this.addBlip.destroy()
                this.addBlip = null
            }
        }
        else this.createAddBlip()
        if(stage == FamilyCargoStages.STAGE_NONE) {
            if(this.flashTimer) {
                clearInterval(this.flashTimer)
                this.flashTimer = null
            }
            this.mainBlip.setColour(2)
            if(CargoBattle.viewCef == this) {
                CustomEvent.triggerCef( 'hud:cargoBattle', false, '', 0)
            }
            return
        }
        if(stage == FamilyCargoStages.STAGE_FREEZE) {
            if(this.flashTimer) {
                clearInterval(this.flashTimer)
                this.flashTimer = null
            }
            this.mainBlip.setColour(26)
            if(this.isVeryClosest()) {
                CustomEvent.triggerCef( 'hud:cargoBattle', true, name, points, 0)
                CargoBattle.viewCef = this
            }
            return
        }
        if(stage == FamilyCargoStages.STAGE_ATTACK) {
            if(!this.flashTimer) this.startIntervalBlip()
            if(this.isVeryClosest()) {
                CustomEvent.triggerCef( 'hud:cargoBattle', true, name, points, speed)
                CargoBattle.viewCef = this
            }
            return
        }
    }

    createAddBlip() {
        if(this.addBlip) return;
        this.addBlip = mp.blips.new(103, new mp.Vector3(this.startPosition.x, this.startPosition.y, this.startPosition.z), {
            dimension: 0,
            shortRange: false,
            color: 2
        })
    }

    stop() {
        if(CargoBattle.viewCef == this) {
            CustomEvent.triggerCef( 'hud:cargoBattle', false, '', 0)
        }
        if(this.mainBlip) {
            this.mainBlip.destroy()
            this.mainBlip = null
        }
        if(this.addBlip) {
            this.addBlip.destroy()
            this.addBlip = null
        }
        if(this.flashTimer) {
            clearInterval(this.flashTimer)
            this.flashTimer = null
        }
        this.endReadyStart()
        this.startPosition = { x:0, y: 0, z: -3000}
    }

    start(x:number, y:number, z:number) {
        this.startPosition = { x, y, z }
        this.mainBlip = mp.blips.new(9, new mp.Vector3(x, y, z), {
            alpha: 150,
            dimension: 0,
            radius: FAMILY_CARGO_DISTANCE,
            shortRange: true,
            color: 2,
            name: 'Семейный груз'
        })

        this.createAddBlip()
    }

    startIntervalBlip() {
        this.flashTimer = setInterval(() => {
            if(!this.mainBlip) return;
            this.mainBlip.setAlpha(this.blipFlash?50:150)
            this.mainBlip.setColour(this.blipFlash?1:85)
            this.blipFlash = !this.blipFlash
        }, this.speed)
    }
}


