import {CustomEvent} from "../../custom.event";
import {IFirePlace, FireSpotDto, FirePlaceType} from "../../../../shared/jobs/firefighter/fireSpots";
import {systemUtil} from "../../../../shared/system";
import {FIREPLACE_TYPE_CONFIGS} from "./config";

export const fireSpots: Map<number, FireSpot> = new Map<number, FireSpot>();

CustomEvent.registerServer('fireSpots:load', loadFireSpots);
CustomEvent.registerServer('fireSpots:unload', unloadFireSpot);
CustomEvent.registerServer('fireSpots:extinguish', extinguishFireplace);

function extinguishFireplace(spotId: number, fireplaceIdx: number) {
    if (!fireSpots.has(spotId)) {
        return;
    }

    const spot = fireSpots.get(spotId);
    const place = spot.firePlaces[fireplaceIdx];
    place.destroy();
}

function loadFireSpots(id: number, json: string) {
    if (fireSpots.has(id)) {
        return;
    }

    const fireSpotData: FireSpotDto = JSON.parse(json);
    const fireSpot = new FireSpot(id, fireSpotData);
    fireSpots.set(id, fireSpot);
}

function unloadFireSpot(id: number) {
    if (!fireSpots.has(id)) {
        return;
    }

    const fireSpot = fireSpots.get(id);
    fireSpot.destroy();

    fireSpots.delete(id);
}

class FireSpot {
    public readonly id: number;
    public readonly firePlaces: FirePlace[];
    private readonly position: Vector3Mp;

    constructor(id: number, data: FireSpotDto) {
        this.id = id;
        this.position = systemUtil.getVector3Mp(data.position);

        this.firePlaces = [];
        data.firePlaces.forEach((firePlaceData, index) => {
            const idx = index;
            const finishHandler = () => {
                CustomEvent.triggerServer('fireSpots:extinguish', this.id, idx);
            }

            this.firePlaces.push(new FirePlace({ pos: this.position, heading: data.heading }, firePlaceData, finishHandler))
        });
    }

    public destroy() {
        for (let firePlace of this.firePlaces) {
            firePlace.destroy();
        }
    }
}

export class FirePlace {
    public readonly absolutePosition: Vector3Mp;
    public readonly radius: number;
    private readonly type: FirePlaceType;
    private hp: number;
    private _isBurning: boolean;
    private readonly finishHandler: () => void;

    public get isBurning() { return this._isBurning };

    private fxHandle: number;

    constructor(center: { pos: Vector3Mp, heading: number }, data: IFirePlace, finishHandler:() => void) {
        this.finishHandler = finishHandler;
        this._isBurning = data.isBurning;
        this.type = data.type;

        const { asset, effect, scale, hp } = FIREPLACE_TYPE_CONFIGS.get(this.type);
        this.radius = scale;
        this.hp = hp;

        this.absolutePosition = systemUtil.offsetPosition(center.pos, center.heading, systemUtil.getVector3Mp(data.position));
        this.absolutePosition.z = mp.game.gameplay.getGroundZFor3dCoord(
            this.absolutePosition.x,
            this.absolutePosition.y,
            this.absolutePosition.z + 10,
            0.0,
            false
        );

        this.fxHandle = createParticleFx(asset, effect, this.absolutePosition, scale);
    }

    public destroy() {
        if (!this.fxHandle) {
            return;
        }

        mp.game.graphics.removeParticleFx(this.fxHandle, true);
        this.fxHandle = 0;
        this._isBurning = false;
    }

    public extinguish() {
        if (this.hp === 0) {
            this.finishHandler();
            return;
        }

        this.hp--;
    }
}

function createParticleFx(assetName: string, effectName: string, position: Vector3Mp, scale: number): number {
    if (!mp.game.streaming.hasNamedPtfxAssetLoaded(assetName)) {
        mp.game.streaming.requestNamedPtfxAsset(assetName);
    }

    mp.game.graphics.setPtfxAssetNextCall(assetName);
    return mp.game.graphics.startParticleFxLoopedAtCoord(
        effectName, position.x, position.y, position.z, 0, 0, 0,
        scale, false, false, false, true
    );
}