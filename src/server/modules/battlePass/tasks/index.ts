import {taskType} from "../../../../shared/battlePass/tasks";
import {JobTaskManager} from "./jobTaskManager";
import {FishingTaskManager} from "./fishingTaskManager";
import {HuntTaskManager} from "./huntTaskManager";
import {FarmTaskManager} from "./farmTaskManager";

export function getTaskManager(type: taskType) {
    let TaskManager;

    switch (type) {
        case "job": {
            TaskManager = JobTaskManager;
            break;
        }
        case "fishing": {
            TaskManager = FishingTaskManager;
            break;
        }
        case "hunt": {
            TaskManager = HuntTaskManager;
            break;
        }
        case "farm": {
            TaskManager = FarmTaskManager;
            break;
        }
    }

    return TaskManager;
}