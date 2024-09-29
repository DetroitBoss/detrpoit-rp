import {IFirePlace, FireSpotDto, FireSpotConfig, FireSpotTypes} from "../../../../../shared/jobs/firefighter/fireSpots";
import {DisappearanceTimeS, SyncShapeRange} from "./config";
import {SyncShape} from "../../../SyncShape";
import {CustomEvent} from "../../../custom.event";
import {systemUtil} from "../../../../../shared/system";

let generatingId = 1;
const pool: FireSpot[] = [];

CustomEvent.registerClient('fireSpots:extinguish', (player, spotId: number, fireplaceIdx: number) => {
    if (!mp.players.exists(player) || !player.user) {
        return;
    }

    const spot = pool.find(s => s.id === spotId);
    spot.extinguishFireplace(fireplaceIdx);
})

export class FireSpot {
    public static get(id: number): FireSpot {
        return pool.find(s => s.id === id);
    }

    public readonly id: number;
    public readonly position: Vector3Mp;
    private readonly fireProps: ObjectMp[];
    private readonly firePlaces: IFirePlace[];
    private readonly _config: FireSpotConfig;
    public get config() { return this._config }

    private syncShape: SyncShape;

    constructor(config: FireSpotConfig) {
        this._config = config;
        this.position = systemUtil.getVector3Mp(config.position);
        this.id = generatingId++;

        const typeConfig = FireSpotTypes.get(config.type);

        this.fireProps = [];
        for (let propConfig of typeConfig.props) {
            const pos = systemUtil.offsetPosition(this.position, config.heading, systemUtil.getVector3Mp(propConfig.position));
            const rot = systemUtil.getVector3Mp(propConfig.rotation);
            rot.z += config.heading;
            
            this.fireProps.push(mp.objects.new(propConfig.model, pos, {
                rotation: rot
            }));
        }

        this.firePlaces = [];
        for (let firePlaceConfig of typeConfig.firePlaces) {
            this.firePlaces.push({
                ...firePlaceConfig,
                isBurning: true
            });
        }

        this.syncShape = new SyncShape(this.position, SyncShapeRange,
            this.loadSpotForPlayer.bind(this),
            this.unloadSpotForPlayer.bind(this)
        );

        mp.events.call('fireSpots:created', this);
        pool.push(this);
    }

    public extinguishFireplace(fireplaceIdx: number) {
        const fireplace = this.firePlaces[fireplaceIdx];
        fireplace.isBurning = false;

        this.syncShape.sync((player) => {
            CustomEvent.triggerClient(player, 'fireSpots:extinguish', this.id, fireplaceIdx);
        });

        if (this.firePlaces.every(p => !p.isBurning)) {
            mp.events.call('firesSpots:fullyExtinguished', this);
            setTimeout(() => {
                this.destroy();
            }, DisappearanceTimeS * 1000);
        }
    }

    public destroy() {
        if (!this.syncShape) {
            return;
        }

        this.syncShape.destroy();
        this.syncShape = null;

        for (let prop of this.fireProps) {
            prop.destroy();
        }

        const idx = pool.findIndex(s => s.id === this.id);
        if (idx !== -1) {
            pool.splice(idx, 1);
        }

        mp.events.call('firesSpots:destroyed', this);
    }

    private loadSpotForPlayer(player: PlayerMp) {
        const dto: FireSpotDto = {
            position: this.position,
            heading: this._config.heading,
            firePlaces: this.firePlaces
        };

        CustomEvent.triggerClient(player, 'fireSpots:load', this.id, JSON.stringify(dto));
    }

    private unloadSpotForPlayer(player: PlayerMp) {
        CustomEvent.triggerClient(player, 'fireSpots:unload', this.id);
    }
}
