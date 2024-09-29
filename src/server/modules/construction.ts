import {system} from "./system";
import {
    ALLOW_JOIN_AFTER_START,
    CONSTRUCTION_DRESS_FEMALE,
    CONSTRUCTION_DRESS_MALE,
    CONSTRUCTION_HOUSES,
    CONSTRUCTION_MAX,
    CONSTRUCTION_MIN_FOR_START,
    CONSTRUCTION_REGISTER_POS,
    constructionMySessionItem,
    constructionSessionItem
} from "../../shared/construction";
import {colshapeHandle, colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {User} from "./user";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";
import {getAchievConfigByType} from "../../shared/achievements";
import {getVipConfig} from "../../shared/vip";
import {JOB_TASK_MANAGER_EVENT} from "./battlePass/tasks/jobTaskManager";
import { getX2Param } from "./usermodule/static";


CustomEvent.registerCef('flat:get', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const lobby = ConstructionSystem.getByPlayer(player);
    if(!lobby) return player.notify('Лобби не обнаружено', 'error');
    if(lobby.setsStatus.get(id)) return player.notify('Данное задание уже выполнено', 'error');
    if([...lobby.setsTaken].find(q => q[1] === user.id)) return player.notify('Вы уже выполняете задание', 'error');
    if(lobby.setsTaken.has(id)) return player.notify('Данное задание уже выполняется', 'error');
    if(lobby.ended) return player.notify('Работа завершена', 'error');
    if(system.rebootStarter) {
        lobby.exit()
        return player.notify('Сервер скоро будет перезапущен. Награда за уже выполненые задания уже выплачена', 'error');
    }
    const cfg = lobby.getSetsConfig(id);
    if(cfg.group){
        const checkgroup = cfg.group - 1;
        if(checkgroup){
            const needList = [...lobby.setsStatus].filter(q => !q[1]).map(q => q[0]).filter(q => lobby.config.sets[q][8] === checkgroup).length
            if(needList) return player.notify(`Чтобы взять данное задание необходимо выполнить все задания из группы ${checkgroup}`, 'error')
        }
    }

    lobby.setsTaken.set(id, user.id);
    const p = system.randomStr(4)
    lobby.setsTakenId.set(id, p);

    CustomEvent.triggerClient(player, 'construction:set:start', lobby.configId, id)
    lobby.players.map(targetid => {
        const target = User.get(targetid);
        if(target) CustomEvent.triggerCef(target, 'flat:res', [...lobby.setsStatus], [...lobby.setsCount], [...lobby.setsTaken], lobby.configId)
    })
    setTimeout(() => {
        if(lobby.setsTaken.get(id) === user.id && lobby.setsTakenId.get(id) == p) lobby.setsTaken.delete(id)
    }, (lobby.config.setSecond) * 1000)
})
CustomEvent.registerCef('flat:leave', (player) => {
    const user = player.user;
    if(!user) return;
    const lobby = ConstructionSystem.getByPlayer(player);
    user.teleport(CONSTRUCTION_REGISTER_POS.x, CONSTRUCTION_REGISTER_POS.y, CONSTRUCTION_REGISTER_POS.z, 0, 0, true)
    user.setJobDress(null)
    if(lobby) lobby.players.splice(lobby.players.indexOf(player.dbid), 1)
    CustomEvent.triggerClient(player, 'construction:leave')
})
CustomEvent.registerCef('flat:create', (player, pass: boolean) => {
    const user = player.user;
    if(!user) return;
    if(user.attachedToPlace) return player.notify('Вы не можете создать сессию', 'error')
    if(system.rebootStarter) return player.notify('Сервер скоро будет перезапущен', 'error');
    const item = new ConstructionSystem(system.randomArrayElementIndex(CONSTRUCTION_HOUSES), user.id, pass)
    item.players.push(user.id)
    player.flatReady = false;
    menuC(player)
})
CustomEvent.registerCef('flat:select', (player, id: number, pass?: string) => {
    const user = player.user;
    if(!user) return;
    if(user.attachedToPlace) return player.notify('Вы не можете присоединится к сессии', 'error')
    const lobby = ConstructionSystem.get(id);
    if(!lobby) return player.notify('Лобби не обнаружено');

    if(lobby.password){
        if(!pass) return player.notify('Необходимо указать пароль');
        if(pass.toUpperCase() !== lobby.password.toUpperCase()) return player.notify('Пароль указан не верно', 'error');
    }
    if(lobby.players.length >= CONSTRUCTION_MAX) return player.notify('Лимит участников превышен', 'error');
    if(system.rebootStarter) return player.notify('Сервер скоро будет перезапущен', 'error');
    if(!ALLOW_JOIN_AFTER_START && lobby.started) return player.notify('Лобби уже запущено', 'error')
    if(!lobby.players.includes(user.id)) lobby.players.push(user.id)
    if(lobby.started) lobby.enterInterior(player)
    else {
        player.flatReady = false;
        menuC(player);
    }
})
CustomEvent.registerCef('flat:ready', (player, status: boolean) => {
    const user = player.user;
    if(!user) return;
    if(system.rebootStarter) return player.notify('Сервер скоро будет перезапущен', 'error');
    const lobby = ConstructionSystem.getByPlayer(player);
    if(!lobby) return user.setGui(null);
    player.flatReady = status;
    let items:constructionMySessionItem[] = lobby.players.map(id => {
        const target = User.get(id)
        if(target){
            return {
                id: target.dbid,
                name: target.user.name,
                status: target.flatReady,
                owner: lobby.owner === target.dbid
            }
        }
    })
    let start = false;
    let min = mp.config.announce ? CONSTRUCTION_MIN_FOR_START : 1;
    if(lobby.players.length >= min && !items.find(q => !q.status)) start = true
    if(start) lobby.start()
    else {
        lobby.players.map(id => {
            const target = User.get(id);
            if(!target) return;
            CustomEvent.triggerCef(target, 'flat:showmy', items, lobby.password)
        })
    }
})

const menuC = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    if(user.level < LEVEL_PERMISSIONS.ROOM) return player.notify(`Доступно с ${LEVEL_PERMISSIONS.ROOM} уровня персонажа`, 'error');
    //if(user.fraction) return player.notify(`Данная работа недоступна тем, кто состоит в организации`, 'error');
    // const m = menu.new(player, 'Ремонт');
    const lobby = ConstructionSystem.getByPlayer(player);
    if(!lobby && user.attachedToPlace) return player.notify('Вы уже участвуете в другом мероприятии', 'error');

    if(lobby){

        lobby.check()

        let items:constructionMySessionItem[] = lobby.players.map(id => {
            const target = User.get(id)
            if(target){
                return {
                    id: target.dbid,
                    name: target.user.name,
                    status: !!target.flatReady,
                    owner: lobby.owner === target.dbid
                }
            }
        })
        user.setGui('flat', 'flat:showmy', items, lobby.password)


    } else {
        const items:constructionSessionItem[] = ConstructionSystem.list.filter(q => {
            q.check()
            return (ALLOW_JOIN_AFTER_START || !q.started) && q.players.length > 0 && q.players.length < CONSTRUCTION_MAX
        }).map(q => {
            return  {
                id: q.id,
                name: q.ownerName,
                pass: !!q.password
            }
        });
        user.setGui('flat', 'flat:show', items)

    }


    // m.open();
}

colshapes.new(CONSTRUCTION_REGISTER_POS, 'Ремонт квартиры', player => {
    menuC(player)
}, {
    type: 27,
    drawStaticName: "scaleform"
})


export class ConstructionSystem {
    static list: ConstructionSystem[] = [];
    private colshape: colshapeHandle;
    static get(id: number){
        return this.list.find(q => q.id === id);
    }
    static getByPlayer(player: PlayerMp){
        return this.list.find(q => {
            q.check()
            return q.players.find(s => s === player.dbid)
        });
    }
    readonly id: number;
    get dimension(){
        return this.id;
    }
    owner: number;
    ownerName: string;
    password: string;
    players: number[] = [];
    get playersCount(){
        this.check()
        return this.players.length
    }
    readonly configId: number;
    started = false;
    ended = false;
    get config(){
        return CONSTRUCTION_HOUSES[this.configId];
    }
    get name(){
        return this.config.name
    }
    get reward(){
        return this.config.reward
    }
    /** Список задач, сколько осталось сделать */
    setsCount = new Map<number, number>();
    /** Список взятых задач */
    setsTaken = new Map<number, number>();
    /** Код для списка взятых задач */
    setsTakenId = new Map<number, string>();
    /** Список выполненых задач */
    setsStatus = new Map<number, number>();
    usersSetsCount = new Map<number, number>();
    setSuccess(id: number, who: number){
        if(this.setsCount.get(id)) this.setsCount.set(id, getX2Param('testserver') ? this.setsCount.get(id) - 1 : 0)
        if(!this.usersSetsCount.has(who)) this.usersSetsCount.set(who, 1)
        else this.usersSetsCount.set(who, this.usersSetsCount.get(who) + 1)
        this.setsTaken.delete(id)
        this.check()
        if(!this.setsCount.get(id)){
            this.setsStatus.set(id, who);
            this.players.map(targetid => {
                const target = User.get(targetid);
                if(target) CustomEvent.triggerClient(target, 'construction:set:success', this.configId, id)
            })
        }
        this.players.map(targetid => {
            const target = User.get(targetid);
            if(target) CustomEvent.triggerCef(target, 'flat:res', [...this.setsStatus], [...this.setsCount], [...this.setsTaken], this.configId)
        })
        if(![...this.setsCount].map(q => q[1]).find(q => q)) this.exit()
    }
    /** Массив с задачами которые выполнены */
    get successItems(){
        return [...this.setsStatus].filter(q => q[1]).map(q => q[0])
    }
    getSetsConfig(id: number){
        const cfg = this.config.sets[id];
        if(!cfg) return null;
        return {
            hash: cfg[0],
            x: cfg[1],
            y: cfg[2],
            z: cfg[3],
            h: cfg[4],
            name: cfg[5],
            scenario: cfg[6],
            count: cfg[7],
            group: cfg[8],
        }
    }
    getSetsName(id: number){
        return this.getSetsConfig(id).name
    }
    constructor(configId: number, owner: number, withpassword = false) {
        this.id = system.personalDimension
        this.configId = configId;
        this.owner = owner;
        const ownerPl = User.get(owner);
        if(!ownerPl) return;
        this.ownerName = ownerPl.user.name;
        this.setsStatus = new Map();
        this.config.sets.map((item, id) => {
            this.setsStatus.set(id, 0)
            this.setsCount.set(id, item[7] || 1)
        })
        if(withpassword) this.password = system.randomStr(4).toUpperCase();

        ConstructionSystem.list.push(this);
    }

    enterInterior(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        CustomEvent.triggerClient(player, 'construction:set:enter', this.configId, this.successItems)
        user.teleport(this.config.pos.x, this.config.pos.y, this.config.pos.z, this.config.pos.h, this.dimension, true);
        user.setJobDress(user.male ? CONSTRUCTION_DRESS_MALE : CONSTRUCTION_DRESS_FEMALE)
    }
    check(){
        if(this.ended) return;
        if(!this.started){
            this.players.map((id, index) => {
                const player = User.get(id);
                if (!player || !mp.players.exists(player) || system.distanceToPos(player.position, CONSTRUCTION_REGISTER_POS) > 50) return this.players.splice(index, 1)
            })
        }
    }

    get totalTaskCount(){
        let sum = 0;
        this.config.sets.map(item => {
            sum += item[7] || 1;
        })
        return sum;
    }

    exit(){
        if(this.ended) return;
        this.ended = true;
        this.check();

        const sumperone = this.config.reward / this.totalTaskCount

        this.usersSetsCount.forEach((count, who) => {
            if(count > 0 && this.ended){

                let sum = sumperone * count;
                const player = User.get(who);

                const vipPaymentMultiplier = getVipConfig(player?.user?.vip)?.jobPaymentMultiplier ?? 1;
                sum *= vipPaymentMultiplier;

                if(player) {
                    player.user.addMoney(sum, true, 'Выплата за завершение стройки');

                    player.user.achiev.achievTickByType("flatCount")
                    player.user.achiev.achievTickByType("flatSum", sum)
                }
            }
        })


        // mp.players.toArray().filter(q => q.user && q.dimension === this.dimension).map(player => this.exitPlayer(player))

        this.players = [];

    }
    // exitPlayer(player: PlayerMp){
    //     const user = player.user;
    //     if(!user) return;
    //     user.teleport(CONSTRUCTION_REGISTER_POS.x, CONSTRUCTION_REGISTER_POS.y, CONSTRUCTION_REGISTER_POS.z+1, 0, 0, true);
    //     this.players.splice(this.players.findIndex(q => q === user.id), 1);
    // }
    start(){
        this.check()
        this.colshape = colshapes.new(new mp.Vector3(this.config.pos.x, this.config.pos.y, this.config.pos.z), 'Материалы', player => {
            const user = player.user;
            if(!user) return;

            user.setGui('flatres', 'flat:res', [...this.setsStatus], [...this.setsCount], [...this.setsTaken], this.configId)

        }, {
            dimension: this.dimension,
            drawStaticName: "scaleform"
        })

        this.players.map(id => {
            const player = User.get(id);
            if(!player || !mp.players.exists(player)) return;
            this.enterInterior(player)
        })

        this.started = true;
    }
}

CustomEvent.registerClient('construction:set:ok', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const block = ConstructionSystem.getByPlayer(player);
    if(!block) return player.notify('Вы не ремонтируете квартиру', 'error');
    const item = block.setsTaken.get(id)
    if(item !== user.id) return player.notify('Не вы выполняете данное задание', 'error');
    block.setSuccess(id, user.id);
    mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'apartmentRepair');
    player.notify('Задание выполнено', 'success')
})