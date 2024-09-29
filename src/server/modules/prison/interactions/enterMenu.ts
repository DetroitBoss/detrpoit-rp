import {colshapes} from "../../checkpoints";
import {PRISON_ENTER_MENU_COORDS, PRISON_TIME_FOR_WANTED_LEVEL} from "../../../../shared/prison/config";
import {menu} from "../../menu";
import {ARREST_MONEY} from "../../../../shared/economy";
import {prison} from "../index";
import {fractionCfg} from "../../fractions/main";

export function enterMenu() {
    colshapes.new(
        PRISON_ENTER_MENU_COORDS,
        "Регистрация арестанта",
        (player: PlayerMp, index) => {
            const user = player.user;
            if (!user) return;
            if (!user.is_police) return player.notify("Доступно только сотрудникам полиции", "error");
            const m = menu.new(player, "База заключённых", "Регистрация арестанта");

            m.newItem({
                name: "Список текущих заключённых",
                onpress: () => {
                    const s = () => {
                        const submenu = menu.new(player, "База заключённых", "Список текущих заключённых");
                        mp.players.toArray().filter(target => target.user && target.user.prison && !target.user.prison.byAdmin).map(target => {
                            submenu.newItem({
                                name: `${target.user.name} (${target.user.id})`,
                                more: target.user.prison.time > 120 ? `${Math.floor(target.user.prison.time / 60)} мин.` : `${target.user.prison.time} сек.`,
                                desc: `Причина: ${target.user.prison.reason}`,
                                onpress: () => {
                                    if (player.user.id === target.user.id)
                                        return player.notify("Вы не можете освободить самого себя", 'error');
                                    menu.accept(player, "Вы хотите освободить заключённого?").then(status => {
                                        if(!status) return s();
                                        if(!mp.players.exists(target)) return player.notify("Игрок куда то пропал", "error");
                                        target.user.writeRpHistory(`Был освобожден из тюрьмы [${fractionCfg.getFractionName(player.user.fraction)}-${player.user.id}], по причине ${target.user.prison.reason}`);
                                        user.log('gosJob', `Освободил из тюремного заключения. Данные по предыдущему заключению - ${target.user.prison.time} секунд. Причина - ${target.user.prison.reason}`, target);
                                        prison.unjail(player, target.user.id)
                                        s();
                                    })
                                }
                            })
                        })
                        submenu.open();
                    }

                    s();
                }
            })

            m.newItem({
                name: "Зарегистрировать арестанта",
                onpress: async () => {
                    const target = await user.selectNearestPlayer(5)
                    if(!target) return;
                    if (!target.user.cuffed) return player.notify("Арестант должен быть в наручниках", "error");
                    if (!target.user.wanted_level) return player.notify("Арестант не подходит ни под одну из ориентировок", "error");

                    menu.input(player, "Введите причину ареста", target.user.wanted_reason, 30).then(val => {
                        if(!val) return;
                        if(!mp.players.exists(target)) return player.notify("Арестант пропал", "error");
                        if (!target.user.cuffed) return player.notify("Арестант должен быть в наручниках", "error");
                        if (!target.user.wanted_level) return player.notify("Арестант не подходит ни под одну из ориентировок", "error");

                        prison.jail(player, target, target.user.wanted_level * PRISON_TIME_FOR_WANTED_LEVEL, val);
                        player.notify("Арестант доставлен в тюрьму", "success")
                    })
                }
            })


            m.open();
    }, {
            color: [0, 0, 0, 0]
        })
}