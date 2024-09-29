import {IslandBattle} from "./islandBattle";
import {
    ISLAND_BATTLE_DAY,
    ISLAND_BATTLE_PREPARE_HOUR,
    ISLAND_BATTLE_START_MINUTE,
    WINNER_PAYMENT
} from "../../../shared/islandBattle";
import {gui} from "../gui";
import {IslandBattleEntity} from "../typeorm/entities/islandBattle";
import {system} from "../system";
import {MoneyChestClass} from "../money.chest";
import {Logs} from "../logs";

let battle: IslandBattle | null = null;

let interval: number = null;


interval = setInterval(() => {
    payment();
    startBattle();
}, 300000);

async function payment() {
    const res = await IslandBattleEntity.find({
        order: { id: 'DESC' },
        take: 1
    });

    if (!res[0]) return;

    if (res[0].lastPayment + 86400 > system.timestamp) return;

    const chest: MoneyChestClass = MoneyChestClass.getByFraction(res[0].fractionId);

    if (!chest) return;

    chest.money = chest.money + WINNER_PAYMENT;
    Logs.new(`money_${chest.id}`, `[Система]`, `Получено за ежедневный контроль острова ${WINNER_PAYMENT}$`);

    res[0].lastPayment = system.timestamp;
    res[0].save();
}

function startBattle() {
    if (
        new Date().getDate() === ISLAND_BATTLE_DAY &&
        new Date().getHours() === ISLAND_BATTLE_PREPARE_HOUR &&
        new Date().getMinutes() >= ISLAND_BATTLE_START_MINUTE &&
        battle === null
    ) {
        battle = new IslandBattle();
    }
}

gui.chat.registerCommand("islandbattle", (player) => {
    if (!player.user.isAdminNow(6)) return;

    if (interval !== null) clearInterval(interval);
    if (battle !== null) return;
    battle = new IslandBattle();
})
