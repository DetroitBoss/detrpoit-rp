import { dialogSystem } from "./chat";
import { system } from "./system";
import { CustomEvent } from "./custom.event";
import { FACTION_ID, TENCODES_LIST } from "../../shared/fractions";
import { menu } from "./menu";
import { tablet } from "./tablet";
import {fractionCfg} from "./fractions/main";


let ids = 0;


let allDispatches: Dispatch[] = []

export class Dispatch {
    id: number
    text: string
    pos: [number, number] | null
    factions: FACTION_ID[]
    fromPlayer: PlayerMp
    timestamp: number
    type: number
    callAnswered: PlayerMp
    callAnsweredName: string
    code: number
    isGlobal: boolean

    constructor(id: number, factions: number[], text: string, pos: {x: number, y: number} | null, type: number, fromPlayer?: PlayerMp, isGlobal?: boolean, code: number = 0) {
        this.id = id;
        this.text = text
        this.pos = [pos.x, pos.y]
        this.factions = factions
        this.fromPlayer = fromPlayer
        this.timestamp = system.timestamp
        this.type = type
        this.isGlobal = !!isGlobal
        this.code = code

        allDispatches.push(this)
        if(allDispatches.length > 60) allDispatches.shift()

        if(fromPlayer && mp.players.exists(fromPlayer) && fromPlayer.user) fromPlayer.user.lastDispatch = this.id

        this.factions.map(f => {
            tablet.reloadFractionData(f)
        })
    }

    isDispatchActual() {
        return (this.fromPlayer && mp.players.exists(this.fromPlayer) && this.fromPlayer.user && this.fromPlayer.user.sendDispatch && this.fromPlayer.user.lastDispatch == this.id) || this.fromPlayer == null;
    }

    answerByPlayer(player: PlayerMp) {
        if (!mp.players.exists(player) || !player.user) return;
        if (!this.factions.includes(player.user.fraction)) return;
        if (this.callAnswered && this.factions.includes(FACTION_ID.EMS) && this.factions.length === 1) 
            return player.notify('Данный вызов уже кем-либо принят')
        if (!this.isDispatchActual()) return player.notify('Вызов истёк или недоступен')
        if (player.user.answerDispatch) return player.notify('Принимать вызовы можно не чаще 1 раза в 15 секунд', 'error');
        player.user.answerDispatch = true;

        setTimeout(() => {
            if(mp.players.exists(player)) player.user.answerDispatch = false;
        }, 15000)


        this.callAnswered = player
        this.callAnsweredName = player.user.name

        mp.players.toArray().filter(q => q.user && this.factions.includes(q.user.fraction) && !q.user.afk).map(q => {
            if(!mp.players.exists(q)) return;
            if(!this.isGlobal) player.notifyWithPicture(`Вызов #${this.id}`, 'Диспетчер', `${player.user.name} принял вызов`, 'CHAR_CHAT_CALL', 10000);
        })
        if (!this.isGlobal) dialogSystem.postMessage(null, `faction_${player.user.fraction}`, `${player.user.name} принял вызов #${this.id}`);
        if (this.factions.includes(FACTION_ID.EMS) && this.factions.length === 1) CustomEvent.triggerClient(player, 'markDeath', this.pos)
        player.user.setWaypoint(this.pos[0], this.pos[1], 0, `Вызов #${this.id}`, true);
        this.fromPlayer.user.notify('Ваш вызов принят, ожидайте')

        this.factions.map(f => {
            tablet.reloadFractionData(f)
        })

    }

    static getByID(id: number) {
        return allDispatches.find(d => d.id == id)
    }

    static getFactionDispatches(factionID: FACTION_ID) {
        return allDispatches.filter(d => d.factions.includes(factionID))
    }

    static new(faction: FACTION_ID|FACTION_ID[], text: string, pos?: {x: number, y: number}, fromPlayer?: PlayerMp, isGlobal?: boolean, type: number = 0, code: number = 0) {
        if (typeof faction === "number") faction = [faction]

        const id = ++ids;
        const thisDispatch = new Dispatch(id, faction as number[], text, pos, type, fromPlayer, !!isGlobal, code)

        mp.players.toArray().filter(q => q.user && (faction as number[]).includes(q.user.fraction) && !q.user.afk).map(target => {
            target.notifyWithPicture(`Поступил ${isGlobal?'глобальный вызов':'вызов'} #${id}`, 'Диспетчер', text, 'CHAR_CHAT_CALL', 10000);
            if(pos){
                menu.accept(target, 'Принять данный вызов?', 'small').then(status => {
                    if(status) thisDispatch.answerByPlayer(target)
                })
            }
        })
        return thisDispatch
    }

}


CustomEvent.registerCef('dispatch:answer', (player, id: number) => {
    if(!player.user.fraction) return;
    const d = Dispatch.getByID(id)
    if(!d) return;
    d.answerByPlayer(player)
})



CustomEvent.registerClient('dispatch:call', (player, faction: number | number[], text: string, pos = true, timeSecond = 120) => {
    if(!player.user) return;

    // if(player.user.sendDispatch) return player.notify('Подождите некоторое время прежде чем отправлять новый вызов', 'error');


    player.user.sendDispatch = true
    Dispatch.new(faction, text, pos ? player.position : null, player)
    setTimeout(() => {
        if(mp.players.exists(player) && !!player.user) player.user.sendDispatch = false;
    }, 1000 * timeSecond)
})

export const invokeDispatchCode = (player: PlayerMp, code: number, global = false) => {
    const user = player.user;
    if(!user) return;
    const cfg = TENCODES_LIST[code];
    if(!cfg) return;
    if(!user.fraction) return;
    if(global && user.rank < 6) return player.notify('У вас недостаточно полномочий для отправки глобального кода');
    if(user.sendDispatch) return player.notify('Подождите некоторое время прежде чем отправлять новый вызов', 'error');
    user.sendDispatch = true;
    setTimeout(() => {
        if(mp.players.exists(player) && !!player.user) user.sendDispatch = false;
    }, 60000)
    Dispatch.new(global ? fractionCfg.gos.map(q => q.id) : player.user.fraction, `${global ? '[Глобально] ' : ''}${cfg[0]}: ${cfg[1]}`, player.position, player, global, 1, code)
}
CustomEvent.registerClientAndCef('dispatch:tencode', invokeDispatchCode)