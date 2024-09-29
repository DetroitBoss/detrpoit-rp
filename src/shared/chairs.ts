import {Vector3WithHeading} from "./system";

export interface ChairConfig {
    model: number | string,
    needTp: boolean,
    seats: Vector3WithHeading[]
}

