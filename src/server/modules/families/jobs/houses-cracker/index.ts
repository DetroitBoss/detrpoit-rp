import './starting'
import './robbering'
import './areaLeaving'

import {HouseEntity} from "../../../typeorm/entities/houses";
import {DynamicBlip} from "../../../dynamicBlip";

export interface HousesCrackerData {
    house: HouseEntity,
    /** Флаг: было ли отправлено уведомления о начале ограбления дома */
    isRobberyNotified: boolean,
    /** Количество ограбленных точек */
    robbedPoints: number,
    /** Айтемы, которые выданы в 'сумку' при ограблении */
    robbedItems: { itemId: number, amount: number }[],
    /** Флаг: создана ли зона завершения ограбления */
    isLeavingAreaCreated: boolean,
    /** Блип, отрисовывающийся у гос семей */
    govRobberyBlip?: DynamicBlip
}

const crackingHousesByUserId = new Map<number, number>();

export function isHouseRobbingNow(houseId: number) {
    return [...crackingHousesByUserId.values()].includes(houseId);
}

export function setHouseRobbingNow(userId: number, houseId: number) {
    crackingHousesByUserId.set(userId, houseId);
}

export function deleteHouseRobbingNow(userId: number) {
    crackingHousesByUserId.delete(userId);
}

