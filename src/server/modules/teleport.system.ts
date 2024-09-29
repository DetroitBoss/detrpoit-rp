import {CustomEvent} from "./custom.event";
import {TELEPORT_CONFIG} from "../../shared/teleport.system";

CustomEvent.registerClient('teleport:go', (player, confid: number, index: number) => {
    const user = player.user;
    if(!user) return;
    const conf = TELEPORT_CONFIG[confid];
    if(conf.oneway && !index) return;

    if(conf.cost && user.money < conf.cost) return player.notify("У вас недостаточно средств для оплаты", "error");

    if(conf.cost) user.removeMoney(conf.cost, true, 'Оплата телепорта '+conf.name);
    const pos = conf.points[index];
    if(conf.vehicle) user.teleportVeh(pos.x, pos.y, pos.z, pos.h, pos.d != -1 ? pos.d : player.dimension);
    else user.teleport(pos.x, pos.y, pos.z, pos.h, pos.d != -1 ? pos.d : player.dimension);
});