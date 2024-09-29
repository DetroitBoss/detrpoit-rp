import {BaseTask, BaseTaskConfig, IBaseTask, HuntTaskConfig} from "../../../../shared/battlePass/tasks";
import {User} from "../../user";

export const HUNT_TASK_MANAGER_EVENT = 'battlePass::task::hunt';

export class HuntTaskManager extends BaseTask implements IBaseTask {
    static type = 'hunt';

    constructor(taskId: number, user: User, cfg: BaseTaskConfig, goalsCount: number) {
        super(taskId, user, cfg, goalsCount);

        this.init();
    }

    init() {
        mp.events.add(HUNT_TASK_MANAGER_EVENT, this.handle);
    }

    handle = (player: PlayerMp, itemId: number) => {
        if (!player || !player.user || player.user.id !== this.user.id || itemId !== (this.cfg as HuntTaskConfig).itemId)
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
        mp.events.remove(HUNT_TASK_MANAGER_EVENT, this.handle);
    }
}