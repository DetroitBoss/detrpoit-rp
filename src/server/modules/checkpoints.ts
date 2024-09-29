import {CustomEvent} from "./custom.event";
import {colshapeHandleBase, colshapeHandleOptions} from "../../shared/checkpoints";
import {User} from "./user";
import {UpdateAction, UserUpdatedKey} from "../../shared/GameVisualElement";

let clshid = 1;
export class colshapeHandle extends colshapeHandleBase {
    private _players : number[];
    public get players() {
        return this._players ?? (this._players = []);
    }

    protected createMarker(position: Vector3Mp): void {
        const dto = JSON.stringify(this.getDto());

        CustomEvent.triggerClients('colshapes:createMarker', dto);

        mp.players.toArray()
            .filter(player => player.user && (!this.predicate || this.predicate(player)))
            .forEach(player => {
                this.addPlayer(player);
                this.handleEnable(player, [this.id]);
            });
    }

    protected deleteMarker() {
        CustomEvent.triggerClients('colshapes:deleteMarker', this.id);
    }

    public addPlayer(player: PlayerMp) {
        const idx = this.players.findIndex(pId => pId === player.id);
        if (idx === -1) {
            this.players.push(player.id);
        }
    }

    public removePlayer(player: PlayerMp) {
        const idx = this.players.findIndex(pId => pId === player.id);
        if (idx !== -1) {
            this.players.splice(idx, 1);
        }
    }

    public handleEnable(player: PlayerMp, ids: any[]) {
        CustomEvent.triggerClient(player, 'colshapes:enableMarker', ids);
    }

    public handleDisable(player: PlayerMp, ids: any[]) {
        CustomEvent.triggerClient(player, 'colshapes:disableMarker', ids);
    }

    public handleUpdate(player: PlayerMp): { id: any, action: UpdateAction } {
        if (!this.predicate) {
            return { id: this.id, action: 'none' };
        }

        const idx = this.players.findIndex(pId => pId === player.id);
        if (idx === -1) {
            if (this.predicate(player)) {
                this.addPlayer(player);
                return { id: this.id, action: 'enable' };
            }
        } else {
            if (!this.predicate(player)) {
                this.removePlayer(player);
                return { id: this.id, action: 'disable' };
            }
        }

        return { id: this.id, action: 'none' };
    }
}


function newColshape(position: Vector3Mp, message: (string | ((player: PlayerMp, index?: number) => string)), handle: (player: PlayerMp, index?:number) => void, options?: colshapeHandleOptions, ...updatedKeys: UserUpdatedKey[]): colshapeHandle;
function newColshape(position: Vector3Mp[], message: (string | ((player: PlayerMp, index?: number) => string)), handle: (player: PlayerMp, index?: number) => void, options?: colshapeHandleOptions, ...updatedKeys: UserUpdatedKey[]): colshapeHandle;
function newColshape(position: Vector3Mp | Vector3Mp[], message: (string | ((player: PlayerMp, index?: number) => string)), handle: (player: PlayerMp, index?: number) => void, options?: colshapeHandleOptions, ...updatedKeys: UserUpdatedKey[]): colshapeHandle {
    clshid++;

    const id = clshid;
    let cl = new colshapeHandle(position, message, handle, options, () => {
        colshapes.list.delete(id);
    }, ...updatedKeys);

    colshapes.list.set(id, cl);
    return cl;
}

export const colshapes = {
    list: new Map <number, colshapeHandle>(),
    new: newColshape
}

mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player.user) {
        return;
    }

    for (let colshape of [...colshapes.list.values()]) {
        colshape.removePlayer(player);
    }
});

mp.events.add('_userLoggedIn', (user: User) => {
    if (!user.player) {
        return;
    }

    const colshapesData = [...colshapes.list.values()]
        .filter(colshape => colshape.type !== -1)
        .map(colshape => colshape.getDto());

    const idsToEnable = [...colshapes.list.values()]
        .filter(colshape => !colshape.predicate || colshape.predicate(user.player))
        .map(colshape => {
            colshape.addPlayer(user.player);
            return `${colshape.id}`;
        });

    CustomEvent.triggerClient(user.player,'colshapes:createMarkers', colshapesData, idsToEnable);
});

mp.events.add('playerEnterColshape', (player: PlayerMp, colshape: ColshapeMp) => {
    if (!colshape.handleClass) return;
    if (!player.user) return;

    if (colshape.handleClass.predicate && !colshape.handleClass.predicate(player)) {
        return;
    }

    let text = colshape.handleClass.message;

    if (colshape.handleClass.predicate &&
        !colshape.handleClass.predicate(player)) {
        return;
    }

    if (colshape.handleClass.onEnterHandler) {
        colshape.handleClass.onEnterHandler(player)
    }
    if (colshape.handleClass.onenter) {
        colshape.handleClass.handle(player)
        return;
    }
    if (text){
        let mes = "";
        if (typeof colshape.handleClass.message === "string") {
            mes = colshape.handleClass.message
        } else {
            const index = colshape.handleClass.colshapes.findIndex(col => col && mp.colshapes.exists(col) && col.id === colshape.id);
            mes = colshape.handleClass.message(player, index)
        }
        if (mes) player.user.setHelpKey('E', mes);
    }
    player.colshape = colshape;
    player.setVariable('inColshape', true)
})
mp.events.add('playerExitColshape', (player: PlayerMp, colshape: ColshapeMp) => {
    player.colshape = null;
    player.setVariable('inColshape', false)

    if (colshape.handleClass && colshape.handleClass.onExitHandler) {
        colshape.handleClass.onExitHandler(player)
    }
})

CustomEvent.registerClient('sendkey:69', (player) => {
    if (!player.user) return;
    if (!player.colshape) return;
    const colshape = player.colshape;
    if (!colshape.handleClass) return;
    if (colshape.handleClass.onenter) return;
    if (!colshape.handleClass.handle) return;
    const index = colshape.handleClass.colshapes.findIndex(col => col && mp.colshapes.exists(col) && col.id === colshape.id);
    colshape.handleClass.handle(player, index);
});