import {FACTION_ID} from "./fractions";

interface FractionTaskItemBase {
    /** Название задания */
    name: string,
    /** Описание задания */
    desc: string,
    /** Местоположение задания */
    pos: {x: number, y: number, z: number, h: number}[]
}

interface vehDeliver extends FractionTaskItemBase {
    type: 'vehDeliver',
    /** Модели ТС */
    models: string[],
}
interface itemPickup extends FractionTaskItemBase {
    type: 'itemPickup',
    /** ИД предмета */
    models: number[],
}
interface itemDeliver extends FractionTaskItemBase {
    type: 'itemDeliver',
    /** ИД предмета */
    models: number[],
}

type FractionTaskItem = vehDeliver | itemPickup | itemDeliver



interface FractionTasksItem {
    /** Имя НПЦ */
    name: string,
    /** Модель НПЦ */
    model: string,
    /** Позиция НПЦ */
    pos: Vector3Mp,
    /** Угол НПЦ */
    heading: number;
    /** Список заданий, которые можно взять у NPC */
    tasks: FractionTaskItem[],
    /** Список фракций которые имеют доступ к данному NPC, если не указать - то доступ будет иметь любой игрок */
    fraction?: FACTION_ID[]
}

export const FRACTION_TASK_ITEMS: FractionTasksItem[] = []