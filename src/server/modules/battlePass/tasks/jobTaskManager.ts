import {
    BaseTask,
    BaseTaskConfig,
    IBaseTask,
    JobTaskConfig,
    jobType,
    taskType
} from "../../../../shared/battlePass/tasks";
import {User} from "../../user";

export const JOB_TASK_MANAGER_EVENT = 'battlePass::task::job';

export class JobTaskManager extends BaseTask implements IBaseTask {
    static type: taskType = 'job'

    constructor(taskId: number, user: User, cfg: BaseTaskConfig, goalsCount: number) {
        super(taskId, user, cfg, goalsCount);

        this.init()
    }

    init() {
        mp.events.add(JOB_TASK_MANAGER_EVENT, this.handle);
    }

    handle = (player: PlayerMp, jobType: jobType) => {
        if (!player || !player.user || player.user.id !== this.user.id || jobType !== (this.cfg as JobTaskConfig).jobType)
            return;
        if (this.isComplete) return;

        this.goalsCount++;
        this.onUpdate();
    }

    onDestroy() {
        mp.events.remove(JOB_TASK_MANAGER_EVENT, this.handle);
    }

    onUpdate() {
        this.cfg.id === -1 ?
            this.user.battlePass.updateGlobalTask(this.goalsCount, this.isComplete, this.cfg.expReward)
            :
            this.user.battlePass.updateBasicTask(this.taskId, this.goalsCount);
    }
}