import {User} from "../../server/modules/user";

export type taskType = 'job' | 'fishing' | 'hunt' | 'farm';

export abstract class BaseTask {
    user: User
    goalsCount: number
    cfg: BaseTaskConfig
    taskId: number

    protected constructor(taskId: number, user: User, cfg: BaseTaskConfig, goalsCount: number) {
        this.taskId = taskId;
        this.user = user;
        this.cfg = cfg;
        this.goalsCount = goalsCount;
    }

    get isComplete(): boolean {
        return this.goalsCount >= this.cfg.goal;
    }
}

export interface IBaseTask {
    init: () => void
    onDestroy: () => void
    onUpdate: () => void
}

export interface ITaskSave {
    taskId: number,
    goalsCount: number
}

export interface IBasicTasksSave {
    time: number
    tasks: ITaskSave[]
}

export abstract class BaseTaskConfig {
    id: number
    name: string
    desc: string
    goal: number
    expReward: number

    protected constructor(
        id: number,
        name: string,
        desc: string,
        goal: number,
        expReward: number
    ) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.goal = goal;
        this.expReward = expReward;
    }
}

/** Работы **/

export type jobType =
    'bus'
    | 'diving'
    | 'electric'
    | 'taxi'
    | 'trucker'
    | 'apartmentRepair'
    | 'collector'
    | 'cleaning'
    | 'builder'
    | 'firefighter'
    | 'garden';

export class JobTaskConfig extends BaseTaskConfig {
    jobType: jobType
    type: taskType = 'job'

    constructor(
        id: number,
        name: string,
        desc: string,
        goal: number,
        expReward: number,
        jobType: jobType
    ) {
        super(id, name, desc, goal, expReward);
        this.jobType = jobType;
    }
}

/** Рыбалка **/

export class FishingTaskConfig extends BaseTaskConfig {
    fishId: number
    type: taskType = 'fishing'

    constructor(
        id: number,
        name: string,
        desc: string,
        goal: number,
        expReward: number,
        fishId: number
    ) {
        super(id, name, desc, goal, expReward);
        this.fishId = fishId;
    }
}

/** Охота **/

export class HuntTaskConfig extends BaseTaskConfig {
    itemId: number
    type: taskType = 'hunt'

    constructor(
        id: number,
        name: string,
        desc: string,
        goal: number,
        expReward: number,
        itemId: number
    ) {
        super(id, name, desc, goal, expReward);
        this.itemId = itemId;
    }
}

/** Ферма **/

export class FarmTaskConfig extends BaseTaskConfig {
    itemId: number
    isLanding: boolean
    type: taskType = 'farm'

    constructor(
        id: number,
        name: string,
        desc: string,
        goal: number,
        expReward: number,
        itemId: number,
        isLanding: boolean
    ) {
        super(id, name, desc, goal, expReward);
        this.itemId = itemId;
        this.isLanding = isLanding;
    }
}