import {CustomEvent} from "./custom.event";
import {DeathMathPlayerBase, DeathMathTeamStartPos, eventEnd} from "../../shared/deathmatch";
import {system} from "./system";
import {menu} from "./menu";
import {GangwarGarage} from "./gangwar.garages";


interface DeathMathPlayer extends DeathMathPlayerBase {
    player: PlayerMp,
    /** Место, откуда игрок входил в бой */
    enter: {x: number, y: number, z: number, h: number, d: number},
}
export const enum DeathMathStatus {
    wait = 0,
    started = 1,
    ended = 2,
}

let ids = 1;

export class DeathMath {
    static list: DeathMath[] = [];
    started: boolean;
    private end: boolean;
    cTime: number = null;
    static getByPlayer(player: PlayerMp){
        return this.list.find(q => q.totalpool.find(s => mp.players.exists(s.player) && s.player === player))
    }
    /** Уникальный ИД боя */
    readonly id: number;
    /** Название боя */
    name: string;
    /** Первая команда */
    team2: DeathMathPlayer[] = [];
    /** Вторая команда */
    team1: DeathMathPlayer[] = [];
    /** Список тех, кто в бое не учавствует и просто наблюдает. Рассчитано на то, чтобы тут были админы.*/
    spectators: DeathMathPlayer[] = [];
    /** Первая команда (Название) */
    team2_name: string;
    /** Вторая команда (Название) */
    team1_name: string;
    /** Первая команда (Изображение) */
    team2_image: string;
    /** Вторая команда (Изображение) */
    team1_image: string;
    /** Первая команда (Количество очков) */
    team2_score: number = 0;
    /** Вторая команда (Количество очков) */
    team1_score: number = 0;
    /** Место появления второй команды */
    team2_start: DeathMathTeamStartPos
    /** Место появления второй команды */
    team1_start: DeathMathTeamStartPos

    /** Измерение боя */
    readonly dimension: number;
    /** Текущий статус боя */
    status: DeathMathStatus;
    /** Центральная позиция боя */
    center: Vector3Mp;
    radius: number;
    weapon?: string;
    ammo?: number = 1;
    armour: number;
    /** Время, через сколько тех, кто выживет выкинет обратно. В секундах */
    exitTimeout: number = 0;
    /** Ограничение по времени в секундах */
    time: number = 0;
    /** Время в секундах перед началом боя */
    wait = 0;
    /** Отключать ли управление перед началом боя */
    wait_freeze = true;
    /** Респавн необходимо произвести в больнице */
    hospital = false;
    constructor(center: Vector3Mp, radius: number) {
        this.id = ids;
        this.center = center;
        this.radius = radius;
        this.dimension = system.personalDimension
        ids++;

        DeathMath.list.push(this);
    }
    get allowInventory(){
        return !this.weapon
    }
    insertPlayer(player: PlayerMp, team: 1|2){
        if(!mp.players.exists(player)) return;
        if(DeathMath.getByPlayer(player)) return;
        const item = team == 1 ? this.team1 : this.team2;
        item.push({player, enter: {x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading, d: player.dimension}, id: player.dbid, name: player.user.name, score: 0, death: 0})
    }
    insertSpectator(player: PlayerMp){
        if(!mp.players.exists(player)) return;
        if(DeathMath.getByPlayer(player)) return;
        this.spectators.push({player, enter: {x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading, d: player.dimension}, id: player.dbid, name: player.user.name, score: 0, death: 0})
    }
    leaveNotify(name: string, dead = false, killer?:string){
        [...this.totalpool, ...this.spectators].map(item => {
            //item.player.notify(`${name} ${dead ? 'погиб' : `покинул ${this.name}`}`, 'error')
            if(dead && killer){
                CustomEvent.triggerCef(item.player, 'capture:kill', killer, name, this.team1_score, this.team2_score, this.cTime)
            }
        })
    }
    get totalpool(){
        return [...this.team1, ...this.team2].filter(item => mp.players.exists(item.player))
    }
    check(){
        this.team1.map((item, index) => {
            if(!mp.players.exists(item.player)) {
                this.team1.splice(index, 1);
                this.leaveNotify(item.name);
            }
        })
        this.team2.map((item, index) => {
            if(!mp.players.exists(item.player)) {
                this.team2.splice(index, 1);
                this.leaveNotify(item.name);
            }
        })
        this.spectators.map((item, index) => {
            if(!mp.players.exists(item.player)) {
                this.spectators.splice(index, 1);
            }
        })
    }
    get data(): [DeathMathPlayerBase[], DeathMathPlayerBase[], string, string, string, [number, number, number, number], number, number, string, string]{
        this.check()
        return [this.team1.map(q => {
            return {
                id: q.id,
                name: q.name,
                score: q.score,
                death: q.death,
            }
        }), this.team2.map(q => {
            return {
                id: q.id,
                name: q.name,
                score: q.score,
                death: q.death,
            }
        }), this.team1_name, this.team2_name, this.name, [this.center.x, this.center.y, this.center.z, this.radius], this.dimension, this.time, this.team1_image, this.team2_image]
    }
    getTeamPlayer(player: PlayerMp){
        this.check()
        if(this.team1.find(q => q.player === player)) return 1;
        if(this.team2.find(q => q.player === player)) return 2;
        if(this.spectators.find(q => q.player === player)) return 3;
        return 0
    }
    private startHandleSpectators() {
        this.spectators.map(item => {
            const player = item.player;
            const user = player.user;
            user.teleport(this.center.x, this.center.y, this.center.z, 0, this.dimension, true);
            setTimeout(() => {
                if(!mp.players.exists(player)) return;
                CustomEvent.triggerClient(player, 'deathmath:start', this.data , true)
            }, system.TELEPORT_TIME + 3000)
        })
    }
    startHandleTotalpoolForCapture(zoneId: number) {
        this.totalpool.map(item => {
            const player = item.player;
            const team = this.getTeamPlayer(player);
            if (!team) return;
            if (team === 3) return;
            const user = player.user;
            if (this.weapon && user.currentWeapon) {
                user.currentWeapon = null;
            }
            const pos = team === 1 ? this.team1_start : this.team2_start
            if (pos) {
                const rand = (team === 1 ? this.team1 : this.team2).length > 1;
                if (rand) {
                    pos.x += system.getRandomInt(0 - pos.r, pos.r)
                    pos.y += system.getRandomInt(0 - pos.r, pos.r)
                }
                user.teleport(pos.x, pos.y, pos.z, pos.h, this.dimension + 2, true);
            } else {
                player.dimension = this.dimension;
            }
            if (this.wait) {
                if (this.wait_freeze) {
                    user.disableAllControls(true);
                } else {
                    CustomEvent.triggerClient(player, 'deathmath:start', this.data, false, false, this.wait, zoneId)
                }
            }
        })
        setTimeout(() => {
            this.totalpool.map(item => {
                const player = item.player;
                const team = this.getTeamPlayer(player);
                if (!team) return;
                if (team === 3) return;
                const user = player.user;
                if (!mp.players.exists(player)) return;
                if (this.weapon) player.user.giveWeapon(this.weapon, this.ammo)
                if (team === 2) player.dimension -= 2;
                CustomEvent.triggerClient(player, 'deathmath:start', this.data, false, true, null, zoneId)
                if (this.wait && this.wait_freeze){
                    setTimeout(() => {
                        if(!mp.players.exists(player)) return;
                        user.disableAllControls(false);
                    }, this.wait * 1000)
                }
                if (this.armour) player.user.armour = this.armour;
            })
        }, this.wait ? this.wait * 1000 : system.TELEPORT_TIME + 3000)
    }

    private startHandleTotalpool() {
        this.totalpool.map(item => {
            const player = item.player;
            const team = this.getTeamPlayer(player);
            if(!team) return;
            if(team === 3) return;
            const user = player.user;
            if(this.weapon && user.currentWeapon) {
                user.currentWeapon = null;
            }
            const pos = team === 1 ? this.team1_start : this.team2_start
            if(pos){
                const rand = (team === 1 ? this.team1 : this.team1).length > 1;
                if(rand){
                    pos.x += system.getRandomInt(0 - pos.r, pos.r)
                    pos.y += system.getRandomInt(0 - pos.r, pos.r)
                }
                user.teleport(pos.x, pos.y, pos.z, pos.h, this.dimension, true);
            } else {
                player.dimension = this.dimension;
            }
            if(this.wait) {
                if(this.wait_freeze){
                    user.disableAllControls(true);
                } else {
                    CustomEvent.triggerClient(player, 'deathmath:start', this.data, false, false, this.wait)
                }
            }
        })
        setTimeout(() => {
            this.totalpool.map(item => {
                const player = item.player;
                const team = this.getTeamPlayer(player);
                if (!team) return;
                if (team === 3) return;
                const user = player.user;
                if (!mp.players.exists(player)) return;
                if (this.weapon) player.user.giveWeapon(this.weapon, this.ammo)
                CustomEvent.triggerClient(player, 'deathmath:start', this.data)
                if (this.wait && this.wait_freeze){
                    setTimeout(() => {
                        if(!mp.players.exists(player)) return;
                        user.disableAllControls(false);
                    }, this.wait * 1000)
                }
                if (this.armour) player.user.armour = this.armour;
            })


        }, this.wait ? this.wait * 1000 : system.TELEPORT_TIME + 3000)
    }
    private startSetTimers() {
        if(this.time){
            this.cTime = Math.floor(this.time);
            let int = setInterval(() => {
                this.cTime--;
                if(this.cTime <= 0 || this.end){
                    clearInterval(int)
                }
            }, 1000);
            setTimeout(() => {
                if(this.end) return;
                this.exit()
            }, this.time * 1000)
        }
    }
    startCapture(zoneId: number) {
        this.check()
        this.startHandleSpectators()
        this.startHandleTotalpoolForCapture(zoneId)
        this.started = true
        this.startSetTimers()
    }
    start(){
        this.check()
        this.startHandleSpectators()
        this.startHandleTotalpool()
        this.started = true
        this.startSetTimers()
    }
    playerDeath(player: PlayerMp, killer?: string){
        this.check()
        CustomEvent.triggerClient(player, 'deathmath:stop')
        if(this.weapon && mp.players.exists(player)) player.user.removeWeapon();
        if(this.armour && mp.players.exists(player)) player.armour = 0
        this.team1.map((item, index) => {
            if(item.player.dbid == player.dbid) {
                this.team2_score++;
                if(!this.hospital && mp.players.exists(player)) player.user.teleport(item.enter.x, item.enter.y, item.enter.z, item.enter.h, item.enter.d, true)
                this.team1.splice(index, 1);
                this.leaveNotify(item.name, true, killer);
            }
        })
        this.team2.map((item, index) => {
            if(item.player.dbid == player.dbid) {
                this.team1_score++;
                if(!this.hospital && mp.players.exists(player)) player.user.teleport(item.enter.x, item.enter.y, item.enter.z, item.enter.h, item.enter.d, true)
                this.team2.splice(index, 1);
                this.leaveNotify(item.name, true, killer);
            }
        })
        if(this.team1.length === 0 || this.team2.length === 0) this.exit()
    }
    get winner(){
        if(this.team1.length === 0) return 2;
        if(this.team2.length === 0) return 1;
        if(this.team1_score > this.team2_score) return 1;
        if(this.team1_score < this.team2_score) return 2;
        return 1;
    }
    async exit(){
        this.check()
        if(this.end) return;
        this.end = true;
        const winner = this.winner;
        this.events.map(q => {
            q(winner);
        })
        this.spectators.map(item => {
            item.player.outputChatBox(`Победила команда ${winner == 1 ? this.team1_name : this.team2_name}`);
            CustomEvent.triggerClient(item.player, 'deathmath:stop')
            menu.accept(item.player, 'Подтвердите выход', 'small', 60000).then(status => {
                item.player.user.teleport(item.enter.x, item.enter.y, item.enter.z, item.enter.h, item.enter.d, true)
            })
        })
        if(this.exitTimeout) {
            this.totalpool.map(item => {
                const user = item.player.user;
                if(!user) return;
                CustomEvent.triggerClient(item.player, 'deathmath:stop', false)
                user.drawTimer('Выход из боя', this.exitTimeout);
            });
            await system.sleep(this.exitTimeout * 1000)
            this.check()
        }
        this.totalpool.map(item => {
            const user = item.player.user;
            if(!user) return;
            user.teleport(item.enter.x, item.enter.y, item.enter.z, item.enter.h, item.enter.d, true)
            CustomEvent.triggerClient(item.player, 'deathmath:stop')
            if(this.weapon) item.player.user.removeWeapon();
            if(this.armour) item.player.armour = 0;
        })
        this.team1 = []
        this.team2 = []
    }
    stop(){
        this.check()
    }
    destroy(){
        if(DeathMath.list.findIndex(q => q.id === this.id) > -1)DeathMath.list.splice(DeathMath.list.findIndex(q => q.id === this.id), 1);
    }
    events:eventEnd[] = []
    handler(ev:eventEnd){
        this.events.push(ev);
    }
}

mp.events.add('playerDeath', (player: PlayerMp, reason: any, killer: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    setTimeout(() => {
        if(!mp.players.exists(player)) return;
        const dm = DeathMath.getByPlayer(player);
        if(!dm) return;
        dm.playerDeath(player, killer && killer.user ? killer.user.name : null);
    }, 2000)
})