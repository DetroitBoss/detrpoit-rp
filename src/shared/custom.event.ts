import {OWNER_TYPES} from "./inventory";

export interface CustomEventHandler {
    destroy: () => void;
}

export class CustomEventBase {
    static registerLocalIds = 1;
    static registerHanldes: [string, (...args: any[]) => any, string][] = [];
    static clearRegister(eventName: string){
        this.registerHanldes.map((item, index) => {
            if (item[0] === eventName) this.registerHanldes.splice(index, 1);
        })
    }
    static clearRegisterAll(){
        this.registerHanldes = []
    }
    static register(eventName: 'inventory:updateowner', handle: (id: number, owner_type: OWNER_TYPES, owner_id: number, old_owner_type?: number, old_owner_id?:number) => any):CustomEventHandler;
    static register(eventName: 'player:teleport:start', handle: (player: PlayerMp, x: number, y: number, z: number, h?: number, d?: number, withRespawn?: boolean) => any):CustomEventHandler;
    static register(eventName: 'player:teleport:end', handle: (player: PlayerMp, x: number, y: number, z: number, h?: number, d?: number, withRespawn?: boolean) => any):CustomEventHandler;
    static register(eventName: 'player:socket:add', handle: (player: PlayerMp, socket: Socket) => any):CustomEventHandler;
    static register(eventName: 'newHour', handle: (hour?:number) => any):CustomEventHandler;
    static register(eventName: 'newDay', handle: () => any):CustomEventHandler;
    static register(eventName: 'newMinute', handle: () => any):CustomEventHandler;
    static register(eventName: string, handle: (...args: any[]) => any):CustomEventHandler;
    static register(eventName: string, handle: (...args: any[]) => any): CustomEventHandler{
        this.registerLocalIds = this.registerLocalIds + 1;
        const id = `${this.registerLocalIds}`
        this.registerHanldes.push([eventName, handle, id]);
        return {
            destroy: () => {
                this.registerHanldes.splice(this.registerHanldes.findIndex(q => q[2] == id), 1);
            }
        }
    }
    static trigger(eventName: string, ...args: any[]){
        this.registerHanldes.filter(q => q[0] == eventName).map(q => {
            q[1](...args);
        })
    }
    static async call(eventName: string, ...args: any[]){
        const q = this.registerHanldes.find(q => q[0] == eventName);
        if (q) return await q[1](...args);
        return null;
    }
}