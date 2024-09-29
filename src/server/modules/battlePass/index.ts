import {BATTLE_PASS_SEASON, IBattlePassRating} from "../../../shared/battlePass/main";
import {IBattlePassSeason} from "../../../shared/battlePass/season";
import {BattlePassEntity} from "../typeorm/entities/battlePass";
import {CustomEvent} from "../custom.event";
import {system} from "../system";
import {RatingDTO, TaskDTO} from "../../../shared/battlePass/DTOs";
import {User} from "../user";
import {BaseTask} from "../../../shared/battlePass/tasks";
import {gui} from "../gui";
import {writeSpecialLog} from "../specialLogs";
import './storage';
import {battlePassStorage} from "./storage";


class BattlePass {
    private _season: IBattlePassSeason;
    private _expInterval: number
    private _rating: Map<number, IBattlePassRating> = new Map<number, IBattlePassRating>();
    private _publicRating: RatingDTO[] = []
    private _randomExpSent: boolean = false

    constructor(season: IBattlePassSeason) {
        this._season = season;
        CustomEvent.registerCef('battlePass:buy', this.buyBattlePass)
        CustomEvent.registerCef('battlePass:openInterface', this.openInterfaceHandle);
        CustomEvent.registerClient('battlePass:openInterface', this.openInterfaceHandle);
        CustomEvent.register('battlePass:openInterface', this.openInterfaceHandle);
        CustomEvent.registerCef('battlePass:takeReward', this.takeRewardHandle);
        CustomEvent.registerCef('battlePass:buyLevels', this.buyLevels)
        CustomEvent.registerCef('battlePass:sendGiftPass', this.giftPass)
        CustomEvent.registerCef('battlePass:sendGiftLevels', this.giftLevels)
        CustomEvent.register('battlePass:setRating', this.setRating)
        gui.chat.registerCommand('bpexp', (player: PlayerMp, id, count) => this.giveAdminExp(player, id, count));

        this._expInterval = setInterval(() => this.expIntervalHandle(), 120000);

        setTimeout(() => this.init(), 5000);

        setInterval(() => this.updatePublicRating(), 10000);
    }

    private giveAdminExp(player: PlayerMp, id: string, count: string) {
        if (!player.user || !player.user.isAdminNow(6)) return;

        if (!id || !count) return;

        const target = User.get(parseInt(id));

        if (!target || !target.user) return player.notify('Игрок не найден', 'error');
        if (!target.user.battlePass || !target.user.battlePass.battlePassEntity)
            return player.notify('У игрока отсутсвует боевой пропуск', 'error');

        const exp = parseInt(count);

        if (exp < 0 || exp > 9999) return player.notify('Неверное количество опыта', 'error');

        target.user.battlePass.addExp(exp);
        writeSpecialLog(`Выдал опыт боевого пропуска - ${exp}`, player, target.user.id);
    }

    private setRating = (staticId: number, name: string, exp: number) => {
        this._rating.set(staticId, {name, exp});
    }

    public saveAll() {
        const users = [...User.list.values()];
        for (let user of users) {
            if (user.battlePass && user.battlePass.battlePassEntity) {
                user.battlePass.battlePassEntity.save();
            }
        }
    }

    private randomExpPrize = () => {
        if (this._randomExpSent) return;

        const date = new Date();

        if (this._season.randomExp.hour !== date.getHours() && this._season.randomExp.minute !== date.getMinutes())
            return;

        const players = mp.players.toArray().filter(player => {
            return !!(player && player.user && player.user.battlePass && player.user.battlePass.battlePassEntity);
        });

        if (players.length === 0) return;

        const winner = players[Math.floor(Math.random() * players.length)],
            user = winner.user,
            name = user.name;

        if (!user || !user.battlePass || !user.battlePass.battlePassEntity) return;

        this._randomExpSent = true;
        user.battlePass.addExp(this._season.randomExp.exp);

        players.forEach(player => {
            if (!player.user) return;

            player.outputChatBox(`${name} - выиграл ежедневный розыгрыш опыта от боевого пропуска`);
        })
    }

    private async init() {
        const result = await BattlePassEntity.find({
            where: {
                battlePassId: this._season.id
            }
        })
        if (!result) return;

        result.forEach(async (el) => {
            const UserEntity = await User.getData(el.userId);
            this._rating.set(el.userId, {
                name: UserEntity.rp_name,
                exp: el.exp
            })
        });

        this.updatePublicRating();
    }

    private updatePublicRating = () => {
        this.randomExpPrize();

        let array: RatingDTO[] = [];
        this._rating.forEach((el, key) => {
            array.push({
                id: key,
                name: el.name,
                exp: el.exp
            })
        })

        array = array.sort((a, b) => b.exp - a.exp)

        array.forEach((el, key) => {
            el.place = key;
        })
        this._publicRating = array;
    }

    private getRatingForPlayer(id: number): RatingDTO[] {
        const array: RatingDTO[] = [];
        let exist = false;

        this._publicRating.every((el, key) => {
            if (key > 9) return false;
            array.push(el);
            return true;
        })

        array.forEach((el) => {
            if (el.id === id) exist = true;
        })


        if (!exist) {
            const personalRating = this._publicRating.find(el => el.id === id);

            if (!personalRating) return array;

            array.push(personalRating);
        }

        return array;
    }

    private expIntervalHandle = () => {
        mp.players.forEach((player: PlayerMp) => {
            if (!player || !player.user || !player.user.battlePass || !player.user.battlePass.battlePassEntity) return;

            if (player.user.battlePass.haveEveryDayExp) return;

            if (player.user.stats.getDto().dailyOnline >= this._season.everyDayExp.time)
                player.user.battlePass.giveEveryDayExp();
        })
    }

    private giftLevels = async (player: PlayerMp, staticId: number, levels: number) => {
        if (player.user.battlePass && player.user.battlePass.isSpam()) return;
        const cost = levels * this._season.levelPrice;

        if (player.user.donate_money < cost)
            return player.user.notify('У вас недостаточно коинов');

        let online = true,
            target = User.get(staticId)

        if (!target || !target.user) online = false;

        const userEntity = await User.getData(staticId)

        if (!userEntity) return player.notify('Игрок не найден', 'error');

        if (online) {
            if (target.user.battlePass.battlePassEntity === undefined)
                return player.notify('У игрока отсутствует боевой пропуск', 'error');
            player.user.donate_money = player.user.donate_money - cost;

            target.user.battlePass.addExp(levels * this._season.levelExp);
            target.notify(`Вам подарили уровни боевого пропуска в размере - ${levels}`, 'info');
        } else {
            const battlePassEntities = await BattlePassEntity.find({
                where: {
                    battlePassId: this._season.id,
                    user: {id: staticId}
                }
            });

            if (!battlePassEntities || !battlePassEntities[0])
                return player.notify('У игрока отсутствует боевой пропуск', 'error');

            player.user.donate_money = player.user.donate_money - cost;

            battlePassEntities[0].exp = battlePassEntities[0].exp + levels * this._season.levelExp;

            battlePassEntities[0].save();

            const UserEntity = await User.getData(staticId);

            if (!UserEntity || !UserEntity.rp_name) return;

            this._rating.set(staticId, {name: UserEntity.rp_name, exp: battlePassEntities[0].exp})
        }

        player.notify('Вы успешно подарили уровни боевого пропуска');
        player.user.log('battlePass', `Подарил уровни battle pass'а ${levels}`, staticId);
    }

    private giftPass = async (player: PlayerMp, staticId: number) => {
        if (player.user.battlePass && player.user.battlePass.isSpam()) return;

        let cost: number;

        if (this._season.discount.expires > system.timestamp) {
            cost = this._season.discount.specialPrice;
        } else {
            cost = this._season.battlePassCost;
        }

        if (player.user.donate_money < cost)
            return player.notify('У вас недостаточно коинов', 'error');

        let online = true,
            target = User.get(staticId)

        if (!target || !target.user) online = false;

        const userEntity = await User.getData(staticId)

        if (!userEntity) return player.notify('Игрок не найден', 'error');

        if (online) {
            if (target.user.battlePass.battlePassEntity !== undefined)
                return player.notify('У игрока уже имеется пропуск', 'error');
            player.user.donate_money = player.user.donate_money - cost;

            target.user.battlePass.giftBattlePass();
            target.notify('Вам подарили боевой пропуск', 'info');
        } else {
            const battlePassEntities = await BattlePassEntity.find({
                where: {
                    battlePassId: this._season.id,
                    user: {id: staticId}
                }
            });

            if (battlePassEntities && battlePassEntities[0])
                return player.notify('У игрока уже имеется пропуск', 'error');

            player.user.donate_money = player.user.donate_money - cost;

            const battlePassEntity = BattlePassEntity.create({
                battlePassId: this._season.id,
                user: userEntity,
                receivedRewards: JSON.stringify([]),
                exp: 0,
                globalTaskProgress: JSON.stringify({taskId: 0, goalsCount: 0}),
                basicTasksProgress: JSON.stringify(player.user.battlePass.generateBasicTasksSave())
            });

            battlePassEntity.save();
            this._rating.set(staticId, {name: userEntity.rp_name, exp: 0});
        }

        player.notify('Вы успешно подарили боевой пропуск');
        player.user.log('battlePass', `Подарил battle pass`, staticId);

        //data = target && target.user ? target.user.entity : await User.getData(staticId);
    }

    private buyLevels = (player: PlayerMp, levels: number) => {
        if (!player || !player.user || !player.user.battlePass) return;
        player.user.battlePass.buyLevels(levels);
    }

    private takeRewardHandle = (player: PlayerMp, level: number) => {
        if (!player.user) return;
        if (!player.user.battlePass || !player.user.battlePass.battlePassEntity) return;
        if (Math.trunc(player.user.battlePass.battlePassEntity.exp / this._season.levelExp) < level + 1)
            return player.notify('Вам недоступен данный приз', 'error');
        player.user.battlePass.giveReward(level);
    }

    buyBattlePass = (player: PlayerMp) => {
        if (!player || !player.user || !player.user.battlePass) return;

        player.user.battlePass.buyBattlePass();
    }

    openInterfaceHandle = (player: PlayerMp) => {
        if (!player.user) return;

        if (player.user.battlePass.battlePassEntity) {
            const time = new Date(this._season.endTime * 1000),
                expires = ("0" + time.getDate()).slice(-2) + "." +
                    ("0" + (time.getMonth() + 1)).slice(-2) + "." +
                    time.getFullYear() + " " +
                    ("0" + time.getHours()).slice(-2) + ":" +
                    ("0" + time.getMinutes()).slice(-2) + ":" +
                    ("0" + time.getSeconds()).slice(-2);

            player.user.setGui('battlePass', 'battlePass:setComponent', 'main');

            CustomEvent.triggerCef(player, 'battlePass:setData', {
                exp: player.user.battlePass.battlePassEntity.exp,
                receivedRewards: player.user.battlePass.battlePassEntity.receiveRewards,
                battlePassExpires: expires,
                coins: player.user.donate_money,
                discountActive: this._season.discount.expires - system.timestamp > 5,
                everyDayExp: player.user.battlePass.haveEveryDayExp ? 'Получен'
                    :
                    `${this._season.everyDayExp.time - player.user.stats.getDto().dailyOnline} час/ов`
            });

            CustomEvent.triggerCef(player, 'battlePass:setRating', this.getRatingForPlayer(player.user.id));
            battlePassStorage.updatePlayerStorage(player);

            const basic: TaskDTO[] = [];
            let globalTasks: TaskDTO;

            player.user.battlePass.basicTasks.map((el: BaseTask) => {
                basic.push({
                    exp: el.cfg.expReward,
                    name: el.cfg.name,
                    desc: el.cfg.desc,
                    progress: el.goalsCount,
                    goal: el.cfg.goal
                })
            })

            if (player.user.battlePass.globalTask?.cfg) {
                globalTasks = {
                    exp: player.user.battlePass.globalTask.cfg.expReward,
                    name: player.user.battlePass.globalTask.cfg.name,
                    desc: player.user.battlePass.globalTask.cfg.desc,
                    progress: player.user.battlePass.globalTask.goalsCount,
                    goal: player.user.battlePass.globalTask.cfg.goal
                };
            }

            if (globalTasks) {
                CustomEvent.triggerCef(player, 'battlePass:setTasksData', {
                    global: globalTasks,
                    basic
                });
            } else {
                CustomEvent.triggerCef(player, 'battlePass:setTasksData', {
                    basic
                });
            }
        } else {
            player.user.setGui('battlePass', 'battlePass:setComponent', 'purchase');
            battlePassStorage.updatePlayerStorage(player);
            CustomEvent.triggerCef(
                player,
                'battlePass:purchase',
                this._season.discount.expires - system.timestamp > 5 ?
                    {
                        coins: player.user.donate_money,
                        discountActive: true,
                        price: this._season.battlePassCost,
                        expires: this._season.discount.expires - system.timestamp,
                        discountPrice: this._season.discount.specialPrice
                    }
                    :
                    {
                        coins: player.user.donate_money,
                        discountActive: false,
                        price: this._season.battlePassCost
                    }
            );
        }
    }

}

export default new BattlePass(BATTLE_PASS_SEASON);