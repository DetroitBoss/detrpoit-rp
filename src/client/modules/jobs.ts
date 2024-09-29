import {CustomEvent} from "./custom.event";
import {getJobData, jobData, JobId, jobPointTaskPointItem, jobsList, TaskItem0, TaskItem1} from "../../shared/jobs";
import {system} from "./system";
import {colshapeHandle, colshapes} from "./checkpoints";
import {user} from "./user";
import {MinigamePlay} from "./minigame";
import {gui} from "./gui";

/** Текущая работа */
let currentJob: jobData;
/** Текущее задание */
let currentTask: TaskItem0 | TaskItem1;
/** Номер точки текущего задания */
let currentPoint: jobPointTaskPointItem;
let currentKey:string;

let shape: colshapeHandle;
let blip: BlipMp;

/** Выполняет ли игрок сейчас какую то работу */
export let doJobNow = false

CustomEvent.registerServer('job:start', (job:JobId, task: number, key:string) => {
    clearJob();
    currentJob = getJobData(job);
    currentTask = currentJob.tasks[task];
    currentKey = key;
    generateTask();
})
CustomEvent.registerServer('job:stop', () => {
    clearJob();
    currentJob = null;
    currentTask = null;
    currentKey = null;
})

CustomEvent.registerServer('job:data', (job: JobId, myjob: JobId, task:number, exp: number, clotheneed: boolean, clothe: boolean) => {
    gui.setGui('workselect');
    CustomEvent.triggerCef('job:data', job, myjob, task, exp, clotheneed, clothe)
})


const clearJob = () => {
    if (shape) shape.destroy();
    shape = null;

    if (blip && mp.blips.exists(blip)) blip.destroy();
    blip = null;
}

jobsList.map(item => {
    if (typeof item.icon === "number" && typeof item.icon_color === "number") {
        const pos = new mp.Vector3(item.pos.x, item.pos.y, item.pos.z)
        system.createBlip(item.icon, item.icon_color, pos, item.name);
    }
});

const generateTask = () => {
    clearJob();
    let randomPoint = system.randomArrayElement(currentTask.points);
    currentPoint = randomPoint;
    let pos = new mp.Vector3(currentPoint.x, currentPoint.y, currentPoint.z)
    blip = system.createBlip(1, 1, pos, "Точка назначения", 0, false)
    shape = colshapes.new(pos, "", async player => {
        if(!currentJob) return;
        if (player.vehicle && !currentJob.allowVehicle) return user.notify('Покиньте транспорт', 'error');
        clearJob();
        doJobNow = true
        if (currentPoint.entertext) user.notify(currentPoint.entertext);
        if (typeof currentPoint.task === "string") {
            user.playScenario(currentPoint.task, currentPoint.x, currentPoint.y, currentPoint.z, currentPoint.h, true);
        } else {
            user.playAnim([currentPoint.task], false, false)
        }
        if (currentPoint.time) await system.sleep(currentPoint.time * 1000)
        if(currentPoint.minigame && !(await MinigamePlay(currentPoint.minigame))){
            setTimeout(() => {
                generateTask();
            }, 2000)
            return user.stopAnim();
        }
        user.stopAnim()

        if (currentPoint.successtext) user.notify(currentPoint.successtext, 'success');

        doJobNow = false
        if (currentTask.type == 1) {
            let randomPoint = system.randomArrayElement(currentTask.pointsEnd);
            currentPoint = randomPoint;
            let pos = new mp.Vector3(currentPoint.x, currentPoint.y, currentPoint.z)
            blip = system.createBlip(1, 1, pos, "Точка назначения", 0, false)
            shape = colshapes.new(pos, "", async player => {
                clearJob();
                doJobNow = true
                if (currentPoint.entertext) user.notify(currentPoint.entertext);
                if (currentPoint.task) {
                    if (typeof currentPoint.task === "string"){
                        user.playScenario(currentPoint.task, currentPoint.x, currentPoint.y, currentPoint.z, currentPoint.h, true);
                    } else {
                        user.playAnim([currentPoint.task], false, false)
                    }
                }
                if (currentPoint.time) await system.sleep(currentPoint.time * 1000)
                if (currentPoint.minigame && !(await MinigamePlay(currentPoint.minigame))) {
                    setTimeout(() => {
                        generateTask();
                    }, 2000)
                    return user.stopAnim();
                }
                user.stopAnim()

                if (currentPoint.successtext) user.notify(currentPoint.successtext, 'success');

                doJobNow = false
                CustomEvent.triggerServer('job:success', currentKey)
                setTimeout(() => {
                    generateTask();
                }, 2000)
            }, {
                onenter: true
            })
        } else {
            CustomEvent.triggerServer('job:success', currentKey)
            setTimeout(() => {
                generateTask();
            }, 2000)
        }

    }, {
        onenter: true
    })
    
    
}