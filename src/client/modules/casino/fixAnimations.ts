import {CASINO_INTERIORS_IDS_IN, ENTER_ANIM} from "../../../shared/casino/main";
import {getNearestRouletteTable, getRouletteObject} from "./roulette";
import {getNearestSlotsMachine} from "./slots";
import {nearestDiceTableObject} from "./dice";
import {user} from "../user";

let playersHandles = new Map<number, boolean>();
const inCasinoInt = () => {
    const {x,y,z} = mp.players.local.position;
    return CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
}
setInterval(() => {
    if(!user.login) return;
    if(!inCasinoInt()) return;
    mp.players.forEachInStreamRange(target => {
        if(target.id === mp.players.local.id) return;
        const id = target.remoteId
        const inAnim = target.isPlayingAnim(ENTER_ANIM[0], ENTER_ANIM[1], 3) || target.getVariable('casino:freeze')

        if(inAnim == playersHandles.has(id)) return;

        disableCasinoCollision(target, inAnim)

        if(!inAnim) playersHandles.delete(id)
        else playersHandles.set(id, true)

    })
}, 200)

export const disableCasinoCollision = (target: PlayerMp, status: boolean) => {
    // Рулетка
    const tableId = getNearestRouletteTable(target);
    if(tableId){
        const table = getRouletteObject(tableId);
        if(table && table.handle) target.setNoCollision(table.handle, !status)
    }
    // Слот
    const slot = getNearestSlotsMachine(target);
    if(slot && slot.handle) target.setNoCollision(slot.handle, !status);
    // Кости
    const dice = nearestDiceTableObject(target);
    if(dice && dice.handle) target.setNoCollision(dice.handle, !status);
}