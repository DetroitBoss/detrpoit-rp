import { colshapes } from "./checkpoints";
import {
    DEATHMATH_DM_WEAPONS,
    DEATHMATH_GUNGAME_WEAPONS,
    DEATHMATH_HEADING,
    DEATHMATH_KILLS_LIMITS, DEATHMATH_LIMIT_BET_MAX,
    DEATHMATH_MAPS,
    DEATHMATH_MARKER_PARAM,
    DEATHMATH_MAX_PLAYERS,
    DEATHMATH_MODE,
    DEATHMATH_NAME,
    DEATHMATH_POS,
    DEATHMATH_REGEN_POINTS,
    DEATHMATH_REWARD_2,
    DEATHMATH_REWARD_3,
    DEATHMATH_REWARD_GRAB,
    DEATHMATH_TEAM_1_NAME,
    DEATHMATH_TEAM_2_NAME,
    IGunGameLobbySettings,
    IGunGameSession
} from "../../shared/gungame";
import { menu } from "./menu";
import { system } from "./system";
import { User } from "./user";
import { gui } from "./gui";
import { CustomEvent } from "./custom.event";
import Player = RageEnums.Natives.Player
import {IGunGamePlayerScore, IGunGamePlayerScores} from "../../shared/hudgungame";


colshapes.new(DEATHMATH_POS, DEATHMATH_NAME, player => {
    player.user.setGui('gungame', 'gg:init', getSessionsData(player))
}, DEATHMATH_MARKER_PARAM)

const mainMenu = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const m = menu.new(player, DEATHMATH_NAME);

    const myLobby = DeathMathLobby.getByPlayer(player);
    if(myLobby){
        m.newItem({
            name: '~r~Покинуть лобби',
            onpress: () => {
                menu.accept(player).then(status => {
                    if(!status) return;
                    myLobby.leavePlayer(player);
                    player.notify('Вы успешно покинули лобби', 'success');
                    if(!myLobby.started) mainMenu(player);
                })
            }
        })
        if(myLobby.ownerId === user.id){
            m.newItem({
                name: 'Запустить лобби',
                onpress: () => {
                    if(myLobby.ownerId !== user.id) return player.notify('Вы не владелец лобби чтобы запустить', 'error');
                    if(myLobby.players.length < 2) return player.notify('Недостаточно участников для начала', 'error');
                    myLobby.start();
                }
            })
        }
        m.newItem({
            name: 'Количество участников',
            more: `${myLobby.players.length} / ${Math.min(myLobby.points.length, DEATHMATH_MAX_PLAYERS)}`,
        })
        if(myLobby.bet){
            m.newItem({
                name: 'Ставка',
                more: `${system.numberFormat(myLobby.bet)}`,
            })
        }
    } else {
        m.newItem({
            name: '~g~Создать лобби',
            onpress: () => {

                let mode = 0;
                let password: string;
                let map = 0;
                let kills = DEATHMATH_KILLS_LIMITS[0];
                let bet = 0;
                let armour = true;
                let regen = true;

                let weapon = 0;

            }
        })
        DeathMathLobby.list.filter(q => q.canJoin(player, 0)).map(item => {
            m.newItem({
                name: `${item.ownerName} (${item.ownerId})`,
                more: `${item.bet ? `($${system.numberFormat(item.bet)}) ` : ''}${item.players.length} / ${Math.min(item.points.length, DEATHMATH_MAX_PLAYERS)}`,
                onpress: async () => {
                    let team = item.mode === DEATHMATH_MODE.TEAM ? await menu.selector(player, 'Выберите команду', [DEATHMATH_TEAM_1_NAME, DEATHMATH_TEAM_2_NAME], true) : 0;
                    if(typeof team !== "number" || team < 0) return player.notify('Необходимо выбрать команду', 'error')
                    if(item.password && item.password !== (await menu.input(player, 'Введите пароль от лобби', '', 6, 'password'))) return player.notify('Вы не указали верный пароль от лобби', 'error');
                    if(!item.canJoin(player, team as any)) return player.notify('Лобби более не доступно', 'error');
                    if(item.bet){
                        menu.close(player)
                        if(!await user.tryPayment(item.bet, 'all', () => item.canJoin(player, team as any), 'Участие в ДМ', 'Maze Arena')) return mainMenu(player);
                    }
                    if(!item.newPlayer(player, team as any)) player.notify('Не удалось присоединится к лобби. Вероятнее всего вы принимаете участие в другом мероприятии', 'error');
                    mainMenu(player);
                }
            })
        })
    }


    m.open()
}

CustomEvent.registerCef('gg:join', async (player, sessionId: number, password: string) => {
    const lobby = DeathMathLobby.get(sessionId);
    const user = player.user;
    if (!lobby) return player.notify('Лобби не найдено', 'error')
    if (lobby.password && lobby.password != password) return player.notify('Пароль введен неверно', 'error');

    let team = lobby.mode === DEATHMATH_MODE.TEAM ? await menu.selector(player, 'Выберите команду', [DEATHMATH_TEAM_1_NAME, DEATHMATH_TEAM_2_NAME], true) : 0;
    if (typeof team !== "number" || team < 0) return player.notify('Необходимо выбрать команду', 'error')
    if (!lobby.canJoin(player, team as any)) return player.notify('Лобби более не доступно', 'error');
    if (lobby.bet > 0) {
        if (!await user.tryPayment(lobby.bet, 'all', () => lobby.canJoin(player, team as any), 'Участие в ДМ', 'Maze Arena'))
            return player.notify('Недостаточно средств', 'error');
    }
    if (!lobby.newPlayer(player, team as any)) player.notify('Не удалось присоединится к лобби. Вероятнее всего вы принимаете участие в другом мероприятии', 'error');
    updateSessionsData(player)
})

CustomEvent.registerCef('gg:start', (player) => {
    const myLobby = DeathMathLobby.getByPlayer(player);
    if (!myLobby || myLobby.owner != player) return player.notify('Вы не создатель лобби', 'error')
    if (myLobby.players.length < 2) return player.notify('Недостаточно участников для начала', 'error');
    player.user.setGui(null)
    myLobby.start()
})

CustomEvent.registerCef('gg:leave', (player) => {
    const myLobby = DeathMathLobby.getByPlayer(player);
    if (!myLobby) return player.notify('Вы не в лобби', 'error')
    myLobby.leavePlayer(player);
    updateSessionsData(player)
})

const updateSessionsData = (player: PlayerMp): void => {
    CustomEvent.triggerCef(player, 'gg:init', getSessionsData(player))
}

const getSessionsData = (player: PlayerMp): IGunGameSession[] => {
    return DeathMathLobby.list.filter(l => !l.ended).map(lobby => {
        return {
            id: lobby.id,
            name: lobby.name,
            maxPlayers: DEATHMATH_MAX_PLAYERS,
            password: !!lobby.password,
            btnType: lobby.owner == player ? 'create' : lobby.id == DeathMathLobby.getByPlayer(player)?.id ? 'cancel' : 'connect',
            online: lobby.players.length,
            place: lobby.cfgIndex,
            price: lobby.bet,
            time: lobby.startTime,
            type: lobby.mode == DEATHMATH_MODE.TEAM ? 'teamfight' : lobby.mode == DEATHMATH_MODE.DEFAULT ? 'deathmatch' : 'gungame',
        }
    })
}

const createDmLobby = async (player: PlayerMp, settings: IGunGameLobbySettings) => {
    const user = player.user;
    if (!user || user.attachedToPlace) return player.notify('Вы не можете создать лобби', 'error');
    if (settings.bet && (settings.bet > DEATHMATH_LIMIT_BET_MAX || settings.bet < 0 || isNaN(settings.bet)) )
        return player.notify(`Введите ставку от 0 до ${DEATHMATH_LIMIT_BET_MAX}`, 'error');
    if (settings.bet > 0) {
        if (!await user.tryPayment(system.parseInt(settings.bet), 'all', () => !user.attachedToPlace, 'Участие в ДМ', 'Maze Arena')) 
            return player.notify('Недостаточно средств', 'error');
    }
    new DeathMathLobby(
        settings.name,
        settings.map, 
        settings.mode, 
        settings.password, 
        player, 
        settings.weapon, 
        settings.kills, 
        0, 
        system.parseInt(settings.bet), 
        settings.armour, 
        settings.regen
    )
    updateSessionsData(player)
}
CustomEvent.registerCef('gg:create', createDmLobby)

export class DeathMathLobby {
    static list: DeathMathLobby[] = []
    static get(id: number){
        return this.list.find(q => q.id === id)
    }
    static getByPlayer(player: PlayerMp){
        return this.list.find(q => q && !q.ended && q.players.find(z => z && player && z.id === player.id))
    }
    readonly id: number;
    readonly name: string;
    readonly password: string;
    readonly mode: DEATHMATH_MODE;
    readonly cfgIndex: number;
    readonly weapon: number;
    readonly killsLimit: number;
    public started = false;
    readonly startTime: string;
    public ended = false;
    readonly armour: boolean = false;
    readonly regen: boolean = false;
    public players: PlayerMp[] = [];
    public team1:number[] = [];
    public team2:number[] = [];
    bank = 0;
    bet = 0;
    public playersScore = new Map<number, {id: number, kills: number, death: 0, weapon: number, weaponKills:number}>()
    get owner(){
        this.check()
        return this.players[0];
    }
    get ownerId(){
        return this.owner?.dbid
    }
    get ownerName(){
        return this.owner?.user?.name
    }
    async giveWeapon(player: PlayerMp){
        if(!mp.players.exists(player)) return this.leavePlayer(player);
        const user = player.user;
        if(!user) return;
        this.check()
        if(!this.players.find(q => q && q.dbid === player.dbid)) return this.leavePlayer(player);
        let data = this.playersScore.get(player.dbid);
        if(!data) return this.leavePlayer(player);
        user.removeWeapon()
        if(this.mode === DEATHMATH_MODE.GUNGAME) user.giveWeapon(DEATHMATH_GUNGAME_WEAPONS[data.weapon].weapon, 240)
        else if(this.mode === DEATHMATH_MODE.RANDOM) user.giveWeapon(system.randomArrayElement(DEATHMATH_DM_WEAPONS).weapon, 240)
        else user.giveWeapon(DEATHMATH_DM_WEAPONS[this.weapon].weapon, 240)
    }
    async respawn(player: PlayerMp, position?:number, killer?:PlayerMp){
        const user = player.user;
        if(!user) return;
        if(!this.started){
            const i = this.players.findIndex(q => q && q.dbid === player.dbid);
            if(i > -1) this.players.splice(i, 1)
            return;
        }

        if(killer && mp.players.exists(killer)){
            if(this.players.find(q => q && q.dbid === killer.dbid)){
                let killerData = this.playersScore.get(killer.dbid);
                if(killerData){
                    if(this.mode !== DEATHMATH_MODE.TEAM || this.team1.includes(player.dbid) !== this.team1.includes(killer.dbid)) killerData.kills++;
                    if(this.mode === DEATHMATH_MODE.GUNGAME){
                        killerData.weaponKills++;
                        const wcfg = DEATHMATH_GUNGAME_WEAPONS[killerData.weapon];
                        if(wcfg.kills <= killerData.weaponKills){
                            if(DEATHMATH_GUNGAME_WEAPONS[killerData.weapon+1]){
                                killerData.weaponKills = 0;
                                killerData.weapon += 1;
                                setTimeout(() => {
                                    this.giveWeapon(killer)
                                }, 100)
                            } else {
                                this.end(killer);
                            }
                        }
                    } else {
                        if(killerData.kills >= this.killsLimit){
                            this.end(killer);
                        }
                    }
                    this.players.map(target =>
                        CustomEvent.triggerCef(target, 'captureMinimal:kill', killer.user.name, player.user.name))
                    if(this.regen){
                        let add = DEATHMATH_REGEN_POINTS;
                        let hpneed = 100 - killer.health;
                        let hpadd = Math.min(hpneed, add);
                        add-=hpadd;
                        killer.user.health += hpadd;
                        if(add > 0 && this.armour) killer.user.armour += add;
                    }
                    this.playersScore.set(killer.dbid, killerData);
                    if(mp.players.exists(player)){
                        let myData = this.playersScore.get(player.dbid);
                        if(myData){
                            myData.death++;
                            this.playersScore.set(player.dbid, myData)
                        }
                    }
                }
            }
            const playerScores = [...this.playersScore.values()]
            this.players.forEach(p => {
                const topPlayers = playerScores
                    .sort((a, b) => a.kills - b.kills)
                    .slice(0, 3)
                    .map(s => {
                        return {name: this.players.find(player => player.user.id == s.id).user.name, kills: s.kills}
                    })
                CustomEvent.triggerCef(p, 'HudGunGame:show', ({ myKills: this.playersScore.get(p.dbid).kills, topPlayers: topPlayers } as IGunGamePlayerScores))
            })

            await system.sleep(1000)
            if(!mp.players.exists(player)) return;
            if(this.ended) return this.leavePlayer(player)
        }

        const pos = typeof position === 'number' ? this.points[position] : system.randomArrayElement(this.points)
        if(typeof position !== 'number') user.removeWeapon();
        user.armour = this.armour ? 100 : 0;
        user.teleport(pos.x, pos.y, pos.z, pos.h, this.id, true);
        setTimeout(() => {
            this.check()
            if(!DeathMathLobby.getByPlayer(player)) return;
            this.giveWeapon(player)
        }, system.TELEPORT_TIME * 1.2);
    }
    end(player: PlayerMp){
        if(this.ended) return;
        const user = player.user;
        this.ended = true;
        this.check()
        let finalBank = this.bank - ((this.bank / 100) * DEATHMATH_REWARD_GRAB);
        if(this.mode !== DEATHMATH_MODE.TEAM){
            this.players.map(target => {
                target.notify(`Победил ${user.name}`, 'success');
            })

            let winner = system.sortArrayObjects([...this.playersScore].map(q => q[1]), [
                {id: 'kills', type: "DESC"},
                {id: 'death', type: "ASC"},
            ]).slice(0, 3)

            if(winner[2]){
                let target = User.get(winner[2].id);
                if(target) {
                    let sum = ((finalBank / 100) * DEATHMATH_REWARD_3);
                    target.user.addMoney(sum, true, 'Третье место в ДМ');
                    finalBank -= sum;
                }
            }
            if(winner[1]){
                let target = User.get(winner[1].id);
                if(target) {
                    let sum = ((finalBank / 100) * DEATHMATH_REWARD_2);
                    target.user.addMoney(sum, true, 'Второе место в ДМ');
                    finalBank -= sum;
                }
            }
            if(winner[0]){
                let target = User.get(winner[0].id);
                if(target) {
                    target.user.addMoney(finalBank, true, 'Первое место в ДМ');
                }
            }
        } else {
            let team1score = 0;
            let team2score = 0;
            this.playersScore.forEach(item => {
                if(this.team1.includes(item.id)) team1score += item.kills
                else team2score += item.kills;
            })
            let winners = (team1score > team2score ? [...this.playersScore].map(q => q[1]).filter(q => this.team1.includes(q.id)) : [...this.playersScore].map(q => q[1]).filter(q => this.team2.includes(q.id))).map(q => q.id)
            let sumPerOne = finalBank / winners.length;
            winners.map(targetid => {
                let target = User.get(targetid);
                if(target) {
                    target.user.addMoney(sumPerOne, true, 'Победа вашей команды в ДМ');
                }
            })
            this.players.map(target =>
                target.notify(`Победила команда ${team1score > team2score ? DEATHMATH_TEAM_1_NAME : DEATHMATH_TEAM_2_NAME}`, winners.includes(target.dbid) ? 'success' : 'error'))
        }
        setTimeout(() => {
            this.check()
            this.players.map(target =>
                this.leavePlayer(target))
        }, 5000)
    }
    start(){
        this.check()
        this.started = true;
        let pos = new Array(this.points.length)
        this.players.map(target => {
            target.user.currentWeapon = null;
            target.user.cuffed = false;
            this.playersScore.set(target.dbid, {id: target.dbid, kills: 0, death: 0, weapon: 0, weaponKills: 0});
            menu.close(target);
            let index = system.randomArrayElementIndex(pos)
            pos.splice(index, 1)
            this.respawn(target, index);
            CustomEvent.triggerCef(target, 'captureMinimal:show', true)
            CustomEvent.triggerCef(target, 'HudGunGame:show', {
                myKills: 0,
                topPlayers: this.players.slice(0, 3).map(p => {
                    return { name: p.user.name, kills: 0 }
                })
            } as IGunGamePlayerScores)
            target.outputChatBox(`Для предварительного выхода используйте команду /exit`)
        });
    }
    canJoin(player: PlayerMp, team: 0 | 1){
        this.check()
        return (this.canenter && !player.user.attachedToPlace && !this.players.find(q => q.id === player.id));
    }
    newPlayer(player: PlayerMp, team: 0 | 1){
        if(!this.canJoin(player, team)) return;
        if (team === 0) this.team1.push(player.dbid)
        else if (team === 1) this.team2.push(player.dbid)
        this.players.push(player);
        this.bank += this.bet;
        return true;
    }
    leavePlayer(player: PlayerMp){
        let data = [...this.players];
        const index = data.findIndex(q => q && q.id === player.id)
        if(index === -1) return;
        data.splice(index, 1)
        if(this.team1.find(q => q === player.dbid)) this.team1.splice(this.team1.findIndex(q => q === player.dbid), 1)
        if(this.team2.find(q => q === player.dbid)) this.team2.splice(this.team2.findIndex(q => q === player.dbid), 1)
        if(this.started){
            if(mp.players.exists(player)){
                CustomEvent.triggerCef(player, 'captureMinimal:show', false)
                CustomEvent.triggerCef(player, 'HudGunGame:hide')
                player.user.teleport(DEATHMATH_POS.x, DEATHMATH_POS.y, DEATHMATH_POS.z, DEATHMATH_HEADING, 0, true);
                player.user.removeWeapon()
            }
        }
        this.players = [...data];
        this.check()
        if (this.armour) player.user.armour = 0;
    }
    private check(){
        this.players.map((target => {
            if(!mp.players.exists(target)) this.leavePlayer(target)
        }))
        if(this.started && !this.ended){
            if(this.players.length === 1 || (this.mode === DEATHMATH_MODE.TEAM && (this.team1.length === 0 || this.team2.length === 0))) this.end(this.players[0])
        }
    }
    private get canenter(){
        return !this.ended && !this.started && this.players.length < Math.min(this.points.length, DEATHMATH_MAX_PLAYERS)
    }
    get config(){
        return DEATHMATH_MAPS[this.cfgIndex]
    }
    get center(){
        return this.config?.center
    }
    get points(){
        return this.config?.spawnPoints
    }
    constructor(name: string, cfgIndex: number, mode: DEATHMATH_MODE, password: string, owner: PlayerMp, weapon: number, kills: number, team: 0 | 1, bet: number, armour: boolean, regen: boolean) {
        this.id = system.personalDimension;
        this.cfgIndex = cfgIndex;
        this.mode = mode;
        this.weapon = weapon;
        this.armour = armour;
        this.startTime = system.timeStampStringTime(system.timestamp)
        this.regen = regen;
        this.password = password;
        this.bet = bet;
        this.name = name;
        this.killsLimit = kills
        this.newPlayer(owner, team);
        DeathMathLobby.list.push(this);
    }

    static death(player: PlayerMp, killer?: PlayerMp){
        const lobby = DeathMathLobby.getByPlayer(player)
        if(!lobby) return false;
        lobby.respawn(player, null, killer)
        return true;
    }

}

gui.chat.registerCommand('exit', (player) => {
    const user = player.user;
    if(!user) return;
    const lobby = DeathMathLobby.getByPlayer(player)
    if(lobby) lobby.leavePlayer(player)
})

mp.events.add('playerDeath', ((player, reason?: number, killer?: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    DeathMathLobby.death(player, killer)
}))


mp.events.add('playerQuit', (player => {
    const user = player.user;
    if(!user) return;
    const lobby = DeathMathLobby.getByPlayer(player)
    if(lobby) lobby.leavePlayer(player)
}))