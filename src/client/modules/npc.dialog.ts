import {STATIC_NPC_DATA} from "../../shared/static.npc";
import {QuestDialog} from "../../shared/quests";
import {colshapeHandle, colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui"
import {quests} from "./quests";
import {ScaleformTextMp} from "./scaleform.mp";
import {system} from "./system";
import {playAnimsEntity} from "./anim";
import {familyCreateGUI} from "../../server/modules/families/create";
import {FamilyReputationType} from "../../shared/family";
import {user} from "./user";


let currentDialogHandle: (index: number) => any;

CustomEvent.registerServer('bot:dialog:load', (message: string, npcKeys: string[], npcName: string, npcInfo: string) => {
    npcDialog.openDialog(message, npcKeys, (index) => {
        CustomEvent.triggerServer('bot:dialog:answer', index);
    }, npcName, npcInfo);

})
CustomEvent.registerServer('bot:dialog:close', () => {
    npcDialog.closeDialog();
})

mp.events.add('bot:dialog:answer', index => {
    if (currentDialogHandle) currentDialogHandle(index);
})

export const npcDialog = {
    openFullDialog: (data: QuestDialog, name: string, role: string, onEnd?: () => any) => {
        npcDialog.openDialog(data[0], data[1].answers, (index) => {
            if (!data[1].onAnswer || index === -1) {
                if (onEnd) onEnd();
                return npcDialog.closeDialog();
            }
            const answer = data[1].onAnswer(index)
            if (!answer) {
                if (onEnd) onEnd();
                return npcDialog.closeDialog();
            }
            if (typeof answer !== "number") return npcDialog.openFullDialog(answer, name, role, onEnd);
            const cfg = quests.getQuest(answer);
            if (!cfg || !cfg.botData || !cfg.botData.dialogStart) {
                if (onEnd) onEnd();
                return npcDialog.closeDialog();
            }
            return npcDialog.openFullDialog(cfg.botData.dialogStart, name, role, onEnd);
        }, name, role)
    },
    openDialog: (message: string, npcKeys: string[], handle: (index: number) => any, npcName?: string, npcInfo?: string) => {
        if (gui.currentGui !== "npcdialog") gui.setGui('npcdialog');
        CustomEvent.triggerCef('bot:dialog:load', message, npcKeys, npcName, npcInfo);
        currentDialogHandle = handle;
    },
    closeDialog: () => {
        gui.setGui(null);
    }
}

export class NpcSpawn {
    private static newid = 0;
    private _colshapeRange: number;
    private static get freeId() {
        this.newid++;
        return 0 + this.newid;
    }
    static at(id: number) {
        return this.pool.find(q => q.id === id);
    }
    static get forEach() {
        return this.pool.forEach
    }
    static get filter() {
        return this.pool.filter
    }
    static pool = <NpcSpawn[]>[];
    private _name: string;
    private _model: string;
    private _pos: Vector3Mp;
    get position() {
        return this._pos
    }
    private _h: number;
    private _r: number = 10;
    private _d: number = 0;
    get dimension() {
        return this._d
    }
    readonly id: number;
    private _handle: () => any;
    private playCustomAnim = false
    playAnim = async (seq: [string, string, number?][], upper = false, lopping = false) => {
        this.playCustomAnim = true;
        let res = await playAnimsEntity(this.ped, seq, upper, lopping)
        this.playCustomAnim = false;
        this.playDefaultAnim()
        return res;
    }
    playDefaultAnim = () => {
        if(this.playCustomAnim) return;
        if(!this.anim) return;
        if(typeof this.anim === 'string'){
            if (!mp.game.invoke('0x1BF094736DD62C2E', this.ped.handle, this.anim)) mp.game.invoke('0x142A02425FF02BD9', this.ped.handle, this.anim, -1, false);
        } else {
            if (!mp.game.invoke('0x1F0B79228E461EC9', this.ped.handle, this.anim[0], this.anim[1], 3)) playAnimsEntity(this.ped, [[this.anim[0], this.anim[1]]], false, false);
        }
    }
    anim: string | [string, string];
    greetUsed = false;
    greeting: {dist: number, speechName: string, voiceName: string, speechParam: string}
    get handle() {
        return this._handle
    }
    set handle(val) {
        this._handle = val
        this.Recreate();
    }
    ped: PedMp;
    scaleform: ScaleformTextMp;
    colshape: colshapeHandle;
    get scaleformPos() {
        return new mp.Vector3(this._pos.x, this._pos.y, this._pos.z + 1.1)
    }
    destroy() {
        if (this.ped && mp.peds.exists(this.ped)) this.ped.destroy();
        if (this.colshape) this.colshape.destroy();
        if (this.scaleform && ScaleformTextMp.exists(this.scaleform)) this.scaleform.destroy();
        NpcSpawn.pool.splice(NpcSpawn.pool.findIndex(q => q.id === q.id), 1);
    }
    constructor(pos: Vector3Mp, heading: number, model: string, name: string, handleFunc?: () => any, /** Радиус видимости имени НПЦ над головой */ range = 10, dimension = 0, rangeColshape = 2) {
        this._pos = pos;
        this._h = heading;
        this._model = model;
        this._name = name;
        this._r = range;
        this._d = dimension;
        this._colshapeRange = rangeColshape;
        if (handleFunc) this._handle = handleFunc;
        this.id = NpcSpawn.freeId;
        NpcSpawn.pool.push(this)
        this.Recreate();
    }
    Recreate() {
        if (this.colshape) this.colshape.destroy();
        if (this.handle) {
            this.colshape = colshapes.new(this._pos, this._name, () => {
                if (this.handle) this.handle();
            }, {
                dimension: this._d,
                color: [0, 0, 0, 0],
                radius: this._colshapeRange
            })
        }
        if (this.ped && mp.peds.exists(this.ped)) {
            this.ped.destroy();
        }
        this.ped = system.createPed(this._pos, this._h, this._model, this._d);
        if (this.scaleform && ScaleformTextMp.exists(this.scaleform)) {
            this.scaleform.text = this._name;
            this.scaleform.position = this.scaleformPos;
            if (this.scaleform.dimension != this._d) this.scaleform.dimension = this._d;
            if (this.scaleform.range != this._r) this.scaleform.range = this._r;
        } else {
            this.scaleform = new ScaleformTextMp(this.scaleformPos, this._name, {
                dimension: this._d,
                range: this._r,
                type: 'rotation',
            })
        }

    }
}



setInterval(() => {
    let closest = NpcSpawn.pool.filter(q => system.distanceToPos(q.position, mp.players.local.position) < 150 && (q.dimension === mp.players.local.dimension || q.dimension === -1));
    closest.map(async item => {
        if (!mp.peds.exists(item.ped)) return;
        if (!item.ped.handle) return;
        if(item.greeting){
            const grd = system.distanceToPos(item.position, mp.players.local.position);
            if(!item.greetUsed){
                if(grd <= item.greeting.dist){
                    item.greetUsed = true;
                    mp.game.audio.requestAmbientAudioBank(item.greeting.voiceName, true);
                    mp.game.audio.playAmbientSpeechWithVoice(item.ped.handle, item.greeting.speechName, item.greeting.voiceName, item.greeting.speechParam, false);
                }
            } else if(grd > (item.greeting.dist * 5)){
                item.greetUsed = false;
            }
        }
        item.playDefaultAnim()
    })
}, 1000)


STATIC_NPC_DATA.map(npc => {
    const item = new NpcSpawn(new mp.Vector3(npc.x, npc.y, npc.z), npc.h, npc.model, npc.name, null, 10, npc.d || 0);
    if (npc.anim) item.anim = npc.anim
    if(npc.dialog){
        item.handle = () => {
            npcDialog.openFullDialog(npc.dialog, npc.name, npc.role)
        }
    }
})