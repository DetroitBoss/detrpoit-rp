import {CustomEvent} from "./custom.event";
import {DynamicBlipBase, DynamicBlipOption} from "../../shared/dynamicBlip";
import {user} from "./user";
import {system} from "./system";

const player = mp.players.local
CustomEvent.registerServer('dynamicBlip:load', (data: {
    id: string;
    type: number;
    color: number;
    name: string;
    pos: {
        x: number;
        y: number;
        z: number;
    };
    options: DynamicBlipOption;
}[]) => {
    data.map(item => {
        new DynamicBlip(item.id, item.type, item.color, new mp.Vector3(item.pos.x, item.pos.y, item.pos.z), item.name, item.options)
    })
})

CustomEvent.registerServer('dynamicBlip:updatePos', (id: string, pos: {x: number, y: number, z: number}) => {
    const item = DynamicBlip.get(id);
    if(item) item.position = new mp.Vector3(pos.x, pos.y, pos.z)
})


CustomEvent.registerServer('dynamicBlip:destroy', (id: string) => {
    const item = DynamicBlip.get(id);
    if(item) item.destroy();
})


export class DynamicBlip extends DynamicBlipBase {
    static pool = new Map<string, DynamicBlip>();
    static get(id: string){
        return [...this.pool].map(q => q[1]).find(q => q.id === id)
    }
    reload(){
        if(this.blip && mp.blips.exists(this.blip)){
            this.blip.setPosition(this.position.x, this.position.y, this.position.z)
        }
    }
    get position(){
        return this.position_data
    }
    set position(val){
        this.position_data = val
        this.reload()
    }
    blip: BlipMp;
    get dimension(){
        return this.options ? this.options.dimension || 0 : 0
    }
    get fraction(){
        return this.options ? this.options.fraction || 0 : 0
    }
    get family(){
        return this.options ? this.options.family || 0 : 0
    }
    get interior(){
        return this.options ? this.options.interior || false : false
    }
    get range(){
        if (this.options && typeof this.options.range === "number") return this.options.range
        if(this.interior) return 40
        return 0
    }
    get shortRange() {
        return (this.options && typeof this.options.shortRange == "boolean") ? this.options.shortRange : true
    }
    get boxGame() {
        return this.options ? this.options.isForBoxGame || false : false
    }
    get created(){
        return mp.blips.exists(this.blip)
    }
    set created(val){
        if(!val){
            if (mp.blips.exists(this.blip)) this.blip.destroy();
            this.blip = null;
            return;
        } else {
            this.blip = system.createBlip(this.type, this.color, this.position, this.name, this.dimension, this.shortRange);
        }
    }
    constructor(id: string, type: number, color: number, _position: {x: number,y: number, z: number} , name: string, options?: DynamicBlipOption) {
        const position = new mp.Vector3(_position.x, _position.y, _position.z)
        if (DynamicBlip.pool.has(id)) {
            mp.console.logError(`Dublicate dynamicBlip with id ${id}`);
            return
        }
        super(id, type, color, position, name, options)
        DynamicBlip.pool.set(id, this);

    }
    removeBlip(){
        if (mp.blips.exists(this.blip)) this.blip.destroy();
    }
    destroy() {
        this.removeBlip();
        DynamicBlip.pool.delete(this.id)
    }
    tick(){
        let access = true;
        if (player.dimension !== this.dimension && this.dimension !== -1) access = false;
        if (access && this.interior && !user.inInterrior) access = false;
        if (access && this.boxGame && !mp.storage.data.alertsEnable.boxgame) access = false;
        if (access && this.range && system.distanceToPos(this.position, player.position) > this.range) access = false;

        if (this.fraction){
            if (typeof this.fraction === "number") {
                if (user.fraction !== this.fraction && this.fraction !== -1) access = false;
            } else {
                if (!this.fraction.includes(user.fraction)) access = false;
            }
        }
        
        if (this.family) {
            if (typeof this.family === "number") {
                if (user.family !== this.family && this.family !== -1) access = false;
            }
            else {
                if (!this.family.includes(user.family)) access = false;
            }
        }

        if (access !== this.created) this.created = access;
    }
}

setInterval(() => {
    if(!user.login) return;
    DynamicBlip.pool.forEach(item => item.tick());
}, 1000)