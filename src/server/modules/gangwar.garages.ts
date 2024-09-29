import {FACTION_ID} from "../../shared/fractions";
import {fractionCfg} from "./fractions/main";
import {system} from "./system";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";

interface ICaptureGarageConf {
    fraction: FACTION_ID;
    position: Vector3Mp;
    vehicleModels: string[];
}

interface IDestroyableEntity {
    destroy: Function;
}

const config: Array<ICaptureGarageConf> = [
    { fraction: FACTION_ID.BLOODS, vehicleModels: ["toros"], position: new mp.Vector3(-450.90, -1707.71, 17.83) },
    { fraction: FACTION_ID.VAGOS, vehicleModels: ["toros"], position: new mp.Vector3(474.44, -1967.52, 23.66) },
    { fraction: FACTION_ID.MARABUNTA, vehicleModels: ["toros"], position: new mp.Vector3(489.66, -1332.68, 28.33) },
    { fraction: FACTION_ID.FAMILIES, vehicleModels: ["toros"], position: new mp.Vector3(104.54, -1938.80, 19.80) },
    { fraction: FACTION_ID.BALLAS, vehicleModels: ["toros"], position: new mp.Vector3(877.01, -2187.69, 29.52) }
]

export class GangwarGarage {
    private readonly _dimension: number
    private readonly _fractionId: number
    private readonly _config: ICaptureGarageConf
    private readonly _vehiclesLimit: number

    private _totalVehiclesTakenAmount: number = 0
    private _colshape: colshapeHandle
    private _entitiesToDelete: Array<IDestroyableEntity> = []

    constructor(dimension: number, fractionId: number, vehiclesLimit: number) {
        this._dimension = dimension
        this._fractionId = fractionId
        this._vehiclesLimit = vehiclesLimit;
        this._config = config.find(c => c.fraction == fractionId)
    }

    public create(): void {
        const color = fractionCfg.getFractionColor(this._fractionId)
        const rgb = color ? system.hexToRgb(color) : {r: 255, g: 0, b: 0}

        this._colshape = colshapes.new(this._config.position, "Временный гараж", player => {
            this.openMenu(player)
        }, {
            dimension: this._dimension,
            type: 27,
            radius: 3,
            color: [rgb.r, rgb.g, rgb.b, 120]
        })
        this._entitiesToDelete.push(this._colshape)
    }

    public delete(): void {
        this._entitiesToDelete.forEach(e => e.destroy())
    }

    private openMenu(player: PlayerMp): void {
        const m = menu.new(player, "", "Список транспорта")
        m.sprite = "shopui_title_ie_modgarage"

        this._config.vehicleModels.forEach(vehModel => {
            const cfg = Vehicle.getVehicleConfig(vehModel)
            if (!cfg) return

            m.newItem({
                name: cfg.name,
                onpress: () => {
                    m.close()

                    if (this._totalVehiclesTakenAmount >= this._vehiclesLimit) {
                        return player.notify("Взято максимально количество ТС", "error")
                    }

                    this.spawnVehicle(player, vehModel)
                }
            })
        })
        m.open()
    }

    private spawnVehicle(player: PlayerMp, model: string): void {
        const spawnedVehicle = Vehicle.spawn(
            model,
            this._config.position,
            0,
            this._dimension
        )
        spawnedVehicle.anyoneHasAccess = true
        this._entitiesToDelete.push(spawnedVehicle)
        player.putIntoVehicle(spawnedVehicle, 0)

        this._totalVehiclesTakenAmount++
        player.notify('Успейте покинуть ТС до начала боя', 'info')
    }
}