import {CustomEvent} from "./custom.event";
import {VEHICLE_REGISTRATION_TARIFS} from "../../shared/vehicle.registration";
import {DONATE_MONEY_NAMES} from "../../shared/economy";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";
import {VehicleEntity} from "./typeorm/entities/vehicle";
import {User} from "./user";

CustomEvent.registerCef('vehiclenumber:buyDonate', (player, number: string) => {
    const user = player.user;
    const veh = player.vehicle;
    const cfg = VEHICLE_REGISTRATION_TARIFS[3];
    
    if (!number || !user) return;
    if (!Vehicle.isNumberValid(number)) return user.notify("К вводу допускается только латыница, пробел а так же цифры", "error", "CHAR_TOM");
    if (!check(user, veh)) return;
    
    VehicleEntity.findOne({number: number}).then(res => {
        if (res) return user.notify("Указанный вами номерной знак уже зарегистрирован в системе", "error", "CHAR_TOM");
        if (user.donate_money < cfg[1]) return user.notify(`У вас недостаточно ${DONATE_MONEY_NAMES[2]} для выполнения данной операции`, "error", "diamond");
        user.removeDonateMoney(cfg[1], 'Смена номерного знака на ТС')
        veh.entity.setNumber(number);
        user.notify("Услуга оказана в полном объёме", "success", "CHAR_TOM");
        user.setGui(null);
    })
});

const check = (user: User, veh: VehicleMp) => {
    if (!veh) {
        user.notify("Чтобы воспользоваться услугами центра регистрации ТС необходимо приехать на том самом ТС, который Вы желаете зарегистрировать", "error", "CHAR_TOM");
        return false
    }
    if (!veh.entity) {
        user.notify("ТС, который вы регистрируете должен принадлежать Вам.", "error", "CHAR_TOM");
        return false
    }
    if ((veh.entity.owner && veh.entity.owner !== user.id) || (veh.entity.familyOwner && veh.entity.familyOwner !== user.familyId)) {
        user.notify("ТС, который вы регистрируете должен принадлежать Вам.", "error", "CHAR_TOM");
        return false
    }
    
    return true;
}

CustomEvent.registerCef('vehiclenumber:buy', (player, id: number) => {
    const cfg = VEHICLE_REGISTRATION_TARIFS[id];
    if (!cfg) return;
    const user = player.user;
    const veh = player.vehicle;
    
    if (!check(user, veh)) return;
    
    if (!user.bank_number) return user.notify("Чтобы воспользоваться услугами регистрации ТС Вам необходимо открыть банковский счёт на своё имя", "error", "CHAR_TOM");
    if (user.bank_money < cfg[1]) return user.notify("На вашем банковском счету недостаточно средств для оплаты услуги", "error", "CHAR_TOM");
    user.removeBankMoney(cfg[1], true, "Оплата услуг по регистрации ТС #" + veh.entity.id, "Department of Motor Vehicles");
    veh.entity.setRandomNumber(cfg[3]);
    
    user.notify("Услуга оказана в полном объёме", "success", "CHAR_TOM");
    user.setGui(null);
})