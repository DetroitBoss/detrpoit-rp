import {Family} from "../server/modules/families/family";

export interface DynamicBlipOption {
    /** Измерение, в котором этот блип будет отрисовыватся */
    dimension?: number;
    /** ID фракции, для которой рисуется данный блип */
    fraction?: number | number[];
    /** ID семьи, для которой рисуется данный блип */
    family?: number | number[];
    /** Блип будет отрисовыватся только если вы в инте*/
    interior?: boolean;
    /** Расстояние, на котором этот блип будет отрисован
     * @default 0 - то есть по всей карте (для интерьерных блипов огран 40 м)
     */
    range?: number;
    /** Если true - то метку на радаре будет видно только когда игрок рядом с ней
     * @default {true}
     */
    shortRange?: boolean;
    isForBoxGame?: boolean;
}
export class DynamicBlipBase {
    id: string
    type: number
    color: number
    position_data: Vector3Mp
    options: DynamicBlipOption
    name: string
    constructor(id: string, type: number, color: number, position: Vector3Mp, name: string, options?: DynamicBlipOption){
        this.id = id
        this.type = type
        this.color = color
        this.position_data = position
        this.options = options
        this.name = name
    }
}

