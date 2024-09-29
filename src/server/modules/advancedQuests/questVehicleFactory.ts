import {Vector3WithHeading} from "../../../shared/system";
import {Vehicle} from "../vehicles";

export class QuestVehicleFactory {
    private readonly _positions: Vector3WithHeading[];
    private readonly _model: string;
    private readonly _colorPrimary: RGB;
    private readonly _colorSecondary: RGB;

    private _lastPositionIndex: number = 0;

    constructor(positions: Vector3WithHeading[], model: string, colorPrimary: RGB, colorSecondary: RGB) {
        this._positions = positions;
        this._model = model;
        this._colorPrimary = colorPrimary;
        this._colorSecondary = colorSecondary;
    }

    create(player: PlayerMp): VehicleMp {
        const position = this.getNextPosition();

        return Vehicle.spawn(
            this._model,
            position[0], position[1],
            0, false, false, 100,
            this._colorPrimary, this._colorSecondary
        );
    }

    private getNextPosition(): Vector3WithHeading {
        this._lastPositionIndex++;
        if (this._lastPositionIndex >= this._positions.length) {
            this._lastPositionIndex = 0;
        }

        return this._positions[this._lastPositionIndex]
    }
}