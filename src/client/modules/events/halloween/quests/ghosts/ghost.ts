import {Vector3WithHeading} from "../../../../../../shared/system";
import {onyxCreateObject} from "../../../../objects";

const pool: Ghost[] = [];
const deleteFromPool = (ghost: Ghost) => {
    const idx = pool.findIndex(el => el === ghost);
    if (idx !== -1) {
        pool.splice(idx, 1);
    }
};

export class Ghost {
    private readonly _object: ObjectMp;
    private readonly _destroyHandler: (health: number) => void;
    private _slidePosition: Vector3Mp;
    private _health: number;
    private _alive: boolean = false;

    get alive() {
        return this._alive;
    }

    get position(): Vector3Mp {
        if (!this._object || !this._object.handle) {
            return null;
        }

        return this._object.getCoords(false);
    }

    constructor(health: number, model: string, position: Vector3WithHeading, destroyHandler: (health: number) => void) {
        this._destroyHandler = destroyHandler;
        this._health = health;

        this._object = onyxCreateObject(model, position[0], this.handleStreamIn, {
            alpha: 200,
            dimension: mp.players.local.dimension,
            rotation: new mp.Vector3(0, 0, position[1])
        });

        pool.push(this);
    }

    handleStreamIn = (object: ObjectMp) => {
        if (object !== this._object) {
            return;
        }

        this._alive = true;
    }

    destroy() {
        if (!this._alive) {
            return;
        }

        this._alive = false;

        if (this._object && this._object.handle) {
            this._object.destroy();
        }

        deleteFromPool(this);
        this._destroyHandler(this._health);
    }

    slide(targetPosition: Vector3Mp) {
        this._slidePosition = targetPosition;
    }

    handleRender() {
        if (this.alive && this._object && this._object.handle) {
            const isSlideEnd = this._object.slide(this._slidePosition.x, this._slidePosition.y, this._slidePosition.z,
                0.01, 0.01, 0.01, false);

            if (isSlideEnd) {
                this.destroy();
            }
        }
    }

    /**
     * Возвращает true, если осталось 0 хп
     */
    applyDamage(damage: number): boolean {
        this._health -= damage;
        return this._health <= 0;
    }
}

mp.events.add('render', () => {
    for (let ghost of pool) {
        ghost.handleRender();
    }
});
