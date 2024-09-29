import {checkVehicleTuningAvailable, exitLsc} from "./lsc";
import {BusinessEntity} from "../typeorm/entities/business";
import {CHIP_TUNING_COST, ChipTuningOption, LSC_VEHICLE_POS} from "../../../shared/lsc";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import {PayType} from "../../../shared/pay";
import {vehicleConfigs} from "../vehicles";
import {isAMotorcycle} from "../../../shared/vehicles";
import {User} from "../user";

export const openLscChipMenu = (player: PlayerMp, business: BusinessEntity) => {
    const vehicle = player.vehicle;
    if (!vehicle) {
        return player.notify('Вы должны находиться в ТС', 'error');
    }

    if (isAMotorcycle(vehicle.modelname)) {
        return player.notify('ЧИП-тюнинг не доступен для мотоциклов');
    }

    if (!checkVehicleTuningAvailable(player, vehicle)) {
        return;
    }

    player.user.teleportVeh(LSC_VEHICLE_POS.x, LSC_VEHICLE_POS.y, LSC_VEHICLE_POS.z, LSC_VEHICLE_POS.h, system.personalDimension);
    setTimeout(() => {
        if(!checkVehicleTuningAvailable(player, vehicle)) {
            if(player) exitLsc(player, business.id, vehicle.id, false);
            return;
        }

        const chipTuningCost = player.user.entity.isFreeChipTuningUsed ? CHIP_TUNING_COST : 1;
        CustomEvent.triggerClient(player, 'business:lscChip:open', business.id, chipTuningCost, vehicle.entity?.data?.chipTuning || []);
    }, system.TELEPORT_TIME + 1000);
}

CustomEvent.registerClient('lsc:chip:exit', (player, businessId: number) => {
    if(!mp.players.exists(player) || !player.user) return;

    const vehicle = player.vehicle;

    player.user.setGui(null);
    CustomEvent.triggerClient(player, 'lsc:exitChip')
    exitLsc(player, businessId, vehicle.id, false);
})

CustomEvent.registerCef('lsc:chip:buy', (player, businessId: number, vehicleId: number, data: ChipTuningOption[], payType:PayType, pin:string) => {
    if(!mp.players.exists(player) || !player.user) return true;

    player.user.setGui(null);
    CustomEvent.triggerClient(player, 'lsc:exitChip')
    exitLsc(player, businessId, vehicleId, false);

    const user = player.user;
    const vehicle = player.vehicle;

    if (!checkVehicleTuningAvailable(player, vehicle)) {
        return;
    }

    const chipTuningCost = player.user.entity.isFreeChipTuningUsed ? CHIP_TUNING_COST : 1;
    if (payType == PayType.CASH) {
        if (user.money < chipTuningCost) {
            return player.notify("У вас недостаточно средств", 'error');
        }
        user.removeMoney(chipTuningCost, true, 'Покупка чип-тюнинга');
    }
    else if (payType == PayType.CARD) {
        if (!user.verifyBankCardPay(pin)) {
            return player.notify(`Либо вы ввели неверный пин-код, либо у вас нет при себе банковской карты`, 'error');
        }
        if (!user.tryRemoveBankMoney(chipTuningCost, true, 'Покупка чип-тюнинга', `#${businessId}`)) {
            return;
        }
    }

    vehicle.entity.data.chipTuning = data;
    vehicle.entity.data.save();

    player.user.entity.isFreeChipTuningUsed = true;

    vehicle.entity.applyCustomization();
});

const defaultConfigByModel = new Map<number, ChipTuningOption[]>();
CustomEvent.registerClient('lsc:chip:setDefault', (player: PlayerMp, vehicleModel: number, config: ChipTuningOption[]) => {
    defaultConfigByModel.set(vehicleModel, config);
});

mp.events.add('_userLoggedIn', (user: User) => {
    CustomEvent.triggerClient(user.player, 'lsc:chip:loadDefaults', [...defaultConfigByModel.entries()]);
});
