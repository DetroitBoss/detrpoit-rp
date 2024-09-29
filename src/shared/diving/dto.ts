import {ChestData, ShipData} from "./work.config";


export interface ChestDTO {
    divePosition: Vector3Mp,
    chestData: ChestData,
    shipData?: ShipData
}