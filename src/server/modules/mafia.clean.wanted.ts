import { CustomEvent } from "./custom.event";
import { User } from "./user";
import { system } from "./system";
import { MAFIA_CLEAN_WANTED_CONFIG } from "../../shared/mafia.clean.wanted";

CustomEvent.registerClient('mafia:wanted:data', (player, id: number) => {
    const user = player.user;
    if(!user) return false;
    const target = User.get(id);
    if (!target) return 'NOT_FND';
    if (system.distanceToPos(player.position, target.position) > 5) return 'NOT_NEAR';
    if (player.dimension != target.dimension) return 'NOT_NEAR';
    return target.user.wanted_level
})
CustomEvent.registerClient('mafia:wanted:clear', (player, id: number, itemid: number) => {
    const user = player.user;
    if(!user) return false;
    const cfg = MAFIA_CLEAN_WANTED_CONFIG[itemid];
    if (!cfg) return;
    if (!user.fractionData?.mafia) return user.notify('Я тебя не знаю, уходи', 'error');
    const target = User.get(id);
    if (!target) return user.notify('Игрок не обнаружен', 'error');
    if (system.distanceToPos(player.position, target.position) > 5) return user.notify('Игрок должен быть поблизости', 'error');
    if (player.dimension != target.dimension) return user.notify('Игрок должен быть поблизости', 'error');
    if (target.user.wanted_level === 0) return;
    const sum = target.user.wanted_level * cfg.costPerStar;
    if(sum > 0){
        if(user.money < sum) return player.notify('У вас нет столько налички', 'error');
        user.removeMoney(sum, true, `Очистка розыска LVL: ${target.user.wanted_level} для ${target.user.name} ${target.user.id}`)
    }
    target.user.clearWanted();
    player.notify('Розыск очищен', 'success');
    target.notify('Розыск очищен', 'success');

})