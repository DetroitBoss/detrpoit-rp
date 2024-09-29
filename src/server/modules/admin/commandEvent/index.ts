import {gui} from "../../gui";
import {
    ADMIN_LEVEL_EVENT_ACCESS, COMMAND_EVENT_CHAT_COLOR,
    COMMAND_EVENT_DIMENSION,
    ICommandEventState
} from "../../../../shared/adminEvents/commandEvent/config";
import {menu, MenuClass} from "../../menu";

class CommandEvent {

    private _state: ICommandEventState = null;
    private _data: ICommandEventState = CommandEvent.getEmptyState();

    constructor() {
        gui.chat.registerCommand('aevent', this.adminCommandHandler);
        gui.chat.registerCommand('event', this.playerCommandHandler);
        mp.events.add('playerDeath', this.deathHandler);
    }

    private adminCommandHandler = (player: PlayerMp): void => {
        if (!player.user) return;
        if (!player.user.isAdminNow(ADMIN_LEVEL_EVENT_ACCESS)) return;

        this.openAdminMenu(player);
    }

    private playerCommandHandler = (player: PlayerMp): void => {
        if (!player.user) return;
        if (this._state === null)
            return player.notify('В данный момент не происходит никаких мероприятий', 'error');

        if (!this._state.teleportActive)
            return player.notify('Телепорт на мероприятие закрыт', 'error');

        if (this._state.players.length >= this._state.maxPlayers)
            return player.notify('На мероприятие максимальное количество участников', 'error');

        if (
            this._state.players.find(el => el === player.user.id) !== undefined
            &&
            player.dimension === COMMAND_EVENT_DIMENSION
        )
            return player.notify('Вы уже находитесь на мероприятие', 'error');

        if (this._state.players.find(el => el === player.user.id) === undefined)
            this._state.players.push(player.user.id);

        const randomX = Math.floor(Math.random() * 10 - 5),
            randomY = Math.floor(Math.random() * 10 - 5);

        player.user.teleport(
            this._state.spawnPosition.x + randomX,
            this._state.spawnPosition.y + randomY,
            this._state.spawnPosition.z + 0.5,
            180,
            COMMAND_EVENT_DIMENSION
        );

        player.notify('Вы были телепортированы на мероприятие, следуйте указаниям администратора', 'success');
    }

    private static getEmptyState(): ICommandEventState {
        return {
            name: '',
            spawnPosition: new mp.Vector3(0, 0, 0),
            returnPosition: new mp.Vector3(0, 0, 0),
            maxPlayers: 50
        }
    }

    private openAdminMenu(player: PlayerMp): void {
        const _menu = new MenuClass(player, 'Мероприятие по команде');

        if (this._state === null) {
            _menu.newItem({
                name: 'Название',
                more: this._data.name !== '' ? this._data.name : '~r~Необходимо указать',
                onpress: async () => {
                    const name = await menu.input(player, 'Название', this._data.name, 150, 'text');
                    if (name) this._data.name = name;

                    this.openAdminMenu(player);
                }
            });

            _menu.newItem({
                type: 'range',
                name: 'Максимальное кол-во игроков на мероприятие',
                more: this._data.maxPlayers,
                rangeselect: [1, 1500],
                onchange: (value) => {
                    this._data.maxPlayers = value;
                }
            });

            _menu.newItem({
                name: "Точка появления на мероприятие",
                more: this._data.spawnPosition.x !== 0 ? "~g~Указано" : "~r~Нужно указать",
                onpress: () => {
                    if (this._data.spawnPosition.x !== 0) {
                        this._data.spawnPosition = new mp.Vector3(0, 0, 0)
                    } else {
                        this._data.spawnPosition = player.position;
                    }

                    this.openAdminMenu(player);
                }
            })

            _menu.newItem({
                name: "Точка появления после мероприятия",
                more: this._data.returnPosition.x !== 0 ? "~g~Указано" : "~r~Нужно указать",
                onpress: () => {
                    if (this._data.returnPosition.x !== 0) {
                        this._data.returnPosition = new mp.Vector3(0, 0, 0)
                    } else {
                        this._data.returnPosition = player.position;
                    }

                    this.openAdminMenu(player);
                }
            })

            _menu.newItem({
                name: "~g~Запустить",
                onpress: async () => {
                    if (this._data.name === '')
                        return player.notify('Необходимо указать название мероприятия', 'error');

                    if (this._data.spawnPosition.x === 0)
                        return player.notify('Необходимо указать место появления на мероприятие', 'error');

                    if (this._data.returnPosition.x === 0)
                        return player.notify('Необходимо указать место появления после мероприятия', 'error');

                    const state = {...this._data};
                    state.teleportActive = true;
                    state.players = [];
                    state.adminName = player.user.name;
                    this._data = CommandEvent.getEmptyState();

                    const validPlayers = mp.players.toArray().filter(p => !!p.user);

                    validPlayers.forEach(p => {
                        p.outputChatBox(
                            `!{${COMMAND_EVENT_CHAT_COLOR}}Администратор ${state.adminName}` +
                            ` запустил мероприятие ${state.name},` +
                            `чтобы принять участие введите команду - /event`
                        );
                    })

                    this._state = state
                    _menu.close();
                    player.notify('Мероприятие успешно запущено', 'success');
                }
            });

            _menu.newItem({
                name: "~y~Очистить",
                onpress: async () => {
                    this._data = CommandEvent.getEmptyState();
                    this.openAdminMenu(player);
                }
            });
        } else {
            _menu.newItem({
                name: `${this._state.name} создал ${this._state.adminName}`
            });

            _menu.newItem({
                name: `Игроков в дименшене`,
                more: `${mp.players.toArray().filter(target => target.user && target.dimension === COMMAND_EVENT_DIMENSION).length}`
            });

            _menu.newItem({
                name: this._state.teleportActive ? "~r~Закрыть телепорт" : "~g~Открыть телепорт",
                onpress: async () => {
                    this._state.teleportActive = !this._state.teleportActive;
                    this.openAdminMenu(player);

                    const validPlayers = mp.players.toArray().filter(p => !!p.user);

                    validPlayers.forEach(p => {
                        if (this._state.teleportActive) {
                            p.outputChatBox(
                                `!{${COMMAND_EVENT_CHAT_COLOR}} Мероприятие: Телепорт открыт, чтобы телепортироваться` +
                                ` введите команду - /event`
                            );
                        } else {
                            p.outputChatBox(
                                `!{${COMMAND_EVENT_CHAT_COLOR}} Мероприятие: Телепорт закрыт.`
                            );
                        }
                    })
                }
            });

            _menu.newItem({
                name: "~r~Закончить мероприятие",
                onpress: async () => {
                    const pos = new mp.Vector3(
                        this._state.returnPosition.x,
                        this._state.returnPosition.y,
                        this._state.returnPosition.z
                    );

                    this._state = null;

                    const players = mp.players.toArray().filter(target => player.user &&
                        target.dimension === COMMAND_EVENT_DIMENSION)

                    players.forEach(target => {
                        const randomX = Math.floor(Math.random() * 10 - 5),
                            randomY = Math.floor(Math.random() * 10 - 5);

                        target.user.spawn(new mp.Vector3(pos.x + randomX, pos.y + randomY, pos.z + 0.5));
                        target.dimension = 0;
                    });


                    player.notify('Мероприятие успешно закончено', 'success');
                    _menu.close();
                }
            });
        }

        _menu.open();
    }

    private deathHandler = (player: PlayerMp) => {
        if (this._state === null) return;
        if (!player.user || player.dimension !== COMMAND_EVENT_DIMENSION) return;
        //if (this._state.players.find(id => player.user.id === id) === undefined)

        player.user.spawn(this._state.returnPosition);
        player.dimension = 0;

    }
}

export const commandEvent = new CommandEvent();

// Написано под хард рок / металлику