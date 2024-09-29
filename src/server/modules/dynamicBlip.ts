import { DynamicBlipBase, DynamicBlipOption } from "../../shared/dynamicBlip"
import { CustomEvent } from "./custom.event"
import { system } from "./system"
import {Family} from "./families/family";
import {User} from "./user";

export class DynamicBlip extends DynamicBlipBase {
    static pool = new Map <string, DynamicBlip>()
    constructor(id: string, type: number, color: number, position: Vector3Mp, name:string, options?: DynamicBlipOption) {
        if (DynamicBlip.pool.has(id)){
            system.debug.error(`Dublicate dynamicBlip with id ${id}`);
            return;
        }

        super(id, type, color, position, name, options)
        DynamicBlip.pool.set(id, this);

        this.load()
    }
    load(){
        CustomEvent.triggerClients("dynamicBlip:load", [this.playerData])
    }
    destroy(){
        CustomEvent.triggerClients("dynamicBlip:destroy", this.id)
        DynamicBlip.pool.delete(this.id)
    }
    get position(){
        return this.position_data
    }
    set position(data){
        if(!data) return;
        if(system.distanceToPos(data, this.position) < 0.5) return;
        this.position_data = data;
        CustomEvent.triggerClients("dynamicBlip:updatePos", this.id, {x: this.position.x, y: this.position.y, z: this.position.z})
    }
    get playerData(){
        const { x, y, z } = this.position
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            color: this.color,
            pos: { x, y, z },
            options: this.options
        }
    }
    static playerJoinEvent(player: PlayerMp){
        const data = [...this.pool].map(item => item[1]).map(item => item.playerData)
        CustomEvent.triggerClient(player, "dynamicBlip:load", data)
    }
}


mp.events.add('_userLoggedIn', (user: User) => {
    const player = user.player;
    DynamicBlip.playerJoinEvent(player);
})
