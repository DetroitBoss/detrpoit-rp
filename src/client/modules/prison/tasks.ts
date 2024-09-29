import {IPrisonTask} from "../../../shared/prison/IPrisonTask";
import {CustomEvent} from "../custom.event";
import {
    COOKING_POSITIONS,
    HAMMER_POSITIONS,
    SEWING_POSITIONS,
    TASK_TYPES,
    TASKS_BLIP_POSITION, TOILET_POSITIONS,
    WASHING_POSITIONS
} from "../../../shared/prison/tasks.config";
import {system} from "../system";
import {user} from "../user";
import {colshapes} from "../checkpoints";
import {MINIGAME_TYPE} from "../../../shared/minigame";
import {MinigamePlay} from "../minigame";
import {createRouteBlip, destroyRouteBlip} from "../blips";

let prisonTask: IPrisonTask | null = null;
let sHash: string | null = null;

CustomEvent.registerServer('prison:tasks:start', (data) => {
    sHash = data;

    const index = Math.floor(Math.random() * TASK_TYPES.length);
    const type = TASK_TYPES[index];

    user.notify('Вы успешно взяли задания, направляйтесь на их выполнение', 'success');

    createRouteBlip('Тюремная работа', TASKS_BLIP_POSITION[index], 28);

    prisonTask = {
        type: type,
        count: system.getRandomInt(4, 20),
        completed: 0
    };

    CustomEvent.triggerCef('prison:task:update', prisonTask);
});

function gameComplete(type: MINIGAME_TYPE) {
    if (prisonTask.type !== type) return;

    prisonTask.completed += 1;

    CustomEvent.triggerCef('prison:task:update', prisonTask);

    if (prisonTask.count <= prisonTask.completed) {
        CustomEvent.callServer('prison:tasks:finish', prisonTask.count, sHash).then(res => {
            if (res === true) {
                destroyRouteBlip('Тюремная работа');
                prisonTask = null;
                user.notify("Задания успешно выполнены, можете отправляться за новыми");
                CustomEvent.triggerCef('prison:task:update', null);
            }
        });
    }
}

colshapes.new(
    SEWING_POSITIONS,
    "Швейная",
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILSEWING) return user.notify("Вам недоступна данная работа", "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILSEWING);

        if (res) gameComplete(MINIGAME_TYPE.JAILSEWING);
    },
    {
        color: [0, 0, 0, 0]
    }
);

colshapes.new(
    HAMMER_POSITIONS,
    "Столярка",
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILHAMMER) return user.notify("Вам недоступна данная работа", "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILHAMMER);

        if (res) gameComplete(MINIGAME_TYPE.JAILHAMMER);
    },
    {
        color: [0, 0, 0, 0]
    }
)

colshapes.new(WASHING_POSITIONS,
    "Прачечная",
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILWASHING) return user.notify("Вам недоступна данная работа", "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILWASHING);

        if (res) gameComplete(MINIGAME_TYPE.JAILWASHING);
    },
    {
        color: [0, 0, 0, 0]
    }
)

colshapes.new(COOKING_POSITIONS,
    "Готовка",
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILCOOKING) return user.notify("Вам недоступна данная работа", "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILCOOKING);

        if (res) gameComplete(MINIGAME_TYPE.JAILCOOKING);
    },
    {
        color: [0, 0, 0, 0]
    }
)

colshapes.new(TOILET_POSITIONS,
    "Чистка унитазов",
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILTOILET) return user.notify("Вам недоступна данная работа", "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILTOILET);

        if (res) gameComplete(MINIGAME_TYPE.JAILTOILET);
    },
    {
        color: [0, 0, 0, 0]
    }
)



/*
mp.events.add('prison:tasks:gameComplete', (type: string, hash: string) => {
    if (prisonTask.type !== type) return;
    if (hash !== exhash) return;
    exhash = null;

    prisonTask.completed += 1;

    if (prisonTask.count <= prisonTask.completed) {
        CustomEvent.callServer('prison:tasks:finish', prisonTask.count, sHash).then(res => {
            if (res === true) user.notify("Задания успешно выполнены, можете отправляться за новыми");
        });
    }
});
*/
