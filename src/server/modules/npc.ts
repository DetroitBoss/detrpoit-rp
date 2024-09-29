import {QuestDialog} from "../../shared/quests";
import {colshapeHandle, colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {quests} from "./quest";
import {ScaleformTextMp} from "./scaleform.mp";
import {system} from "./system";
import {User} from "./user";
import {familyCreateGUI} from "./families/create";
import {FamilyReputationType} from "../../shared/family";
import {user} from "../../client/modules/user";

CustomEvent.registerClient('bot:dialog:answer', (player, index: number) => {
    if (player.npcDialogHandle) player.npcDialogHandle(index);
})

export const npcDialog = {
    openFullDialog: (player: PlayerMp, data: QuestDialog, name: string, role: string) => {
        npcDialog.openDialog(player, data[0], data[1].answers, (index) => {
            if (!data[1].onAnswer) return npcDialog.closeDialog(player);
            const answer = data[1].onAnswer(index)
            if (!answer) return npcDialog.closeDialog(player);
            if (typeof answer !== "number") return npcDialog.openFullDialog(player, answer, name, role);
            const cfg = quests.getQuest(answer);
            if (!cfg || !cfg.botData || !cfg.botData.dialogStart) return npcDialog.closeDialog(player); 
            return npcDialog.openFullDialog(player, cfg.botData.dialogStart, name, role);
        }, name, role)
    },
    openDialog: (player: PlayerMp, message: string, npcKeys: string[], handle: (index: number) => any, npcName?: string, npcInfo?: string) => {
        CustomEvent.triggerClient(player, 'bot:dialog:load', message, npcKeys, npcName, npcInfo);
        player.npcDialogHandle = handle;
    },
    closeDialog: (player: PlayerMp) => {
        CustomEvent.triggerClient(player, 'bot:dialog:close');
    }
}

let dynamicPedsids = 0;
let dynamicPeds = new Map<number, PedMp>();
let dynamicPedsPos = new Map<number, Vector3Mp>();
export const createDynamicPed = (pos: Vector3Mp, heading: number, model: HashOrString, invincible:boolean = false, dimension = 0) => {
    dynamicPedsids++;
    const id = dynamicPedsids;

    let ped = mp.peds.new(typeof model === "number" ? model : mp.joaat(model), pos, {
        heading: heading,
        frozen: false,
        lockController: false,
        dynamic: true,
        invincible: invincible,
        dimension: dimension
    })
    ped.dimension = dimension;
    ped.controller = User.getNearestPlayerByCoord(pos, 150, dimension);
    dynamicPeds.set(id, ped)
    dynamicPedsPos.set(id, pos)
    return ped;
}

setInterval(() => {
    dynamicPeds.forEach((item, id) => {
        if (!item || !mp.peds.exists(item)) return dynamicPeds.delete(id);
        if (!item.controller && system.distanceToPos(item.position, dynamicPedsPos.get(id)) > 150) {
            item.destroy()
            return dynamicPeds.delete(id);
        }

        const isControllerStillExists = () => {
            return item.controller
                && mp.players.exists(item.controller)
                && item.dimension === item.controller.dimension
                && system.distanceToPos(item.position, item.controller.position) <= 150
        }

        item.controller = isControllerStillExists()
            ? item.controller
            : User.getNearestPlayerByCoord(item.position, 150, item.dimension);
    })
}, 1000)

export interface NpcParameters {
    Position: Vector3Mp,
    Heading: number,
    Model: string,
    Name: string
    Range?: number,
    Dimension?: number
}

export class NpcSpawn {
    private static newid = 0;

    private static get freeId() {
        this.newid++;
        return 0 + this.newid;
    }

    static at(id: number) {
        return this.pool.find(q => q.id === id);
    }
    static get forEach(){
        return this.pool.forEach
    }
    static get filter(){
        return this.pool.filter
    }
    static pool = <NpcSpawn[]>[];
    private _name: string;
    private _model: string;
    private _pos: Vector3Mp;
    private _h: number;
    private _r: number = 10;
    private _d: number = 0;
    readonly id: number;
    hanlde: (player: PlayerMp) => any;
    ped: PedMp;
    scaleform: ScaleformTextMp;
    colshape: colshapeHandle;
    get scaleformPos(){
        return new mp.Vector3(this._pos.x, this._pos.y, this._pos.z + 1.1)
    }

    constructor(pos: Vector3Mp, heading: number, model: string, name: string, handleFunc?: (player: PlayerMp) => any, range = 10, dimension = 0){
        this._pos = pos;
        this._h = heading;
        this._model = model;
        this._name = name;
        this._r = range;
        this._d = dimension;
        if (handleFunc) this.hanlde = handleFunc;
        this.id = NpcSpawn.freeId;
        NpcSpawn.pool.push(this)
        this.Recreate();
    }
    Recreate(){
        if (this.colshape) this.colshape.destroy();
        this.colshape = colshapes.new(this._pos, this._name, player => {
            if(this.hanlde) this.hanlde(player);
        }, {
            dimension: this._d,
            color: [0,0,0,0],
            radius: 2
        })
        if(this.ped && mp.peds.exists(this.ped)){
            this.ped.destroy();
        }
        this.ped = system.createPed(this._pos, this._h, this._model, true, true, this._d);
        if(this.scaleform && ScaleformTextMp.exists(this.scaleform)){
            this.scaleform.text = this._name;
            this.scaleform.position = this.scaleformPos;
            if (this.scaleform.dimension != this._d) this.scaleform.dimension = this._d;
            if (this.scaleform.range != this._r) this.scaleform.range = this._r;
        } else {
            this.scaleform = new ScaleformTextMp(this.scaleformPos, this._name, {
                dimension: this._d,
                range: this._r,
                type: 'front',
            })
        }
        
    }
}