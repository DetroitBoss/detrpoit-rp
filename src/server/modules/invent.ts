import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {menu} from "./menu";
import {EVENT_ANNOUNCE_COST, EVENT_ANNOUNCE_MINUTE} from "../../shared/economy";
import {fight} from "./fight";
import {BoxGameCreateAndRun} from './boxgame';
import {clearGangZone} from "./gangwar";
import {eventsList} from "../../shared/events";
import {generateRace} from "./race";
import {CargoBattleFamilyQuest} from "./families/quests/cargobattle";
import {GRAB_POS_LIST} from "../../shared/grab.zone";
import {adminGrabEnable, runAdminGrab} from "./grab.zone";
import {GANGFIGHT_POS} from "../../shared/gangfight";
import {gangfight} from "./gangfight";


CustomEvent.register('newHour', (hour) => {
    setTimeout(() => {
        if(eventsList.RACE.includes(hour)) generateRace();
        if(eventsList.BOX.includes(hour)) {
            setTimeout(() => {
                return BoxGameCreateAndRun()
            }, system.getRandomInt(1, 9) * 60000)
        }
        if(eventsList.FAMILY_CONTAINER.includes(hour)) {
            setTimeout(() => {
                new CargoBattleFamilyQuest().startReady(true).then(res => {
                    system.debug.info('Запущен автоматический контейнер')
                }).catch(error => {
                    system.debug.error('Не удалось запустить автоматический контейнер')
                    system.debug.error(error)
                })
            }, 30 * 60000)
        }
    }, 60000)
})

export class IventClass {
    id: number;
    type: "pos" | "tp" | "gps";
    name: string;
    colshape: colshapeHandle;
    world: number;
    pos: { x: number; y: number; z: number; h: number };
    closed = false
    endTime: number;
    createTime: number;
    author: string;
    posWorld: { x: number; y: number; z: number; h: number; };
    constructor(
        /** Тип */
        type: "pos" | "tp" | "gps",
        /** Название */
        name: string,
        /** Сколько минут будет существовать */
        minutesToClose: number,
        /** Автор */
        author: string,
        /** Местоположение в мире, если тип не tp */
        pos: { x: number, y: number, z: number, h: number },
        /** Точка телепортации в виртуальный мир, если тип pos или tp */
        posWorld: { x: number, y: number, z: number, h: number },
        /** Закрыто по умолчанию, чтобы допустим заранее на анонсировать. Пока закрыто - отображатся нигде не будет */
        closed: boolean = false
        ) {
        this.id = IventClass.ids++
        this.type = type
        this.name = name
        this.author = author
        this.endTime = system.timestamp + (minutesToClose * 60)
        this.createTime = system.timestamp
        this.pos = pos
        this.posWorld = posWorld
        this.closed = closed
        this.world = system.personalDimension
        if (type === "pos" && this.pos) {
            this.colshape = colshapes.new(new mp.Vector3(this.pos.x, this.pos.y, this.pos.z - 1), name, player => {
                if (player.user.attachedToPlace) return player.notify("Вы не можете принимать участие в мероприятии", "error")
                this.enterWorld(player)
            }, {
                dimension: 0,
            })
        }
        if(!this.closed) this.notify()

        IventClass.pool.push(this)
    }

    notify(){
        if(!this.exist) return;
        mp.players.toArray()
            .filter(target => target.user)
            .forEach(target => {
                const targetPlayer = target;

                const notifyText = this.type === 'tp'
                    ? 'Телепортироваться на мероприятие?'
                    : 'Установить точку в навигаторе до мероприятия?' ;

                menu.accept(targetPlayer, `${this.name}. Организатор: ${this.author}. ${notifyText}`, 'small', 20000)
                    .then((isAgreed) => {
                        if (!isAgreed || !mp.players.exists(targetPlayer)) {
                            return;
                        }

                        if (this.type === 'tp') {
                            if (targetPlayer.user.attachedToPlace) {
                                return targetPlayer.notify("Вы не можете принимать участие в мероприятии", "error")
                            }

                            this.enterWorld(targetPlayer);
                        } else {
                            targetPlayer.user.setWaypoint(this.pos.x, this.pos.y);
                        }
                    });
        })
    }

    get exist(){
        if (this.closed) return false;
        if (this.endTime < system.timestamp) return false;

        return true;
    }

    get players(){
        return mp.players.toArray().filter(target => target.user && target.dimension === this.world);
    }

    enterWorld(player: PlayerMp){
        if(!mp.players.exists(player)) return;
        player.user.revive(0)
        player.user.teleport(this.posWorld.x, this.posWorld.y, this.posWorld.z, this.posWorld.h, this.world);
        player.user.achiev.achievTickByType("eventEnter")
    }
    exitWorld(player: PlayerMp){
        if(!mp.players.exists(player)) return;
        player.user.revive(0)
        player.user.returnToOldPos();
        player.notify("Благодарим за участие в мероприятии", "success");
    }

    delete() {
        if (this.colshape) this.colshape.destroy();
        this.players.map(target => {
            this.exitWorld(target);
        })
        const index = IventClass.pool.findIndex(q => q.id === this.id);
        if (index > -1) IventClass.pool.splice(index, 1);
    }


    //* Static pool
    static pool: IventClass[] = []
    static ids = 1;
    static get(id: number) {
        return this.pool.find(q => q.id === id)
    }
    static delete(id: number) {
        const item = this.pool.find(q => q.id === id);
        if (item) item.delete()
    }
}

setInterval(() => {
    IventClass.pool.map(item => {
        if (item.type === "pos" && item.endTime < system.timestamp && item.colshape){
            item.colshape.destroy();
            item.colshape = null;
        }
    })
}, 10000)

const iventtypearray: ("pos" | "tp" | "gps")[] = ["pos", "tp", "gps"]
const iventtypenames = ["Вход через маркер", "Мгновенный телепорт", "Просто метка в навигаторе"]
const iventtypedesc = ["Чтобы игроки попали на МП - им нужно добаться до маркера. Маркер установится в том месте, где вы находитесь", "Чтобы попасть на МП - достаточно в телефоне в разделе GPS выбрать данное мероприятие. Телепортация произойдёт из любого места", "Это лишь GPS метка, и не более, ни отдельного измерения, ни прочего. Эта система выделяется так же игрокам"]

const createMp = (player: PlayerMp, conf: {
    fromSystem: boolean,
    type: number,
    name: string,
    minutesToClose: number,
    closed: boolean,
    posWorld?: { x: number, y: number, z: number, h: number }
    pos?: { x: number, y: number, z: number, h: number }
}) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:events:system')) return;
    const m = menu.new(player, "Мероприятия", "Список")
    m.newItem({
        name: "Тип входа",
        desc: iventtypedesc[conf.type],
        type: "list",
        list: iventtypenames,
        listSelected: conf.type,
        onchange: (val) => {
            conf.type = val
            createMp(player, conf)
        }
    })
    if(conf.type != 2){
        m.newItem({
            name: "Точка выхода в МП",
            desc: `Сюда игроки будут попадать при телепортации`,
            more: conf.posWorld ? 'Установлена' : 'Не установлена',
            onpress: () => {
                conf.posWorld = { x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading}
                player.notify("Точка установлена", "success");
                createMp(player, conf)
            }
        })
    }
    if(conf.type != 1){
        m.newItem({
            name: "Точка входа в МП",
            desc: `Сюда игрокам нужно будет добратся`,
            more: conf.pos ? 'Установлена' : 'Не установлена',
            onpress: () => {
                conf.pos = { x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading }
                player.notify("Точка установлена", "success");
                createMp(player, conf)
            }
        })
    }
    
    m.newItem({
        name: "Название",
        more: conf.name,
        onpress: () => {
            menu.input(player, "Введите название", conf.name, 20).then(name => {
                if(!name) return createMp(player, conf)
                conf.name = name;
                createMp(player, conf)
            })
        }
    })
    m.newItem({
        name: "Запуск по умолчанию",
        desc: "Если по умолчанию закрыть - это не покажет игрокам МП до того, как вы подготовите что то внутри, если конечно вам это необходимо. Вы всегда сможете попасть в МП",
        more: conf.closed ? "Не запускать" : "Запустить сразу",
        onpress: () => {
            conf.closed = !conf.closed
            createMp(player, conf)
        }
    })
    m.newItem({
        name: "Автор",
        desc: "Для игроков может отображатся ваше имя, или слово СИСТЕМА",
        more: conf.fromSystem ? "СИСТЕМА" : "От моего имени",
        onpress: () => {
            conf.fromSystem = !conf.fromSystem
            createMp(player, conf)
        }
    })
    m.newItem({
        name: "Время жизни сбора на МП",
        desc: "По истечению этого времени попасть в МП уже будет нельзя, даже если вы его не закрывали",
        more: conf.minutesToClose+" минут",
        onpress: () => {
            menu.input(player, "Введите количество минут", conf.minutesToClose, 3, "int").then(min => {
                if (!min || min < 0) return createMp(player, conf)
                conf.minutesToClose = min;
                createMp(player, conf)
            })
        }
    })
    m.newItem({
        name: "Создать МП",
        desc: "Перед тем, как ляпнуть по этой чудесной кнопке - убедитесь что вы все параметры указали правильно, ибо в дальнейшем вы сможете либо открыть/закрыть МП, либо удалить, и больше ничего",
        onpress: () => {
            if(!conf.name) return player.notify("Необходимо указать название мероприятия", "error")
            if (!conf.pos && conf.type != 1) return player.notify("Укажите точку входа в МП", "error")
            if (!conf.posWorld && conf.type != 2) return player.notify("Укажите точку выхода в МП", "error")
            new IventClass(iventtypearray[conf.type], conf.name, conf.minutesToClose, conf.fromSystem ? 'СИСТЕМА' : player.user.name, conf.pos, conf.posWorld, conf.closed);
            player.notify("МП успешно создано", "success")
            adminMenu(player)
        }
    })
    m.open();
}

const adminMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:events:system')) return;
    const m = menu.new(player, "Мероприятия", "Список")
    m.newItem({
        name: "Создать бой",
        onpress: () => {
            m.close();
            fight.create(player)
        }
    })
    m.newItem({
        name: "Начать Отвезти сумку",
        onpress: () => {
            if (!user.hasPermission('admin:boxGameStart:system')) return;
            m.close();
            BoxGameCreateAndRun()
        }
    })
    // adminRun
    GRAB_POS_LIST.map((item, id) => {
        if(!item.adminRun) return;
        m.newItem({
            name: adminGrabEnable.has(id) ? `~r~Остановить ограбление ${item.name}` : `~g~Запустить ограбление ${item.name}`,
            onpress: (itm) => {
                if (item.adminRun > user.admin_level) return player.notify('У вас нет доступа чтобы запустить или остановить данное ограбление', 'error')
                runAdminGrab(id);
                adminMenu(player)
            }
        })
    })
    GANGFIGHT_POS.map((item, id) => {
        if(gangfight.list.has(id)) return;
        if(!item.adminRun) return;
        m.newItem({
            name: `~b~Запустить ${item.name}`,
            onpress: (itm) => {
                if (item.adminRun > user.admin_level) return player.notify('У вас нет доступа чтобы запустить или остановить данное ограбление', 'error')
                gangfight.create(id);
            }
        })
    })
    if(user.isAdminNow(6)){
        m.newItem({
            name: "~r~Вернуть зоны каптов в исходное состояние",
            onpress: () => {
                menu.accept(player).then(status => {
                    if(!status) return;
                    clearGangZone()
                    adminMenu(player)
                    player.notify('Готово')
                })
            }
        })
    }
    m.newItem({
        name: `Создать мероприятие`,
        onpress: () => {
            createMp(player, {
                fromSystem: true,
                type: 1,
                name: "",
                minutesToClose: 10,
                closed: false,
            })
        }
    })
    IventClass.pool.map(item => {
        m.newItem({
            name: `#${item.id} ${item.name}`,
            more: `${!item.closed ? 'Открыто' : 'Закрыто'}`,
            desc: `Организатор ${item.author}, Тип: ${item.type}`,
            onpress: () => {
                itemChoise(player, item)
            }
        })
    })
    m.open();
}
const itemChoise = (player: PlayerMp, item: IventClass) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:events:system')) return;
    const m = menu.new(player, `#${item.id} ${item.name}`, "Действия")
    m.onclose = () => { adminMenu(player)};
    m.newItem({
        name: `Сменить статус`,
        desc: 'Смогут ли новые игроки попасть в МП',
        more: `${!item.closed ? 'Открыто' : 'Закрыто'}`,
        onpress: () => {
            item.closed = !item.closed;
            itemChoise(player, item)
        }
    })
    if (!item.closed){
        m.newItem({
            name: `Отправить всем игрокам приглашение`,
            onpress: () => {
                item.notify();
            }
        })
    }
    m.newItem({
        name: `Удалить`,
        onpress: () => {
            menu.accept(player).then(status => {
                if (!status) return itemChoise(player, item);
                item.delete();
                adminMenu(player)
                player.notify("Мероприятие удалено", "success") 
            })
        }
    })
    m.open();
}

CustomEvent.registerCef('phone:createEvent', (player, name: string) => {
    const user = player.user;
    if(!user) return;
    if(!player.phoneCurrent) return;
    if (!name || name.length < 5) return user.notifyPhone("Система мероприятий", "Не удалось зарегистрировать мероприятие", "Название мероприятия должно быть от 5 до 20 символов", "error");
    if (IventClass.pool.find(q => q.name === name)) return user.notifyPhone("Система мероприятий", "Не удалось зарегистрировать мероприятие", "Мероприятие с таким названием уже зарегистрировано", "error");
    if (!user.bank_number) return user.notifyPhone("Система мероприятий", "Не удалось зарегистрировать мероприятие", "У вас нет банковского счёта, чтобы оплатить услугу анонса мероприятия", "error");
    if (!user.tryRemoveBankMoney(EVENT_ANNOUNCE_COST, true, "Регистрация частного мероприятия", "Новостное агентство")) return;
    new IventClass("gps", name, EVENT_ANNOUNCE_MINUTE, `${user.name}`, { x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading}, null)
})

mp.events.add('playerDeath', (player => {
    if(!player.dimension) return;
    const ivent = IventClass.pool.find(q => q.world === player.dimension);
    if(ivent) ivent.exitWorld(player);
}))

CustomEvent.registerClient('admin:events:system', (player) => {
    adminMenu(player)
})


CustomEvent.registerCef('ivent:enter', (player, id: number) => {
    if(player.dimension) return player.notify("Принимать участие в мероприятии можно только находясь на улице в нулевом измерении", "error");
    if (player.user.attachedToPlace) return player.notify("Вы не можете принимать участие в мероприятии", "error")
    const ivent = IventClass.get(id);
    if (!ivent || !ivent.exist) return player.notify("Мероприятие уже завершилось", "error");
    if (ivent.type !== "tp") return player.notify("Чтобы принять участие в данном мероприятии - нужно добратся до точки проведения", "error");
    ivent.enterWorld(player);
})
