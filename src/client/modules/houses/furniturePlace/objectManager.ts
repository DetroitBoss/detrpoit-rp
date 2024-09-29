import {furnitureList, IFurnitureItem} from "../../../../shared/houses/furniture/furniture.config";

export class ObjectManager {
    public id: number;
    private readonly cfgId: number;

    private entity: ObjectMp;

    private position: Vector3Mp;
    private rotation: Vector3Mp;

    private moveType: boolean = true;

    private vector: number = 0;
    private vectors: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];

    private speed: number = 2;
    private speeds: number[] = [0.01, 0.05, 0.1, 0.5, 1];

    constructor(id: number, cfgId: number, dimension: number) {
        this.id = id;
        this.cfgId = cfgId;

        if (!this.cfg) return;

        const forward = mp.players.local.getForwardVector(),
            pos = mp.players.local.position;

        this.position = new mp.Vector3(
            pos.x + forward.x,
            pos.y + forward.y,
            pos.z + forward.z
        );

        this.rotation = new mp.Vector3(0, 0, 0);

        this.entity = mp.objects.new(
            mp.game.joaat(this.cfg.prop),
            this.position,
            {
                dimension,
                rotation: new mp.Vector3(0, 0, 0)
            }
        )
    }

    changeVector(toggle: boolean): string {
        if (toggle) {
            if (this.vector === this.vectors.length - 1) {
                this.vector = 0;
            } else {
                this.vector++;
            }
        } else {
            if (this.vector === 0) {
                this.vector = this.vectors.length - 1;
            } else {
                this.vector--;
            }
        }

        return this.vectors[this.vector];
    }

    changeSpeed(toggle: boolean) {
        if (toggle) {
            if (this.speed === this.speeds.length - 1) return;
            this.speed++;
        } else {
            if (this.speed === 0) return;
            this.speed--;
        }
    }

    changeMoveType(): boolean {
        this.moveType = !this.moveType;
        return this.moveType;
    }

    move(toggle: boolean) {
        if (toggle) {
            if (this.moveType) {
                this.position[this.vectors[this.vector]] = this.position[this.vectors[this.vector]] + this.speeds[this.speed];
            } else {
                this.rotation[this.vectors[this.vector]] = this.rotation[this.vectors[this.vector]] + this.speeds[this.speed];
            }
        } else {
            if (this.moveType) {
                this.position[this.vectors[this.vector]] = this.position[this.vectors[this.vector]] - this.speeds[this.speed];
            } else {
                this.rotation[this.vectors[this.vector]] = this.rotation[this.vectors[this.vector]] - this.speeds[this.speed];
            }
        }

        this.onEntityMove()
    }

    private onEntityMove() {
        if (!this.entity?.doesExist()) return;

        if (this.moveType) {
            this.entity.setCoords(
                this.position.x,
                this.position.y,
                this.position.z,
                false,
                false,
                false,
                false
            )
        } else {
            this.entity.setRotation(
                this.rotation.x,
                this.rotation.y,
                this.rotation.z,
                2,
                true
            );
        }
    }

    save(): [Vector3Mp, Vector3Mp] {
        return [this.position, this.rotation];
    }

    destroy() {
        this.entity.destroy();
    }

    get cfg(): IFurnitureItem {
        return furnitureList.find(el => el.id === this.cfgId);
    }
}