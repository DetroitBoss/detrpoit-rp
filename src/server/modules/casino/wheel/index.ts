import {CustomEvent} from "../../custom.event";
import {colshapeHandle, colshapes} from "../../checkpoints";
import {CASINO_DIMENSION, WHEEL_INTERACTION_POSITION} from "../../../../shared/casino/wheel";
import {Wheel} from "./wheel";
import { RouletteManager } from "../../donate/roulette/rouletteManager";
import {gui} from "../../gui";
import {system} from "../../system";
import {drops} from "../../../../shared/donate/donate-roulette/main";


class LuckyWheel {
    wheel: Wheel
    interaction: colshapeHandle
    private locked: boolean = false
    private lastRoll: number | null;

    constructor() {
        this.wheel = new Wheel();

        this.interaction = colshapes.new(WHEEL_INTERACTION_POSITION, "Крутить колесо", (player: PlayerMp) => {
            if (this.locked) return player.notify('Колесо удачи временно закрыто, попробуйте позже', 'warning');
            if (system.timestamp - player.user.account.lucky_wheel < 86400)
                return player.notify('С прошлого прокрута колеса прошло менее суток, попробуйте позже', 'warning');

            this.checkResetOccupator();

            if (this.wheel.occupator !== null) return player.notify("Колесо уже крутит другой игрок", "error");
            this.wheel.occupator = player.user.id;
            CustomEvent.triggerClient(player, "casino:wheel:towheel");
            this.lastRoll = system.timestamp;
        }, {
            dimension: CASINO_DIMENSION,
            radius: 1.5,
            color: [0, 0, 0, 0]
        });

        gui.chat.registerCommand('luckywheel', (player) => {
            if (!player.user.isAdminNow(7)) return player.notify("Нет доступа", "error");
            this.locked = !this.locked;
            player.notify(this.locked ? "Колесо удачи - было отключено" : "Колесо удачи - было включено", "info");
        });

        CustomEvent.registerClient('casino:wheel:readyForSpin', (player) => {
            if (this.wheel.occupator === null || this.wheel.occupator !== player.user.id)
                return player.notify('В данный момент невозможно прокрутить колесо');

            player.user.account.lucky_wheel = system.timestamp;
            const rand = this.getRandom();
            player.user.wheelPrize = rand;
            this.wheel.spin(player, rand);

            player.user.account.save();
        });

        CustomEvent.registerClient('casino:wheel:prize', (player, prize: number, rot: number) => {
            if (player.user.wheelPrize === null) return;
            player.user.wheelPrize = null;

            this.wheel.setFinishRot(rot);
            this.wheel.occupator = null;

            const itemName = drops.find(el => el.dropId === 20000 + prize).name;
            RouletteManager.addDrop(player, 20000 + prize);
            player.notify(`Вы выиграли приз - ${itemName ? itemName : ""}, он был отправлен в хранилище донат рулетки.`);
        })

        mp.events.add("playerQuit", (player) => {
            if (player.user && player.user.id === this.wheel.occupator) this.wheel.occupator = null;
        });
    }

    checkResetOccupator() {
        if (system.timestamp  - this.lastRoll > 25) this.wheel.occupator = null;
    }

    getRandom(): number {
        const rand = Math.floor(Math.random() * 10000);

        if (rand < 6) {
            return 11;
        }
        else if (rand >= 6 && rand < 11) {
            return 1;
        }
        else if (rand >= 11 && rand < 31) {
            return 19;
        }
        else if (rand >= 31 && rand < 61) {
            return 12;
        }
        else if (rand >= 61 && rand < 101) {
            return 9;
        }
        else if (rand >= 101 && rand < 151) {
            return 2;
        }
        else if (rand >= 151 && rand < 201) {
            return 4;
        }
        else if (rand >= 201 && rand < 291) {
            return 14;
        }
        else if (rand >= 291 && rand < 591) {
            return 18;
        }
        else if (rand >= 591 && rand < 891) {
            return 8;
        }
        else if (rand >= 891 && rand < 1291) {
            return 10;
        }
        else if (rand >= 1291 && rand < 1791) {
            return 17;
        }
        else if (rand >= 1791 && rand < 2291) {
            return 16;
        }
        else if (rand >= 2291 && rand < 2791) {
            return 6;
        }
        else if (rand >= 2791 && rand < 3391) {
            return 15;
        }
        else if (rand >= 3391 && rand < 4391) {
            return 7;
        }
        else if (rand >= 4391 && rand < 5391) {
            return 5;
        }
        else if (rand >= 5391 && rand < 6491) {
            return 13;
        }
        else if (rand >= 6491 && rand < 7991) {
            return 0;
        }
        else if (rand >= 7991 && rand <= 10000) {
            return 3;
        }
    }
}

new LuckyWheel();
