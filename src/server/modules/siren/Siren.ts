import {ISirenPlace} from "../../../shared/siren/ISirenPlace";
import {MenuClass} from "../menu";
import {colshapeHandle, colshapes} from "../checkpoints";
import {CustomEvent} from "../custom.event";
import {Dispatch} from "../dispatch";
import {system} from "../system";
import {ISirenHistory} from "./ISirenHistory";

export class Siren {
    private config: ISirenPlace;
    private readonly shape: ColshapeMp;
    private readonly remote: colshapeHandle;
    private active: boolean = false;
    private lastStart: number = 0;
    private history: ISirenHistory[] = []

    constructor(sirenPlace: ISirenPlace) {
        this.config = sirenPlace;

        this.shape = mp.colshapes.newSphere(
            this.config.position.x,
            this.config.position.y,
            this.config.position.z,
            this.config.range,
            this.config.dimension
        );

        this.remote = colshapes.new(
            this.config.remote,
            "Пульт управления тревожной сирены",
            (player: PlayerMp) => {
                if (!player.user || !this.config.fractionIds.includes(player.user.fraction))
                    return player.notify("Нет доступа");
                this.openSirenMenu(player)
            }
        )

        mp.events.add("playerEnterColshape", this.playerEnter);
        mp.events.add("playerExitColshape", this.playerExit);
    }

    private startInterval = () => {
        const interval = setInterval(() => {
            if (this.active && system.timestamp - this.lastStart > this.config.time * 60) {
                this.disable();
                clearInterval(interval);
            }
        }, 5000);
    }

    public enable() {
        this.active = true;

        mp.players.forEachInRange(this.config.position, this.config.range + 500, (player) => {
            if (!this.shape.isPointWithin(player.position)) return;
            CustomEvent.triggerCef(
                player,
                'sound:play',
                'raid-siren',
                'raid-siren',
            );
        });
    }

    public disable() {
        this.active = false;

        mp.players.forEachInRange(this.config.position, this.config.range + 500, (player) => {
            if (!this.shape.isPointWithin(player.position)) return;
            CustomEvent.triggerCef(
                player,
                'sound:stop',
                'raid-siren'
            );
        });
    }


    private playerEnter = (player: PlayerMp, shape: ColshapeMp) => {
        if (!this.active) return;
        if (shape !== this.shape) return;

        CustomEvent.triggerCef(
            player,
            'sound:play',
            'raid-siren',
            'raid-siren',
        );
    }

    private playerExit = (player: PlayerMp, shape: ColshapeMp) => {
        if (!this.active) return;
        if (shape !== this.shape) return;
        CustomEvent.triggerCef(
            player,
            'sound:stop',
            'raid-siren'
        );
    }

    private openSirenMenu = (player: PlayerMp) => {
        const _menu = new MenuClass(player, 'Меню тревоги', this.config.name);


        _menu.newItem({
            name: this.active ? "~g~Выключить" : "~r~Включить",
            desc: "Включение и выключение тревожной сирены",
            onpress: () => {
                if (!this.active && system.timestamp - this.lastStart < this.config.turnOnFrequency * 60)
                    return player.notify(`Нельзя включать чаще, чем раз в ${this.config.turnOnFrequency} минут`, 'error');
                if (!this.active) {
                    this.lastStart = system.timestamp;
                    this.startInterval();
                    if (this.config.dispatchFractionIds) {
                        Dispatch.new(
                            this.config.dispatchFractionIds,
                            `На объекте ${this.config.name} была включена сирена`,
                            {x: this.config.remote.x, y: this.config.remote.y}
                        );
                    }

                    this.history.unshift({
                        id: player.user.id,
                        name: player.user.name,
                        time: system.timestamp
                    })
                }

                player.notify(`Сирена ${this.active ? "выключена" : "включена"} успешно`);
                this.active ? this.disable() : this.enable();
                _menu.close();
            }
        })

        _menu.newItem({
            name: "История включений",
            desc: "Тут отображена история последних включений сирены",
            onpress: () => {
                const submenu = new MenuClass(player, 'История включений', this.config.name);

                this.history.forEach(el => {
                    submenu.newItem({
                        name: `${system.timeStampString(el.time)}`,
                        desc: `${el.name} [${el.id}]`
                    })
                })

                submenu.open();
            }
        })

        _menu.open();
    }
}
