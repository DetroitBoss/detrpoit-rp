import {CustomEvent} from "./custom.event";

export class SocketSyncWeb {
    private static list:[string, PlayerMp][] = []

    static subscribe(player: PlayerMp, path: string){
        if(!mp.players.exists(player)) return;
        if(this.list.find(q => q[0] === path && q[1] == player)) return;
        this.list.push([path, player])
    }

    static unsubscribe(player: PlayerMp, path: string){
        if(!mp.players.exists(player)) return;
        const index = this.list.findIndex(q => q[0] === path && q[1] == player)
        if(index === -1) return;
        this.list.splice(index, 1);
    }

    static getfire(path: string){
        return this.list.filter(q => q[0] === path).map(q => q[1]).filter(q => mp.players.exists(q))
    }
    static fire(path: string, data: any){
        const list = this.getfire(path);
        list.map(player => this.fireTarget(player, path, data))
    }

    static fireTarget(player: PlayerMp, path: string, data: any){
        if(!mp.players.exists(player)) return;
        CustomEvent.triggerCefSocket(player, `SocketSync:${path}`, data)
    }
}

CustomEvent.registerCef('webcomponent:subscribe', (player, path: string) => {
    const user = player.user;
    if(!user) return;
    SocketSyncWeb.subscribe(player, path)
})
CustomEvent.registerCef('webcomponent:unsubscribe', (player, path: string) => {
    const user = player.user;
    if(!user) return;
    SocketSyncWeb.unsubscribe(player, path)
})