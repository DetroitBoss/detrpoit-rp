import {inventoryShared} from "../../shared/inventory";
import {MINING_VIDEOCARDS_ATTACHLIST} from "../../shared/mining";
import {user} from "./user";
import {CustomEvent} from "./custom.event";
import {getInteriorHouseById} from "../../shared/inrerriors";

const player = mp.players.local;

let attachedMiningProps = new Map<number, ObjectMp[]>();
let attachedMiningPropMain = new Map<number, ObjectMp>();

CustomEvent.registerServer('mining:data', (id: number, int: number, cards: number[], powers: number[]) => {
    if(!cards || !powers) clearMiningProps(id);
    else renderMiningProps(id, int, cards, powers);
})

setInterval(() => {
    if(!user.login) return;
    attachedMiningPropMain.forEach((item, id) => {
        if(!item || !mp.objects.exists(item) || !item.handle || item.dimension !== player.dimension) clearMiningProps(id)
    })
}, 5000)

const clearMiningProps = (id: number, onlyAttach = false) => {
    if(attachedMiningProps.has(id)){
        attachedMiningProps.get(id).map(item => {
            if(mp.objects.exists(item)) item.destroy()
        })
        attachedMiningProps.delete(id)
    }
    if(!onlyAttach) {
        if(attachedMiningPropMain.get(id)) attachedMiningPropMain.get(id).destroy()
        attachedMiningPropMain.delete(id)
    }

}

const renderMiningProps = (id: number, int: number, cards: number[], powers: number[]) => {
    const pos = getInteriorHouseById(int);
    const propItem = attachedMiningPropMain.has(id) ? attachedMiningPropMain.get(id) : mp.objects.new(mp.game.joaat('pp_fermam'), new mp.Vector3(pos.mining.x, pos.mining.y, pos.mining.z), {
        dimension: id,
        rotation: new mp.Vector3(0,0, pos.mining.h)
    })
    if(!attachedMiningPropMain.has(id)) attachedMiningPropMain.set(id, propItem);
    clearMiningProps(id, true);
    let objects: ObjectMp[] = [];
    const heading = propItem.getHeading()
    // propItem.setModel()
    cards.map((q, i) => {
        if(!q) return;
        const cfgItem = inventoryShared.get(q);
        if(!cfgItem) return;
        const prop = cfgItem.prop;
        const cfgOffset = MINING_VIDEOCARDS_ATTACHLIST.find(z => z.props.includes(prop));
        if(!cfgOffset) return;
        const offset = cfgOffset.attachPositions[i];
        if(!offset) return;
        const pos = propItem.getOffsetFromInWorldCoords(offset[0], offset[1], offset[2]);
        if(!pos) return;

        objects.push(mp.objects.new(mp.game.joaat(prop), new mp.Vector3(pos.x, pos.y, pos.z), {
            rotation: new mp.Vector3(90,0, heading + 180),
            dimension: propItem.dimension
        }))
    })
    powers.map((q, i) => {
        if(!q) return;
        const cfgItem = inventoryShared.get(q);
        if(!cfgItem) return;
        const prop = cfgItem.prop;
        const cfgOffset = MINING_VIDEOCARDS_ATTACHLIST.find(z => z.props.includes(prop));
        if(!cfgOffset) return;
        const offset = cfgOffset.attachPositions[i];
        if(!offset) return;
        const pos = propItem.getOffsetFromInWorldCoords(offset[0], offset[1], offset[2]);
        if(!pos) return;

        objects.push(mp.objects.new(mp.game.joaat(prop), new mp.Vector3(pos.x, pos.y, pos.z), {
            rotation: new mp.Vector3(0,0, heading),
            dimension: propItem.dimension
        }))
    })
    attachedMiningProps.set(id, objects);

}