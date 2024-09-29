import {user} from "./user";
import {system} from "./system";
import EntityType = RageEnums.EntityType;
import {gui} from "./gui";
import {debug} from "./admin";
import {CustomEvent} from "./custom.event";

const localPlayer = mp.players.local;
const camera = mp.cameras.new("gameplay");

const browser = mp.browsers.new(`http://package/cef/sound.html`)

export const getPanEntity = (entity: EntityMp) => {
    return getPan(entity.position, entity);
}

function easeInOutQuart(x: number): number {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

if(typeof mp.storage.data.boomboxSound !== "number") mp.storage.data.boomboxSound = 100;

export const getPan = (target_pos: {x: number, y: number, z: number}, entity: EntityMp) => {
    if(!target_pos) return 0;

    if (entity.type === 'vehicle' && mp.players.local.vehicle === entity) {
        return 0;
    }

    let cam_pos = mp.players.local.position;
    let cam_vector = camera.getDirection();
    let target_vector = {x: target_pos.x - cam_pos.x, y: target_pos.y - cam_pos.y, z: target_pos.z - cam_pos.z}
    let dx = target_vector.x * cam_vector.x + target_vector.y * cam_vector.y;
    let dy = Math.sqrt(cam_vector.x * cam_vector.x + cam_vector.y * cam_vector.y) * Math.sqrt(target_vector.x * target_vector.x + target_vector.y * target_vector.y);
    let s = cam_vector.x * (target_pos.y - cam_pos.y) - cam_vector.y * (target_pos.x - cam_pos.x);
    let a = 1;
    if(s > 0) a=-1;
    else if(!s) a=0;
    let pan = Math.sqrt(1 - (dx / dy) * (dx / dy)) * a;
    if(user.isAdminNow() && debug) gui.drawText3D(`pan: ${pan.toFixed(2)} \n cam_pos x: ${cam_pos.x.toFixed(1)}, y: ${cam_pos.y.toFixed(1)}, z: ${cam_pos.z.toFixed(1)}\n cam_vector x: ${cam_vector.x.toFixed(1)}, y: ${cam_vector.y.toFixed(1)}, z: ${cam_vector.z.toFixed(1)} \n target_vector x: ${target_vector.x.toFixed(1)}, y: ${target_vector.y.toFixed(1)}, z: ${target_vector.z.toFixed(1)}`, target_pos.x, target_pos.y, target_pos.z)
    return Math.sqrt(1 - (dx / dy) * (dx / dy)) * a;
}

export class Sound {
    private _pos: {x: number, y: number, z: number};
    private _url: string;
    private _volume: number;
    private _max_dist: number;
    private _ent: EntityMp;
    startpos = 0
    private started = false
    readonly id: string;
    static list = new Map<string, Sound>()
    static get(id: string){
        return this.list.get(id)
    }
    get pos(){
        let res:  {x: number, y: number, z: number}
        if(this._ent) {
            if(this.exists) res = this._ent.getCoords(true);
        } else res = this._pos
        return res;
    }
    onEndHandles:((err:boolean)=>void)[] = []
    onEnd(): Promise<boolean> {
        return new Promise((resolve) => {
            this.onEndHandles.push(resolve);
        })
    }
    get exists(){
        // Если это просто координаты - то мы вернём true
        if(!this._ent) return false;
        const type = this._ent.type;
        const ent:any = this._ent;
        if(type === 'player') return mp.players.exists(ent) && ent.handle;
        if(type === 'vehicle') return mp.vehicles.exists(ent) && ent.handle;
        if(type === 'object') return mp.objects.exists(ent) && ent.handle;
        if(type === 'ped') return mp.peds.exists(ent) && ent.handle;
        // Неизвестный вариант рейдж объекта, поэтому вернём просто проверку на handle
        return !!ent.handle;
    }
    get pan(){
        if(!this._max_dist) return 0;
        // let d = Math.min(2, system.distanceToPos(mp.players.local.position, this.pos));
        // if(d < 1.5) return 0;
        // const pan = getPan(this.pos)
        // if(d < 2){}
        return getPan(this.pos, this._ent);
    }
    get volume(){
        let mult = 1;
        if(this.id.indexOf('box_player_') === 0) mult = (typeof mp.storage.data.boomboxSound === "number" ? mp.storage.data.boomboxSound : 100) / 100;
        if(!this._max_dist) return this._volume * mult;
        if(!this.pos) return 0;
        let x = (system.distanceToPos(mp.players.local.position, this.pos) / this._max_dist);
        let q = 1 - easeInOutQuart(x)

        const inVehicleMultiplier = (this._ent.type === 'vehicle')
            ? mp.players.local.vehicle === this._ent
                ? 1 : 0.5
            : 1;

        return this._volume * q * mult * inVehicleMultiplier;
    }
    set volume(val){
        this._volume = val
    }
    private _paused = false;
    get paused(){
        return this._paused
    }
    set paused(val){
        this._paused = val;
        CustomEvent.triggerCef('sound:setPaused', this.id, val)
    }
    destroy() {
        CustomEvent.triggerCef('sound:stop', this.id)
        Sound.list.delete(this.id);
    }
    constructor(id: string, url: string, volume: number, data: {
        max_dist?: number,
        startpos?: number,
        pos?: {x: number, y: number, z: number},
        entity?: {
            type: EntityType,
            id: number,
        }
    }){
        this.id = id || system.randomStr(6)
        this._url = url;
        this._volume = volume;
        this._max_dist = data.max_dist || 0;
        this._pos = data.pos || null;
        if(data?.entity){
            let ent: EntityMp;
            if(data.entity.type === 'player') ent = mp.players.atRemoteId(data.entity.id);
            else if(data.entity.type === 'vehicle') ent = mp.vehicles.atRemoteId(data.entity.id);
            else if(data.entity.type === 'ped') ent = mp.peds.atRemoteId(data.entity.id);
            else if(data.entity.type === 'object') ent = mp.objects.atRemoteId(data.entity.id);
            if(ent) this._ent = ent;
        }
        Sound.list.set(this.id, this);
        setTimeout(() => {
            this.start()
        }, 10)
    }
    start(){
        this.started = true;
        CustomEvent.triggerCef('sound:play', this.id, this._url, this.startpos, this.volume, this.pan)
    }
}

export const sound = {
    playSound: (id: string, url: string, volume: number) => {
        return new Sound(id, url, volume, {max_dist: 0});
    },
    playSoundEntity: (id: string, ent: EntityMp, url: string, volume: number, max_dist: number) => {
        return new Sound(id, url, volume, {max_dist, entity: {type: ent.type, id: ent.remoteId}});
    },
    playSoundPos: (id: string, pos: {x: number, y: number, z: number}, url: string, volume: number, max_dist: number) => {
        return new Sound(id, url, volume, {max_dist, pos});
    }
}

const updateSoundData = () => {
    if(!user.login) return;
    let res: {id: string, pan: number, volume: number}[] = [];
    Sound.list.forEach(item => {
        res.push({id: item.id, pan: item.pan, volume: item.volume});
    })
    let resStr = JSON.stringify(res);
    if(resStr == dataString) return;
    dataString = resStr;

    CustomEvent.triggerCef('sound:data', res);
}

let dataString: string = JSON.stringify([]);
mp.events.add({
    audioError: (id: string) =>
        Sound.get(id).onEndHandles.map(item => item(true)),
    audioFinish: (id: string) =>
        Sound.get(id).onEndHandles.map(item => item(false)),
})

let frame = 0;
mp.events.add('render', () => {
    frame++;

    if (frame == 2) {
        frame = 0;

        updateSoundData();
    }
});



