import {SyncShared, SyncSharedData} from "../../shared/sync";
import {CustomEvent} from "./custom.event";

export class SyncClass extends SyncShared {
    static setData(key: SyncSharedData, value: any){
        const old = this.getData(key)
        this.data.set(key, value);
        this.fireEvent(key, old)
        this.sync(key);
    }
    static clearData(key: SyncSharedData){
        if(!this.data.has(key)) return;
        this.data.delete(key)
        this.fireEvent(key, null)
        this.players.map(target => CustomEvent.triggerClientSocket(target, 'sync:clear', key))
    }
    private static get players(){
        return mp.players.toArray().filter(q => q.user && q.user.socket)
    }
    private static sync(key: SyncSharedData){
        this.players.map(target => CustomEvent.triggerClientSocket(target, 'sync:key', key, this.getData(key)))
    }
    static syncPlayer(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        const socket = user.socket;
        if(!socket) return;
        const val = [...this.data]
        if(val.length == 0) return;
        CustomEvent.triggerClientSocket(player, 'sync:join', JSON.stringify(val))
    }
}

CustomEvent.register('player:socket:add', (player, socket) => {
    if(!socket) return;
})