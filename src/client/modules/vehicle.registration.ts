import {VEHICLE_REGISTRATION_POS} from "../../shared/vehicle.registration";
import {colshapes} from "./checkpoints";
import {user} from "./user";
import {gui} from "./gui";
import {CustomEvent} from "./custom.event";


colshapes.new(VEHICLE_REGISTRATION_POS.map(item => new mp.Vector3(item.x, item.y, item.z)), "Точка регистрации ТС", player => {
    if (!player.vehicle) return user.notify("Чтобы воспользоваться услугами центра регистрации ТС необходимо приехать на том самом ТС, который Вы желаете зарегистрировать", "error", "CHAR_TOM");
    if (player.vehicle.autosalon) return user.notify("Этот ТС мы не принимаем к регистрации.", "error", "CHAR_TOM");
    const id = player.vehicle.getVariable('id');
    const owner = player.vehicle.getVariable('owner');
    const ownerFamily = player.vehicle.getVariable('ownerfamily');
    if (!id || (!owner && !ownerFamily)) return user.notify("Этот ТС мы не принимаем к регистрации.", "error", "CHAR_TOM");
    if ((owner && owner !== user.id) || (ownerFamily && (ownerFamily != user.family || user.familyRank != 4))) return user.notify("ТС, который вы регистрируете должен принадлежать Вам или семье.", "error", "CHAR_TOM");
    gui.setGui('numberplate');
}, {
    type: 27,
    radius: 5
})

// TODO передавать в клиент лидер семьи ли игрок и в 16 проверять