import {Family} from "../family";
import {system} from "../../system";
import {
    CARGOBATTLE_OBJECTS,
    FAMILY_CARGO_DISTANCE,
    FAMILY_CARGO_POINTS_FOR_ONE_TICK,
    FAMILY_CARGO_TIME_TO_TIMER,
    FAMILY_CARGO_VALUE_FOR_WIN,
    FAMILY_TIMEOUT_AFTER_CARGO_BATTLE,
    FamilyCargoStages,
    FamilyCargoStartFamilies,
    FamilyCargoStartMembers,
    FamilyCargoTime
} from "../../../../shared/family.cargobattle";
import {CustomEvent} from "../../custom.event";
import {colshapeHandle, colshapes} from "../../checkpoints";
import { getX2Param } from "../../usermodule/static";
import { gui } from "../../gui";


mp.events.add('playerDeath', (player) => {
    CargoBattleFamilyQuest.all.forEach(cb => {
        cb.attackersInside.map(p => {
            if(p == player && mp.players.exists(p)) cb.exitZone(p, true)
        })
    })
});

mp.events.add('playerQuit', (player) => {
    CargoBattleFamilyQuest.all.forEach(cb => {
        cb.attackersInside.map(p => {
            if(p == player && mp.players.exists(p)) cb.exitZone(p, true)
        })
    })
});

export class CargoBattleFamilyQuest {
    static all = new Map<number, CargoBattleFamilyQuest>()
    static restartTimeout:NodeJS.Timeout = null
    static stopAll() {
        CargoBattleFamilyQuest.all.forEach(cb => cb.destroy())
        CargoBattleFamilyQuest.all = new Map();
    }

    familyInGame: Family[] = []

    isEnd: boolean = false

    readonly id: number
    constructor() {
        this.id = system.personalDimension
        CargoBattleFamilyQuest.all.set(this.id, this)
    }

    destroy() {
        if(this.isEnd) return;
        this.isEnd = true

        if(!CargoBattleFamilyQuest.all.get(this.id)) return;
        if([...CargoBattleFamilyQuest.all].length <= 1 && !CargoBattleFamilyQuest.restartTimeout) startTimeout()

        if(this.readyTimeout) {
            clearTimeout(this.readyTimeout)
            this.readyTimeout = null;
        }

        this.clearAttackTimeout()

        if(this.colshape) {
            this.colshape.destroy()
            this.colshape = null
        }
        if(this.currentObject) {
            this.currentObject.destroy()
            this.currentObject = null
        }
        CargoBattleFamilyQuest.all.delete(this.id)
        this.functionToAllFamilies(player => {
            CustomEvent.triggerClient(player, 'family:cargoBattle:stop', this.id)
        })
    }

    name = 'Высадка груза'
    minimumStartMembers = FamilyCargoStartMembers
    minimumStartFamilies = FamilyCargoStartFamilies
    timeToStart = FamilyCargoTime

    readyStarted = 0
    readyTimeout: NodeJS.Timeout
    startTime: number

    colshape: colshapeHandle
    position: {x:number, y:number, z: number}

    attackFamily: Family;
    attackFamilyStart: number;
    attackFamilyPoints: number;
    attackTimeout: NodeJS.Timeout;
    attackSpeed: number = 0;
    attackersInside: PlayerMp[] = []

    currentObject: ObjectMp
    currentObjectInfo: any

    stage: number;
    attackFamilyStartPoints: number;

    players: {
        player: PlayerMp,
        points: number
    }[] = []


    /** Время последнего добавления очков семье - победителю */
    lastPointsAdd: number


    /** Запуск подготовки к Высадке груза для семей */
    async startReady(isAdminStart = false) {
        return new Promise((resolve, reject) => {
            if(isAdminStart) { }
            if([...CargoBattleFamilyQuest.all].length > 1) {
                this.destroy()
                return reject('Еще не закончилась предыдущая игра')
            }
            this.familyInGame = []
            let families: { family: Family, count: number }[] = []
            mp.players.toArray().map(player => {
                if(!player.user || !player.user.family || player.user.afk || (player.user.family.lastCargoBattleWin && (system.timestamp -  player.user.family.lastCargoBattleWin)/60 < FAMILY_TIMEOUT_AFTER_CARGO_BATTLE)) return;
                const index = families.findIndex(f => f.family == player.user.family)
                if(index == -1) families.push({ family: player.user.family, count: 1 })
                else families[index].count++
            })
            families = families.filter(f => f.count >= this.minimumStartMembers)
            if(families.length < this.minimumStartFamilies) {
                this.destroy()
                return reject('Недостаточно семей / членов семей');
            }
            this.familyInGame = families.map(f =>f.family)
            this.setReadyTimeout()
            return resolve(true)
        })
    }

    static clearRestartTimeout() {
        if(CargoBattleFamilyQuest.restartTimeout) {
            clearTimeout(CargoBattleFamilyQuest.restartTimeout);
            CargoBattleFamilyQuest.restartTimeout = null
        }
    }

    private setReadyTimeout() {
        this.readyStarted = system.timestamp
        CargoBattleFamilyQuest.clearRestartTimeout()
        this.functionToAllFamilies(player => {
            CustomEvent.triggerClient(player, 'family:cargoBattle:readyStart', this.id, this.timeToStart*60)
        })
        this.readyTimeout = setTimeout(() => {
            this.readyStarted = 0
            this.start()
        }, 60000*this.timeToStart)
    }



    /** Запуск Высадки груза для семей */
    start() {
        if(!this.familyInGame.length) {
            Family.getAll().map(f => {
                if(!f.lastCargoBattleWin || (system.timestamp -  f.lastCargoBattleWin)/60 >= FAMILY_TIMEOUT_AFTER_CARGO_BATTLE) this.familyInGame.push(f)
            })
            if(!this.familyInGame.length) return this.destroy();
        }
        let allObjects = CARGOBATTLE_OBJECTS
        CargoBattleFamilyQuest.all.forEach(cb => {
            if(allObjects.includes(cb.currentObjectInfo)) allObjects.splice(allObjects.indexOf(cb.currentObjectInfo), 1)
        })
        if(!allObjects.length) {
            this.destroy()
            return system.debug.error('При попытке старта высадки груза не оказалось свободной локации')
        }
        CargoBattleFamilyQuest.clearRestartTimeout()

        const obj = system.randomArrayElement(allObjects)
        this.currentObjectInfo = obj
        this.position = {x:obj.x, y:obj.y, z:obj.z}
        this.startTime = system.timestamp

        this.currentObject = mp.objects.new(obj.model, new mp.Vector3(obj.x, obj.y,  obj.z), {
            dimension: 0,
            rotation: new mp.Vector3(obj.rx, obj.ry, obj.rz)
        })
        this.colshape = colshapes.new(new mp.Vector3(obj.x, obj.y, obj.z), '', () =>{ }, {
            onenter: true,
            dimension: 0,
            radius: FAMILY_CARGO_DISTANCE,
            type: -1,
            onEnterHandler: player => this.enterZone(player),
            onExitHandler: player => this.exitZone(player)
        })
        this.functionToAllFamilies(player => this.addPlayer(player), true)
    }

    get calcTimeToStart() {
        return this.readyStarted ? this.timeToStart*60 - (system.timestamp - this.readyStarted) : 1
    }

    addPlayer(player: PlayerMp) {
        if(this.isEnd) return;
        if(!player.user.isAdminNow() && (!mp.players.exists(player) || !player.user || !player.user.family || !this.familyInGame.includes(player.user.family))) return;
        if(this.readyStarted) CustomEvent.triggerClient(player, 'family:cargoBattle:readyStart', this.id, this.calcTimeToStart)
        else CustomEvent.triggerClient(player, 'family:cargoBattle:start', this.position.x, this.position.y, this.position.z, this.id)
    }

    private enterZone(player: PlayerMp) {
        if(this.isEnd) return;
        if(!player.user.isAdminNow() && player.user && player.user.family && player.user.health > 0) {
            if(!this.familyInGame.includes(player.user.family)) return player.notify('Ваша семья не может принять участие в захвате груза')
            if(!this.players.find(p => p.player == player)) this.players.push({player: player, points: 0})
            this.attackersInside.push(player)
            this.checkZoneOwner()
        }
    }

    // stopAll(player: PlayerMp) {
    //
    // }

    private checkZoneOwner() {
        if(this.isEnd) return;
        let familiesInZone: Family[] = []

        this.attackersInside.map(attacker => {
            if(!attacker.user || !attacker.user.family) return this.exitZone(attacker, false)
            if (!attacker.user.dead && (!getX2Param("testserver") || !attacker.user.isAdminNow())) {
                if(!familiesInZone.find(z => attacker.user.family == z)) familiesInZone.push(attacker.user.family)
            }
        })

        switch (familiesInZone.length) {
            case 0:
                this.noOneAttack()
                break
            case 1:
                this.familyAttack(familiesInZone[0])
                break
            default:
                this.freezeAttack()
                break;
        }
    }

    private addWinnerPoints(family:Family) {
        if(this.isEnd) return;
        if(!this.lastPointsAdd) return this.lastPointsAdd = system.timestamp
        const winners = this.players.filter(p => p.player.user && p.player.user.family == family && !p.player.user.dead && (!p.player.user.isAdminNow()))
        winners.map(p => {
            p.points += (FAMILY_CARGO_POINTS_FOR_ONE_TICK*((system.timestamp-this.lastPointsAdd)*1000/this.attackSpeed))/winners.length
        })
        this.lastPointsAdd = system.timestamp
    }

    private freezeAttack() {
        if(this.isEnd) return;
        if(this.stage == FamilyCargoStages.STAGE_FREEZE) return;
        this.addWinnerPoints(this.attackFamily)
        this.lastPointsAdd = 0
        this.attackFamilyPoints = Math.floor((system.timestamp - this.attackFamilyStart)*1000/this.attackSpeed ) + this.attackFamilyStartPoints

        this.attackSpeed = 0
        this.clearAttackTimeout()
        this.setBattleStage(FamilyCargoStages.STAGE_FREEZE)
    }

    private clearAttackTimeout() {
        if(this.attackTimeout) {
            clearTimeout(this.attackTimeout)
            this.attackTimeout = null
        }
    }

    private noOneAttack() {
        if(this.isEnd) return;
        this.lastPointsAdd = 0
        this.players = []
        this.attackFamily = null
        this.attackFamilyPoints = 0
        this.clearAttackTimeout()
        this.setBattleStage(FamilyCargoStages.STAGE_NONE)
    }

    private setBattleStageToPlayer(player:PlayerMp, stage: number) {
        CustomEvent.triggerClient(player, 'family:cargoBattle:setStage', this.id, stage, this.attackFamily?this.attackFamily.name:' ', this.attackFamilyPoints, this.attackSpeed)
    }

    private setBattleStage(stage: number) {
        if(this.isEnd) return;
        this.stage = stage;
        this.functionToAllFamilies((player) => this.setBattleStageToPlayer(player, stage))
    }

    private familyAttack(family: Family) {
        if(!family || this.isEnd) return;
        // if(this.attackFamily == family) return;
        if(this.attackTimeout && this.attackFamily == family) return;
        if(this.attackFamily != family) {
            this.attackFamilyPoints = 0
            this.attackFamilyStartPoints = 0
            this.attackFamily = family
        }
        if(this.stage == FamilyCargoStages.STAGE_FREEZE) {
            this.attackFamilyStartPoints = this.attackFamilyPoints
            this.attackFamilyStart = system.timestamp
        }
        this.addWinnerPoints(family)
        this.attackFamilyStart = system.timestamp

        this.updateAttackSpeed()
        this.clearAttackTimeout()
        this.attackTimeout = setTimeout(() => this.setWinner(), (100*this.attackSpeed) - (this.attackFamilyStartPoints * this.attackSpeed))
        this.setBattleStage(FamilyCargoStages.STAGE_ATTACK)
    }

    private updateAttackSpeed() {
        this.attackSpeed = 2000 - (system.timestamp - this.startTime)*0.01
        if(this.attackSpeed < 400) this.attackSpeed = 400
    }

    exitZone(player: PlayerMp, check = true) {
        if(this.isEnd) return;
        if(this.attackersInside.includes(player)) this.attackersInside.splice(this.attackersInside.indexOf(player), 1)
        if(check) this.checkZoneOwner()
    }

    private setWinner() {
        if(this.attackFamily && this.attackFamily.id) {
            this.addWinnerPoints(this.attackFamily)
            this.attackFamily.cargo += FAMILY_CARGO_VALUE_FOR_WIN
            this.attackFamily.wins++
            this.functionToAllFamilies(player => player.user.notify(`Семья ${this.attackFamily.name} победила в захвате груза`))
            let allScores = 0
            this.players.filter(p => mp.players.exists(p.player) && p.player.user && p.player.user.family === this.attackFamily).map(winner => {
                const win = Math.round(winner.points)
                if(!win) return;
                winner.player.notify(`Вы получили ${win} семейных очков за участие в победном захвате груза`)
                winner.player.user.familyScores += win
                allScores += win
            })
            this.attackFamily.lastCargoBattleWin = system.timestamp
            this.attackFamily.addPoints(allScores)
        }
        this.destroy()
    }

    private functionToAllFamilies(func: (player: PlayerMp) => void, onlyInGame: boolean=true) {
        mp.players.toArray().map(q => { return q.user && (q.user.isAdminNow() || (q.user.family && ((onlyInGame && this.familyInGame.includes(q.user.family)) || !onlyInGame))) && func(q) });
    }
}
gui.chat.registerCommand('starttestfam', (player) => {
    new CargoBattleFamilyQuest().startReady().catch(() => startTimeout(3000));
});

const startTimeout = (time = FAMILY_CARGO_TIME_TO_TIMER * 60000) => {
    if(time <= 0) return;
    if(CargoBattleFamilyQuest.restartTimeout) clearTimeout(CargoBattleFamilyQuest.restartTimeout)

    CargoBattleFamilyQuest.restartTimeout = setTimeout(() => {
        const time = new Date()
        if(time.getHours() < 10) return startTimeout()
        new CargoBattleFamilyQuest().startReady().catch(() => startTimeout(60000*20))
    }, time)
}
startTimeout()