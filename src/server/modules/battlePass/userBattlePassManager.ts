import {User} from "../user";
import {BattlePassEntity} from "../typeorm/entities/battlePass";
import {IBattlePassSeason} from "../../../shared/battlePass/season";
import {BASIC_TASKS_COUNT, BATTLE_PASS_SEASON} from "../../../shared/battlePass/main";
import {RewardManager} from "./rewardManager";
import {BaseTask, IBasicTasksSave, ITaskSave} from "../../../shared/battlePass/tasks";
import {getTaskManager} from "./tasks";
import {system} from "../system";
import {CustomEvent} from "../custom.event";

export class UserBattlePassManager {
    private readonly _user: User;
    private readonly _season: IBattlePassSeason = BATTLE_PASS_SEASON;
    public battlePassEntity: BattlePassEntity;
    globalTask: BaseTask | null;
    basicTasks: BaseTask[];
    public antiSpam: number = 0;

    constructor(user: User) {
        this._user = user;
        user.afterLoginEvents.push(this.load.bind(this));
    }

    public giveEveryDayExp() {
        this.addExp(this._season.everyDayExp.exp);
        this.battlePassEntity.expReward = system.timestamp;
        this.battlePassEntity.save();
        this._user.player.notify(`Вы получили ежедневный опыт боевого пропуска ${this._season.everyDayExp.exp}`,
            'info');
    }

    get haveEveryDayExp() {
        return system.timestamp - this.battlePassEntity.expReward < 86400;
    }

    buyBattlePass() {
        if (this.battlePassEntity)
            return this._user.notify('У вас уже есть боевой пропуск');

        let cost: number;

        if (this._season.discount.expires > system.timestamp) {
            cost = this._season.discount.specialPrice;
        } else {
            cost = this._season.battlePassCost;
        }

        if (this._user.donate_money < cost)
            return this._user.notify('У вас недостаточно коинов', 'error');

        this._user.donate_money = this._user.donate_money - cost;
        this._user.notify('Вы успешно приобрели боевой пропуск', 'success');
        this.createBattlePassEntity();
        this.loadGlobalTask();
        this.loadBasicTasks();
        this._user.log('battlePass', `Купил боевой пропуск`);
        CustomEvent.trigger('battlePass:setRating', this._user.id, this._user.name, 0);
        CustomEvent.trigger('battlePass:openInterface', this._user.player);
    }

    public giftBattlePass() {
        this.createBattlePassEntity();
        this.loadGlobalTask();
        this.loadBasicTasks();
    }

    /** Выгрузка текущего прогресса батл пасса **/
    private async load() {
        const battlePassEntities = await BattlePassEntity.find({
            where: {
                user: {id: this._user.id},
                battlePassId: this._season.id
            }
        });

        if (battlePassEntities && battlePassEntities[0]) {
            this.battlePassEntity = battlePassEntities[0];
            this.loadGlobalTask();
            this.loadBasicTasks();
        }
    }

    public isSpam() {
        if (system.timestampMS - this.antiSpam < 2000) {
            this._user.player.notify('Слишком быстро, попробуйте помедленнее', 'error');
            return true;
        }else{
            this.antiSpam = system.timestampMS;
            return false;
        }
    }

    private loadGlobalTask() {
        if (!this.battlePassEntity.globalTask) return;
        if (!this._season.globalTasks[this.battlePassEntity.globalTask.taskId]) {
            this.globalTask = null;
            return;
        }


        const cfg = this._season.globalTasks[this.battlePassEntity.globalTask.taskId];

        if (!cfg) return;

        // @ts-ignore
        const TaskManager = getTaskManager(cfg.type);

        if (!TaskManager) return;

        this.globalTask = new TaskManager(
            this.battlePassEntity.globalTask.taskId,
            this._user,
            cfg,
            this.battlePassEntity.globalTask.goalsCount
        );
    }

    private loadBasicTasks() {
        if (this.battlePassEntity.basicTasks.time < system.timestamp) {
            this.battlePassEntity.basicTasks = this.generateBasicTasksSave();
        }

        const basicTasks: BaseTask[] = [];

        this.battlePassEntity.basicTasks.tasks.map((el) => {
            const cfg = this._season.basicTasks.find(element => element.id === el.taskId);

            if (!cfg) return;

            // @ts-ignore
            const TaskManager = getTaskManager(cfg.type);

            if (!TaskManager) return;

            basicTasks.push(new TaskManager(
                cfg.id,
                this._user,
                cfg,
                el.goalsCount
            ))
        })

        this.basicTasks = basicTasks;
    }

    generateBasicTasksSave(): IBasicTasksSave {
        const arr: ITaskSave[] = [];
        let i = 0;

        while (i !== BASIC_TASKS_COUNT) {
            const cfg = this._season.basicTasks[Math.floor(Math.random() * this._season.basicTasks.length)];

            if (!arr.find(el => el.taskId === cfg.id)) {
                arr.push({taskId: cfg.id, goalsCount: 0});
                i++;
            }
        }

        return {
            time: system.timestamp + 86400,
            tasks: arr
        }
    }

    updateGlobalTask(goalsCount: number, isCompleted: boolean = false, expReward: number): void {
        if (isCompleted) {
            const globalTask = this.battlePassEntity.globalTask;
            globalTask.taskId += 1;
            globalTask.goalsCount = 0;
            this.battlePassEntity.globalTask = globalTask;
            // @ts-ignore
            this.globalTask.onDestroy();
            this.loadGlobalTask();
            this.addExp(expReward);
            this.battlePassEntity.save();
            this._user.log('battlePass', `Получил ${expReward} exp за выполнение глобального задания`);
        } else {
            const globalTask = {...this.battlePassEntity.globalTask};
            globalTask.goalsCount = goalsCount;
            this.battlePassEntity.globalTask = globalTask;
        }
    }

    updateBasicTask(id: number, goalsCount: number): void {
        let index = -1;
        const cfg = this._season.basicTasks.find(element => element.id === id),
            savable = this.battlePassEntity.basicTasks.tasks.find((el, i) => {
                if (el.taskId === id) index = i;
                return el.taskId === id
            });

        if (savable.goalsCount >= cfg.goal) return;
        if (index === -1) return;

        if (goalsCount === cfg.goal) {
            this.addExp(cfg.expReward);
            this._user.log('battlePass', `Получил ${cfg.expReward} exp за выполнение задания`);
        }

        const basicTasks = {...this.battlePassEntity.basicTasks};
        basicTasks.tasks[index].goalsCount = goalsCount;
        this.battlePassEntity.basicTasks = basicTasks;
    }

    /** Создание сущности прогресса в БД  **/
    private createBattlePassEntity(): void {
        this.battlePassEntity = BattlePassEntity.create({
            battlePassId: this._season.id,
            user: this._user.entity,
            receivedRewards: JSON.stringify([]),
            exp: 0,
            globalTaskProgress: JSON.stringify({taskId: 0, goalsCount: 0}),
            basicTasksProgress: JSON.stringify(this.generateBasicTasksSave())
        });

        this.battlePassEntity.save();
    }

    /** Получил ли игрок вознагрождение за определенный уровень **/
    public isRewardReceived(level: number): boolean {
        const rewards: number[] = this.battlePassEntity.receiveRewards;
        return !!rewards.find(el => el === level);
    }

    /** Выдача вознагрождение за уровень **/
    public giveReward(level: number): void {
        if (this.isRewardReceived(level))
            return this._user.notify('Вы уже получили вознагрождение за текущий уровень');

        RewardManager.give(this._user, level);
    }

    public addExp(exp: number): void {
        this.battlePassEntity.exp += exp;
        this.battlePassEntity.save();
        CustomEvent.triggerCef(this._user.player, 'battlePass:updateExp', this.battlePassEntity.exp);
        CustomEvent.trigger('battlePass:setRating', this._user.id, this._user.name, this.battlePassEntity.exp);
    }

    public getEXP(): number {
        return this.battlePassEntity.exp;
    }

    public getLevel(): number {
        return Math.floor(this.battlePassEntity.exp / this._season.levelExp);
    }

    public buyLevels(levels: number): void {
        const cost = levels * this._season.levelPrice;

        if (this._user.donate_money < cost)
            return this._user.notify('У вас недостаточно коинов');

        this._user.donate_money = this._user.donate_money - cost;

        this.addExp(this._season.levelExp * levels);
        this._user.player.notify(`Уровень батл пасса повышен до ${this.getLevel}`, 'success');
        this._user.log('battlePass', `Купил уровни батл пасса - ${levels}`);
    }

    public destroy(): void {
        if (this.globalTask) {
            // @ts-ignore
            this.globalTask.onDestroy();
        }

        if (this.basicTasks) {
            this.basicTasks.map(el => {
                // @ts-ignore
                el.onDestroy();
            })
        }
    }
}


mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player || !player.user || !player.user.battlePass || !player.user.battlePass.battlePassEntity) return;

    player.user.battlePass.battlePassEntity.save();
    player.user.battlePass.destroy();
});