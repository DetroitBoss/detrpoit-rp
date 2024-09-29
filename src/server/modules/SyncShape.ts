import {colshapeHandle, colshapes} from "./checkpoints";

export type PlayerAction = (player: PlayerMp) => void;

export class SyncShape {
    private readonly playersIds: number[];

    private shape: colshapeHandle;

    private readonly syncHandler: PlayerAction;
    private readonly desyncHandler: PlayerAction;

    constructor(position: Vector3Mp, syncRange: number, syncHandler: PlayerAction, desyncHandler: PlayerAction) {
        this.playersIds = [];
        this.syncHandler = syncHandler;
        this.desyncHandler = desyncHandler;

        this.shape = colshapes.new(position, null, null, {
            radius: syncRange,
            onEnterHandler: this.syncForPlayer.bind(this),
            onExitHandler: this.desyncForPlayer.bind(this),
            type: -1
        });
    }

    public destroy() {
        if (!this.shape) {
            return;
        }

        this.playersIds.forEach(id => {
            const player = mp.players.at(id);
            if (!player || !mp.players.exists(player)) {
                return;
            }

            this.desyncForPlayer(player);
        });

        this.shape.destroy();
        this.shape = null;
    }

    public sync(handler: PlayerAction) {
        for (let id of this.playersIds) {
            const player = mp.players.at(id);
            if (!player || !mp.players.exists(player) || !player.user) {
                continue;
            }

            handler(player);
        }
    }

    private syncForPlayer(player: PlayerMp) {
        const idx = this.playersIds.findIndex(id => player.id === id);
        if (idx !== -1) {
            return;
        }

        this.playersIds.push(player.id);
        this.syncHandler(player);
    }

    private desyncForPlayer(player: PlayerMp) {
        const idx = this.playersIds.findIndex(id => player.id === id);
        if (idx === -1) {
            return;
        }

        this.playersIds.splice(idx, 1);
        this.desyncHandler(player);
    }
}