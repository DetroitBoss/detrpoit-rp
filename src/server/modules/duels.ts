import {DUELS_FIGHT_POS, DUELS_REGISTER_POS, DUELS_TABLE_DATA, DUELS_WEAPON} from "../../shared/duels";
import {ScaleformTextMp} from "./scaleform.mp";
import {DuelRatingEntity} from "./typeorm/entities/duel";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {inventoryShared} from "../../shared/inventory";
import {User} from "./user";
import {DeathMath} from "./deadmatch";
import {getAchievConfigByType} from "../../shared/achievements";
import {DEATHMATH_LIMIT_BET_MAX} from "../../shared/gungame";

/** Имена оружий */
const weaponNames: string[] = []
DUELS_WEAPON.map(weapon => {
    weaponNames.push(inventoryShared.getWeaponNameByHash(weapon) || weapon);
})

/** Табличка с рейтингом */
const table = new ScaleformTextMp(DUELS_TABLE_DATA[0], "", {
    dimension: 0,
    type: 'board',
    rotation: new mp.Vector3(0, 0, DUELS_TABLE_DATA[1]),
    range: 40
});


colshapes.new(DUELS_REGISTER_POS, "Регистрация на дуэль", player => {
    duels.menu(player);
}, {
    radius: 2
})

interface LobbyItem {
    /** ID лобби */
    id: number,
    /** Пароль */
    password: string,
    /** ID владельца лобби */
    owner: number,
    /** ID второго участника */
    target?: number,
    /** Индикатор статуса того, что лобби запущено */
    started: boolean,
    /** Индикатор статуса того, что лобби завершено */
    ended: boolean,
    /** Выбранное оружие */
    weapon: string,
    /** Сумма ставки */
    money?: number
}

let lobbyId = 0;
export const duels = {
    getLobbyByUser: (player: PlayerMp | number) => {
        let id = typeof player === "number" ? player : player.dbid
        return duels.lobbys.find(q => q.owner === id || q.target === id)
    },
    getLobbyById: (id: number) => {
        return duels.lobbys.find(q => q.id === id)
    },
    getLobbyArrayIndex: (item: LobbyItem) => {
        return duels.lobbys.findIndex(q => q.id === item.id);
    },
    removeLobbyById: (id: number) => {
        let lobby = duels.getLobbyById(id)
        let index = duels.getLobbyArrayIndex(lobby);
        if(index == -1) return;
        duels.lobbys.splice(index, 1);
    },
    lobbys: <LobbyItem[]>[],
    menu: (player: PlayerMp) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, "", "Дуэли");
        m.sprite = "duels";
        const lobby = duels.getLobbyByUser(player);
        if (lobby) {
            m.newItem({
                name: "Покинуть лобби",
                more: `ID: ${lobby.id}`,
                onpress: () => {
                    m.close();
                    menu.accept(player, "Вы уверены?").then(status => {
                        if (!status) return;
                        if (!lobby) return;
                        if (lobby.started) return;
                        let index = duels.getLobbyArrayIndex(lobby);
                        if (index > -1) {
                            if (lobby.money) {
                                user.addMoney(lobby.money, true, 'Возврат средств за ставку на дуэли');
                            }
                            duels.lobbys.splice(index, 1);
                            duels.menu(player);
                        }
                    })
                }
            })
        } else {
            m.newItem({
                name: "Создать лобби",
                onpress: () => {
                    if(user.attachedToPlace) return player.notify('Вы не можете создать лобби', 'error');
                    let sum = 0;
                    let pass: string;
                    let weapon = system.randomArrayElement(DUELS_WEAPON)
                    const createLobby = () => {
                        const submenu = menu.new(player, "", "Создание лобби");
                        submenu.sprite = "duels";
                        submenu.onclose = () => { duels.menu(player) }

                        submenu.newItem({
                            name: "Пароль",
                            more: pass ? 'Указан' : 'Не указан',
                            desc: 'Лобби под паролем не влияет на статистику',
                            onpress: () => {
                                menu.input(player, "Введите пароль", "", 6, 'password').then(passwd => {
                                    if (typeof passwd !== "string") return;
                                    pass = passwd;
                                    createLobby();
                                })
                            }
                        })

                        submenu.newItem({
                            name: "Ставка",
                            more: sum ? `$${system.numberFormat(sum)}` : 'Без ставки',
                            onpress: () => {
                                menu.input(player, "Укажите сумму ставки", sum, 6, 'int').then(cost => {
                                    if (typeof cost !== "number") return;
                                    if(cost < 0 || cost > DEATHMATH_LIMIT_BET_MAX) return player.notify(`Сумма указана не верно`, 'error');
                                    sum = cost;
                                    createLobby();
                                })
                            }
                        })

                        submenu.newItem({
                            name: "Оружие",
                            more: inventoryShared.getWeaponNameByHash(weapon),
                            onpress: () => {
                                menu.selector(player, 'Выберите оружие', weaponNames, true, null, false, weaponNames.findIndex(q => q === (inventoryShared.getWeaponNameByHash(weapon) || weapon))).then(select => {
                                    if(typeof select !== "number" || select < 0 || select > 9999) return createLobby();
                                    weapon = DUELS_WEAPON[select];
                                    createLobby();
                                })
                            }
                        })


                        submenu.newItem({
                            name: "~g~Создать лобби",
                            onpress: () => {
                                if (user.attachedToPlace) return submenu.close(), player.notify('Вы не можете создавать лобби', "error");
                                lobbyId++;
                                if (sum) {
                                    if (user.money < sum) return player.notify("У вас недостаточно средств для оплаты", "error");
                                    user.removeMoney(sum, true, 'Оплата ставки на дуэль');
                                }
                                duels.lobbys.push({ id: parseInt(`${lobbyId}`), owner: player.dbid, money: sum, started: false, ended: false, password: pass, weapon })
                                player.notify("Лобби успешно создано", "success");
                                duels.menu(player);
                            }
                        })

                        submenu.open()
                    }
                    createLobby();
                }
            })

            duels.lobbys.map(item => {
                if(item.started) return;
                if(item.ended) return;
                m.newItem({
                    name: `Лобби #${item.id}`,
                    more: item.money ? `$${system.numberFormat(item.money)}` : 'Без ставки',
                    desc: `Пароль: ${item.password ? 'Есть' : 'Нет'}, Оружие: ${inventoryShared.getWeaponNameByHash(item.weapon) || item.weapon}`,
                    onpress: async () => {
                        m.close();
                        if (user.attachedToPlace) return player.notify("Вы не можете принять участие в мероприятии", "error");
                        let access = item.password ? (await menu.input(player, "Введите пароль", "", 6, 'password')) == item.password : true;
                        if (!access) return player.notify("Пароль указан не верно", "error")
                        let lobby = duels.getLobbyById(item.id);
                        if(!lobby) return player.notify('Лобби не существует', 'error'), duels.menu(player);
                        if(lobby.started) return player.notify('Лобби уже запущено', 'error'), duels.menu(player);
                        const owner = User.get(lobby.owner);
                        if(!owner){
                            player.notify("Владелец лобби покинул сервер", "error");
                            duels.removeLobbyById(item.id);
                            duels.menu(player);
                            return;
                        }
                        if(system.distanceToPos(DUELS_REGISTER_POS, owner.position) > 10 || owner.dimension){
                            player.notify("Владелец лобби покинул зону регистрации", "error");
                            owner.notify("Ваше лобби удалено, вы покинули зону регистрации", "error");
                            duels.removeLobbyById(item.id);
                            duels.menu(player);
                            return;
                        }
                        if(lobby.money){
                            if(user.money < lobby.money) return player.notify("У вас недостаточно средств для оплаты", "error");
                            user.removeMoney(lobby.money, true, 'Оплата ставки на дуэль');
                        }
                        lobby.target = player.dbid;
                        lobby.started = true;


                        let pos = system.randomArrayElement(DUELS_FIGHT_POS)
                        const middle = system.middlePoint3d(pos.pos1, pos.pos2);
                        const dm = new DeathMath(new mp.Vector3(middle.x, middle.y, middle.z), system.distanceToPos(pos.pos1, pos.pos2) * 1.2)

                        dm.armour = 100;
                        dm.team1_start = {x: pos.pos1.x, y: pos.pos1.y, z: pos.pos1.z + 1, h: pos.heading1, r: 1}
                        dm.team2_start = {x: pos.pos2.x, y: pos.pos2.y, z: pos.pos2.z + 1, h: pos.heading2, r: 1}

                        dm.name = 'Дуэль'

                        dm.team1_name = owner.user.name
                        dm.team2_name = player.user.name

                        dm.insertPlayer(owner, 1)
                        dm.insertPlayer(player, 2)

                        dm.weapon = lobby.weapon;
                        dm.ammo = 240;

                        dm.time = 180;

                        dm.wait = 5;

                        dm.start()

                        dm.handler(winnerindex => {
                            item.ended = true
                            const winner = winnerindex === 1 ? owner : player;
                            const looser = winnerindex === 2 ? owner : player;

                            if(mp.players.exists(winner)){
                                if (!item.password) duels.writeWin(winner);
                                if (item.money) {
                                    winner.user.addMoney(item.money * 1.9, true, `Победа в дуэли${mp.players.exists(looser) ? ` над ${looser.dbid}` : ''}`);
                                    winner.user.achiev.achievTickByType("duelSum", item.money * 1.9)
                                }
                                winner.user.achiev.achievTickByType("duelCount")
                            }

                            if(mp.players.exists(looser) && !item.password) duels.writeDefeate(looser);

                            let index = duels.getLobbyArrayIndex(item);
                            if (index > -1) duels.lobbys.splice(index, 1);

                        })

                    }
                })
            })
        }
        let myRating = duels.getUserRating(user.id);
        let ratingPos = myRating ? duels.rating.findIndex(q => q.id === myRating.id) : -1
        m.newItem({
            name: "Мой рейтинг",
            more: myRating ? `Место #${ratingPos + 1}` : 'Данных нет',
            desc: myRating ? `Побед: ${myRating.wins} | Поражений: ${myRating.defeates}` : ``
        })
        m.open();
    },
    rating: <DuelRatingEntity[]>[],
    getUserRating: (user_id: number) => {
        return duels.rating.find(q => q.userId == user_id)
    },
    loadAll: () => {
        return duels.loadRatings();
    },
    loadRatings: () => {
        console.time('Загрузка рейтинга дуелей завершена. Время загрузки')
        return DuelRatingEntity.find().then(data => {
            duels.rating = data;
            updateTable();
            system.debug.info(`Загрузка рейтинга дуелей, количество предметов: ${data.length}`);
            console.timeEnd('Загрузка рейтинга дуелей завершена. Время загрузки')
        })
    },
    writeWin: (player: PlayerMp) => {
        duels.writeData(player, true)
    },
    writeDefeate: (player: PlayerMp) => {
        duels.writeData(player, false)
    },
    writeData: (player: PlayerMp, win: boolean) => {
        if (!mp.players.exists(player)) return;
        let item = duels.getUserRating(player.dbid);
        const have = !!item;
        if (!item){
            item = new DuelRatingEntity();
            item.userId = player.user.id;
            item.wins = 0;
            item.defeates = 0;
        }
        if (win) item.wins++;
        else item.defeates++;
        item.name = player.user.name
        item.save().then((r) => {
            if (!have) duels.rating.push(r);
            updateTable();
        })
    },
}

let updateTableStatus = false;
const updateTable = () => {
    if (updateTableStatus) return;
    updateTableStatus = true;
    setTimeout(() => {
        duels.rating.sort((a, b) => {
            return b.wins - a.wins
        });
        let data = [...duels.rating].slice(0, 3);

        let ratingText = data.length > 0 ? data.map((q, i) => `${(i+1)}) ${q.name}: ${q.wins}`).join('\n') : "Рейтинг пустой";
        let text = `Топ 3 стрелков:\n${ratingText}`;
        if (text != table.text) table.text = text, system.debug.debug(`Таблица с рейтингом дуэли обновлён.\n-----------\n${text}\n-----------`);
        updateTableStatus = false;
    }, 2000)
}