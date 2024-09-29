import {
    BaseTask,
    BaseTaskConfig,
    FishingTaskConfig,
    IBaseTask
} from "../../../../shared/battlePass/tasks";
import {User} from "../../user";

export const FISHING_TASK_MANAGER_EVENT = 'battlePass::task::fishing';

export class FishingTaskManager extends BaseTask implements IBaseTask {
    static type = 'fishing';

    constructor(taskId: number, user: User, cfg: BaseTaskConfig, goalsCount: number) {
        super(taskId, user, cfg, goalsCount);

        this.init();
    }

    init() {
        mp.events.add(FISHING_TASK_MANAGER_EVENT, this.handle);
    }

    handle = (player: PlayerMp, fishId: number) => {
        if (!player || !player.user || player.user.id !== this.user.id ||
            fishId !== (this.cfg as FishingTaskConfig).fishId)
            return;

        if (this.isComplete) return;

        this.goalsCount++;
        this.onUpdate();
    }

    onDestroy() {
        mp.events.remove(FISHING_TASK_MANAGER_EVENT, this.handle);
    }

    onUpdate() {
        this.cfg.id === -1 ?
            this.user.battlePass.updateGlobalTask(this.goalsCount, this.isComplete, this.cfg.expReward)
            :
            this.user.battlePass.updateBasicTask(this.taskId, this.goalsCount);
    }
}