import {
    IIslandPoint,
    ISLAND_BATTLE_DIMENSION,
    ISLAND_BATTLE_NOTIFY_IMAGE,
    ISLAND_POINT_PROP
} from "../../../shared/islandBattle";
import {colshapes, colshapeHandle} from "../checkpoints";
import {CustomEvent} from "../custom.event";


export class Point {
    private readonly id: number;
    public owner: number = null;
    private readonly onChangeOwner: Function;
    private readonly onPointInteract: Function;
    private config: IIslandPoint;
    private object: ObjectMp;
    private shape: colshapeHandle;
    private blip: BlipMp;
    private busy: number = null;

    constructor(id: number, config: IIslandPoint, onChangeOwner: Function, onPointInteract: Function) {
        this.id = id;
        this.config = config;
        this.onChangeOwner = onChangeOwner;
        this.onPointInteract = onPointInteract;

        this.object = mp.objects.new(mp.joaat(ISLAND_POINT_PROP), this.config.pos, {
            dimension: ISLAND_BATTLE_DIMENSION
        });


        this.blip = mp.blips.new(
            119,
            config.pos,
            {
                color: 4,
                dimension: ISLAND_BATTLE_DIMENSION,
                name: `Точка ${this.id}`,
                shortRange: true,
            }
        )

        this.shape = colshapes.new(this.config.pos, `Захват точки - ${this.id}`, this.shapeHandler, {
            dimension: ISLAND_BATTLE_DIMENSION,
            type: 1,
            color: [0, 0, 0, 125],
            radius: 2
        });

        mp.events.add(`islandBattle:interactResult:${this.id}`, this.resultInteractHandler);
    }

    private shapeHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.fraction) return;
        if (this.owner === player.user.fraction) return player.notify(
            'Данная точка уже под контролем вашей организации',
            'error',
            ISLAND_BATTLE_NOTIFY_IMAGE
        );

        if (this.busy !== null)
            return player.notify('Данную точку уже захватывает другой человек', 'error',
                ISLAND_BATTLE_NOTIFY_IMAGE);

        this.busy = player.user.id;
        this.onPointInteract(player.user.fraction, this.id);
        CustomEvent.triggerClient(player, 'islandBattle:pointStart', this.id, this.config.pos,
            this.owner === null ? 10 : 60);
    }

    private resultInteractHandler = (player: PlayerMp, status: boolean) => {
        if (!player.user) return;
        if (!player.user.fraction) {
            this.busy = null;
            return;
        }

        if (status) {
            this.busy = null;
            this.owner = player.user.fraction;
            this.onChangeOwner(player.user.fraction, this.id);
        }else{
            this.busy = null;
        }
    }

    public destroy() {
        mp.events.remove(`islandBattle:interactResult:${this.id}`, this.resultInteractHandler)
        this.object.destroy();
        this.shape.destroy();
        this.blip.destroy();
    }
}