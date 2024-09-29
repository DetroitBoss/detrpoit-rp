import {colshapes} from "../checkpoints";
import {PRISON_KITCHEN_DRINK, PRISON_KITCHEN_EAT, PRISON_KITCHEN_EATING} from "../../../shared/prison/config";
import {system} from "../system";

colshapes.new(PRISON_KITCHEN_EAT, "Бургеры", (player) => {
    if (!player.user) return;
    if (!player.user.prison)
        return player.notify("Кухня только для заключенных", "error");

    if (system.timestamp - player.user.prisonLastEat < PRISON_KITCHEN_EATING * 60)
        return player.notify("Вы уже недавно брали бургер", "error");

    player.user.prisonLastEat = system.timestamp;
    player.user.food += 200;
    player.user.playAnimation([["mp_player_inteat@burger", "mp_player_int_eat_burger_enter", 1], ["mp_player_inteat@burger", "mp_player_int_eat_burger", 1], ["mp_player_inteat@burger", "mp_player_int_eat_burger_fp", 1], ["mp_player_inteat@burger", "mp_player_int_eat_exit_burger", 1]], true, false);

    player.user.addAttachment('item_20');
    setTimeout(() => {
        if (mp.players.exists(player) && player.user) player.user.removeAttachment('item_20');
    }, 4000)
});

colshapes.new(PRISON_KITCHEN_DRINK, "Вода", (player) => {
    if (!player.user) return;
    if (!player.user.prison)
        return player.notify("Кухня только для заключенных", "error");

    if (system.timestamp - player.user.prisonLastDrink < PRISON_KITCHEN_EATING * 60)
        return player.notify("Вы уже недавно брали воду", "error");

    player.user.prisonLastDrink = system.timestamp;
    player.user.water += 500;
    player.user.playAnimation([["mp_player_intdrink", "intro_bottle", 1], ["mp_player_intdrink", "loop_bottle", 1], ["mp_player_intdrink", "outro_bottle", 1]], true, false);

    player.user.addAttachment('item_1');
    setTimeout(() => {
        if (mp.players.exists(player) && player.user) player.user.removeAttachment('item_1');
    }, 4000)
});