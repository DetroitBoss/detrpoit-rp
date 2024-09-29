import {BaseTask, BaseTaskConfig, FarmTaskConfig, IBaseTask} from "../../../../shared/battlePass/tasks";
import {User} from "../../user";

export const FARM_TASK_MANAGER_EVENT = 'battlePass::task::farm';

export class FarmTaskManager extends BaseTask implements IBaseTask {
    static type = 'farm'

    constructor(taskId: number, user: User, cfg: BaseTaskConfig, goalsCount: number) {
        super(taskId, user, cfg, goalsCount);

        this.init();
    }

    init() {
        mp.events.add(FARM_TASK_MANAGER_EVENT, this.handle);
    }

    handle = (player: PlayerMp, itemId: number, isLanding: boolean) => {
        if (!player || !player.user || player.user.id !== this.user.id
            || itemId !== (this.cfg as FarmTaskConfig).itemId || isLanding !== (this.cfg as FarmTaskConfig).isLanding)
            return;
        if (this.isComplete) return;

        this.goalsCount++;
        this.onUpdate();
    }

    onUpdate() {
        this.cfg.id === -1 ?
            this.user.battlePass.updateGlobalTask(this.goalsCount, this.isComplete, this.cfg.expReward)
            :
            this.user.battlePass.updateBasicTask(this.taskId, this.goalsCount);
    }

    onDestroy() {
        mp.events.remove(FARM_TASK_MANAGER_EVENT, this.handle);
    }
}